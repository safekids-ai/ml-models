import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrgUnitDto } from './dto/create-org-unit.dto';
import { GoogleApiService } from '../google-apis/google.apis.service';
import { ORG_UNIT_REPOSITORY, PLAN_REPOSITORY, SEQUELIZE, USER_REPOSITORY } from '../constants';
import { OrgUnit } from './entities/org-unit.entity';
import { OrgUnitDto } from './dto/org-unit.dto';
import { LoggingService } from '../logger/logging.service';
import { v4 } from 'uuid';
import { QueryException, ValidationException } from '../error/common.exception';
import { FilteredCategoryService } from '../filtered-category/filtered-category.service';
import { FilteredUrlService } from '../filtered-url/filtered-url.service';
import { OrgUnitCategoryDto } from './dto/org-unit-category-dto';
import { CategoryDTO } from '../filtered-category/dto/filtered-category.dto';
import { Op } from 'sequelize';
import { OrgUnitUrlDTO } from './dto/org-unit-url-dto';
import { DefaultCategoryService } from '../category/default-category.service';
import { FilteredCategoryErrors } from '../filtered-category/filtered-category.errors';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { KidRequestService } from '../kid-request/kid-request.service';
import { CategoryStatus } from '../category/category.status';
import { Plan } from '../billing/plan/entities/plan.entity';
import { PlanTypes } from '../billing/plan/plan-types';

@Injectable()
export class OrgUnitService {
    constructor(
        @Inject(ORG_UNIT_REPOSITORY)
        private readonly orgUnitRepository: typeof OrgUnit,
        private readonly googleApiService: GoogleApiService,
        private readonly filteredUrlService: FilteredUrlService,
        private readonly filteredCategoryService: FilteredCategoryService,
        private readonly categoryService: DefaultCategoryService,
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly log: LoggingService,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: typeof User,
        private readonly kidRequestService: KidRequestService,
        @Inject(PLAN_REPOSITORY) private readonly planRepository: typeof Plan
    ) {
        this.log.className(OrgUnitService.name);
    }

    async create(createOrgUnitDto: CreateOrgUnitDto) {
        try {
            createOrgUnitDto.id = v4();
            return await this.orgUnitRepository.create(createOrgUnitDto);
        } catch (e) {
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
    }

    /** Fetch all organizational units
     * @param accountId
     * @returns organizational units
     */
    async findAll(accountId: string): Promise<OrgUnitDto[]> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const orgUnits = await this.findAllByAccountId(accountId);
            const res = await Promise.all(
                orgUnits.map(async (orgUnit) => {
                    const categories = await this.filteredCategoryService.findAllByOrgUnitId(orgUnit.id, accountId);
                    const urls = await this.filteredUrlService.findAllByOrgUnitId(orgUnit.id, accountId);
                    return {
                        id: orgUnit.id,
                        name: orgUnit.name,
                        googleOrgUnitId: orgUnit.googleOrgUnitId,
                        parent: orgUnit.parent,
                        parentOuId: orgUnit.parentOuId,
                        categories: categories.map((category) => {
                            return { id: category.categoryId, name: category.name, enabled: !!category.enabled };
                        }),
                        urls: urls.map((filteredUrl) => {
                            return { name: filteredUrl.url, enabled: filteredUrl.enabled };
                        }),
                    };
                })
            );
            await transaction.commit();
            return this.restructure(res);
        } catch (e) {
            this.log.error(e);
            await transaction.rollback();
            throw new QueryException(QueryException.save());
        }
    }

    async findOne(id: string): Promise<OrgUnit> {
        return await this.orgUnitRepository.findOne<OrgUnit>({ where: { id } });
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.orgUnitRepository.destroy({ where: { id: ids } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    async findOneAndUpdate(googleOrgUnitId: string, objectToUpdate = {}): Promise<void> {
        try {
            await this.orgUnitRepository.update(objectToUpdate, { where: { googleOrgUnitId } });
        } catch (e) {
            this.log.error(QueryException.update(e));
            throw new QueryException(QueryException.update());
        }
    }

    async findAllByGoogleOrgUnitId(googleOrgUnitIds: string[]): Promise<OrgUnit[]> {
        return await this.orgUnitRepository.findAll({
            attributes: ['id'],
            where: { googleOrgUnitId: googleOrgUnitIds },
        });
    }

    async upsert(createOrgUnitDto: CreateOrgUnitDto): Promise<OrgUnit> {
        try {
            const found = await this.orgUnitRepository.findOne({
                where: {
                    googleOrgUnitId: createOrgUnitDto.googleOrgUnitId,
                    accountId: createOrgUnitDto.accountId,
                },
            });
            if (found) {
                await this.orgUnitRepository.update(createOrgUnitDto, {
                    where: {
                        googleOrgUnitId: createOrgUnitDto.googleOrgUnitId,
                        accountId: createOrgUnitDto.accountId,
                    },
                });
            } else {
                createOrgUnitDto.id = v4();
                await this.orgUnitRepository.create(createOrgUnitDto);
            }
            return await this.orgUnitRepository.findOne({ where: { name: createOrgUnitDto.name } });
        } catch (e) {
            this.log.error(QueryException.upsert(e));
            throw new QueryException(QueryException.upsert());
        }
    }

    /**
     * Find org unit by path
     * @param orgUnitPath
     * @param accountId
     * @returns User
     */
    async findOneByOrgUnitPath(orgUnitPath: string, accountId: string): Promise<OrgUnit> {
        return await this.orgUnitRepository.findOne({ where: { orgUnitPath, accountId } });
    }

    /**
     * Create organizational units in bulk
     * @param units organizational units to save
     * @returns void
     */
    async bulkCreate(units: CreateOrgUnitDto[]): Promise<void> {
        await this.orgUnitRepository.bulkCreate(units);
    }

    restructure = (orgUnits, parent = undefined) =>
        orgUnits
            .filter(({ parentOuId }) => parentOuId == parent)
            .map((p, _, __, children = this.restructure(orgUnits, p.googleOrgUnitId)) => ({
                ...p,
                ...(children.length ? { children: this.restructure(orgUnits, p.googleOrgUnitId) } : {}),
            }));

    /** Get all organizational units by account id
     * @param accountId
     * @returns organizational units
     */
    async findAllByAccountId(accountId: string): Promise<OrgUnit[]> {
        return await this.orgUnitRepository.findAll<OrgUnit>({ where: { accountId } });
    }

    /** Get all organizational units by account id
     * @param accountId
     * @returns organizational units
     */
    async findKidsOrgUnits(accountId: string): Promise<OrgUnit[]> {
        return await this.orgUnitRepository.findAll<OrgUnit>({
            where: {
                accountId,
                parent: {
                    [Op.ne]: null,
                },
                parentOuId: {
                    [Op.ne]: null,
                },
            },
        });
    }

    /** Fetch all organizational units with filtered categories
     * @param accountId
     * @returns organizational units
     */
    async findFilteredCategories(accountId: string): Promise<OrgUnitCategoryDto[]> {
        const editableCategories = await this.categoryService.findEditableCategories();
        const orgUnits = await this.findKidsOrgUnits(accountId);
        return await Promise.all(
            orgUnits.map(async (orgUnit) => {
                const categories = await this.filteredCategoryService.findAllByOrgUnitId(orgUnit.id, accountId);
                return {
                    id: orgUnit.id,
                    name: orgUnit.name,
                    categories: categories
                        .filter((category) => editableCategories.includes(category.categoryId))
                        .map((category) => {
                            return {
                                id: category.categoryId,
                                name: category.name,
                                status: category.status,
                            };
                        }),
                };
            })
        );
    }

    /** Save all organizational units with filtered categories
     * @param accountId
     * @param orgUnitCategories
     * @returns void
     */
    async updateFilteredCategories(accountId: string, orgUnitCategories: OrgUnitCategoryDto[]): Promise<void> {
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            const editableCategories = await this.categoryService.findEditableCategories();
            for (const ou of orgUnitCategories) {
                const categories = ou.categories;
                const filteredCategories = categories.map((category: CategoryDTO) => {
                    if (!editableCategories.includes(category.id)) {
                        throw new ValidationException(FilteredCategoryErrors.notFound(category.id));
                    }
                    return {
                        accountId,
                        orgUnitId: ou.id,
                        categoryId: category.id,
                        status: category.status,
                    };
                });
                for (const c of filteredCategories) {
                    await this.filteredCategoryService.updateCategory(c.accountId, c.orgUnitId, c.categoryId, { status: c.status });
                }
            }
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            if (e.status === HttpStatus.BAD_REQUEST) {
                throw e;
            }
            this.log.error(QueryException.update(e));
            throw new QueryException(QueryException.update());
        }
    }

    /** Fetch all organizational units
     * @param accountId
     * @returns organizational units
     */
    async findFilteredUrls(accountId: string): Promise<OrgUnitUrlDTO[]> {
        const orgUnits = await this.findKidsOrgUnits(accountId);
        return await Promise.all(
            orgUnits.map(async (orgUnit) => {
                const urls = await this.filteredUrlService.findAllByOrgUnitId(orgUnit.id, accountId);
                return {
                    id: orgUnit.id,
                    name: orgUnit.name,
                    urls: urls.map((filteredUrl) => {
                        return {
                            id: filteredUrl.id,
                            name: filteredUrl.url,
                            enabled: filteredUrl.enabled,
                        };
                    }),
                };
            })
        );
    }

    /** Create filtered urls
     * @param accountId
     * @param orgUnitUrl
     * @returns void
     */
    async createFilteredUrls(accountId: string, orgUnitUrl: OrgUnitUrlDTO): Promise<OrgUnitUrlDTO> {
        const urls = orgUnitUrl.urls;
        const filteredUrls = urls.map((url) => {
            return { id: v4(), url: url.name, orgUnitId: orgUnitUrl.id, accountId, enabled: url.enabled, inheritFromParent: true };
        });
        await this.filteredUrlService.createBulk(filteredUrls);
        for (const filteredUrl of filteredUrls) {
            const kid = await this.userRepository.findOne<User>({
                attributes: ['id'],
                where: { orgUnitId: filteredUrl.orgUnitId },
            });
            const kidReq = await this.kidRequestService.findOne(filteredUrl.url, kid.id);
            if (kidReq && kidReq.length > 0 && !kidReq[0].accessGranted) {
                await this.kidRequestService.updateAccessGranted(kid.id, filteredUrl.url, true);
            }
        }
        orgUnitUrl.urls = filteredUrls.map((url) => {
            return { id: url.id, name: url.url, enabled: url.enabled };
        });
        return orgUnitUrl;
    }

    /** Delete filtered url by id
     * @param id
     * @returns void
     */
    async deleteFilteredUrl(id: string): Promise<void> {
        await this.filteredUrlService.delete(id);
    }

    /** Update filtered categories when plans are switched
     * @param planId
     * @param accountId
     * @param migration
     * @returns void
     */
    async updateCategories(planId: string, accountId: string, migration: boolean): Promise<void> {
        const plan = await this.planRepository.findOne({ where: { id: planId } });
        const paidPlanCategories = await this.categoryService.findPaidPlanCategories();

        const orgUnits = await this.findKidsOrgUnits(accountId);
        const categoriesToUpdate = [];
        (
            await this.filteredCategoryService.findAllByOrgUnitIds(
                orgUnits.map((u) => u.id),
                accountId,
                plan.planType
            )
        )
            .filter((category) => paidPlanCategories.includes(category.categoryId))
            .forEach((c) => categoriesToUpdate.push(c.id));
        if (migration || plan.planType === PlanTypes.FREE) {
            for (const c of categoriesToUpdate) {
                await this.filteredCategoryService.updateCategoryById(c, { status: CategoryStatus.ALLOW });
            }
        }
    }
}
