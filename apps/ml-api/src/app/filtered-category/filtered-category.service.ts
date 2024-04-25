import { Inject, Injectable } from '@nestjs/common';
import { FILTEREDCATEGORY_REPOSITORY, SEQUELIZE } from '../constants';
import { FilteredCategory } from './entities/filtered-category.entity';
import { QueryException } from '../error/common.exception';
import { CategoryDTO, FilteredCategoryDto } from './dto/filtered-category.dto';
import { Sequelize } from 'sequelize-typescript';
import { uuid } from 'uuidv4';
import { QueryTypes } from 'sequelize';
import { DefaultCategoryService } from '../category/default-category.service';
import { AccountTypes } from '../account-type/dto/account-types';
import { LoggingService } from '../logger/logging.service';
import { Category } from '../category/entities/category.entity';
import { CategoryStatus } from '../category/category.status';
import { AccountService } from '../accounts/account.service';
import { PlanTypes } from '../billing/plan/plan-types';

@Injectable()
export class FilteredCategoryService {
    private readonly sequelize: Sequelize;

    constructor(
        @Inject(FILTEREDCATEGORY_REPOSITORY)
        private readonly repository: typeof FilteredCategory,
        private readonly accountService: AccountService,
        private readonly categoryService: DefaultCategoryService,
        @Inject(SEQUELIZE) sequelize: Sequelize,
        private readonly log: LoggingService
    ) {
        this.log.className(FilteredCategoryService.name);
        this.sequelize = sequelize;
    }

    /**
     * find all categories with orgUnitId
     * @param orgUnitId
     * @param accountId
     */
    async findAllByOrgUnitId(orgUnitId: string, accountId: string): Promise<FilteredCategory[]> {
        const results = await this.repository.findAll({
            where: { orgUnitId, accountId },
            order: [['name', 'ASC']],
        });
        if (!results || results.length === 0) {
            await this.saveDefaultCategoriesForOrgUnit(accountId, orgUnitId, PlanTypes.FREE);
            return await this.repository.findAll({
                where: { orgUnitId, accountId },
                order: [['name', 'ASC']],
            });
        }
        return results;
    }

    /**
     * find all categories with accountId and user id
     * @param accountId
     * @param orgUnitId
     * @param userId
     */
    async findAllByAccountAndUserId(accountId: string, userId: string, orgUnitId: string): Promise<FilteredCategory[]> {
        const results = await this.fetchFilteredCategories(accountId, userId);
        if (!results || results.length === 0) {
            await this.saveDefaultCategoriesForOrgUnit(accountId, orgUnitId, PlanTypes.FREE);
            return await this.fetchFilteredCategories(accountId, userId);
        }
        return results;
    }

    private async fetchFilteredCategories(accountId: string, userId: string) {
        const { accountType } = await this.accountService.getAccountType(accountId);
        const consumerQuery =
            'select * from filtered_category' +
            ' INNER JOIN user u on u.org_unit_id = filtered_category.org_unit_id ' +
            ' where u.id = :userId and filtered_category.account_id = :accountId';
        const query = accountType === AccountTypes.CONSUMER ? consumerQuery : `${consumerQuery} and enabled=:enabled`;
        return await this.repository.sequelize.query(query, {
            replacements:
                accountType === AccountTypes.CONSUMER ? { accountId: accountId, userId: userId } : { accountId: accountId, userId: userId, enabled: true },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: FilteredCategory,
        });
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.repository.destroy({ where: { orgUnitId: ids } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * Save filtered categories for give account id and org unit id
     * @param accountId account id
     * @param orgUnitId organization unit id
     * @param planType planType
     */
    async saveDefaultCategoriesForOrgUnit(accountId: string, orgUnitId: string, planType: string): Promise<void> {
        const { accountType } = await this.accountService.getAccountType(accountId);
        const categories = await this.categoryService.findAllByStatus(true);
        const orgUnitCategories = categories.map((category: Category) => {
            return {
                name: category.name,
                id: category.id,
                enabled: accountType === AccountTypes.CONSUMER ? !(category.status === CategoryStatus.ALLOW) : !category.schoolDefault,
                orgUnitId: orgUnitId,
                status: accountType === AccountTypes.CONSUMER ? category.status : category.enabled ? CategoryStatus.ALLOW : CategoryStatus.PREVENT,
                timeDuration: category.timeDuration,
            } as CategoryDTO;
        });
        const dto: FilteredCategoryDto = {
            categories: orgUnitCategories,
            orgUnitIds: [orgUnitId],
        };
        await this.saveDefaultFilteredCategories(dto, accountId, accountType, planType);
    }
    /**
     * Save filtered categories
     * @param dto filtered categories
     * @param accountId
     * @returns void
     */
    async saveFilteredCategories(dto: FilteredCategoryDto, accountId: string): Promise<void> {
        const { accountType } = await this.accountService.getAccountType(accountId);
        const categories = dto.categories;

        for (const orgUnitId of dto.orgUnitIds) {
            let transaction;
            try {
                transaction = await this.sequelize.transaction();
                const filteredCategories = categories.map((category: CategoryDTO) => {
                    return {
                        name: category.name,
                        enabled: category.enabled,
                        orgUnitId: orgUnitId,
                        categoryId: category.id,
                        accountId,
                        id: uuid(),
                        timeDuration: category.timeDuration,
                        status: accountType === AccountTypes.CONSUMER ? category.status : category.enabled ? CategoryStatus.ALLOW : CategoryStatus.PREVENT,
                    } as FilteredCategory;
                });
                await this.repository.destroy({ where: { orgUnitId }, transaction });
                await this.repository.bulkCreate<FilteredCategory>(filteredCategories, {
                    transaction,
                });
                await transaction.commit();
            } catch (e) {
                this.log.error(e);
                await transaction.rollback();
                throw new QueryException(QueryException.save());
            }
        }
    }

    /**
     * Update category
     * @param accountId
     * @param orgUnitId
     * @param categoryId
     * @param objectToUpdate
     */
    async updateCategory(accountId: string, orgUnitId: string, categoryId: string, objectToUpdate = {}): Promise<void> {
        try {
            await this.repository.update(objectToUpdate, { where: { orgUnitId, accountId, categoryId } });
        } catch (e) {
            this.log.error(QueryException.update(e));
            throw new QueryException(QueryException.update());
        }
    }

    async saveDefaultFilteredCategories(dto: FilteredCategoryDto, accountId: string, accountType: string, planType: string): Promise<void> {
        const categories = dto.categories;
        let paidPlanCategories;
        if (planType && planType === PlanTypes.FREE) {
            paidPlanCategories = await this.categoryService.findPaidPlanCategories();
        }
        for (const orgUnitId of dto.orgUnitIds) {
            try {
                const filteredCategories = categories.map((category: CategoryDTO) => {
                    return {
                        name: category.name,
                        enabled: category.enabled,
                        orgUnitId: orgUnitId,
                        categoryId: category.id,
                        accountId,
                        id: uuid(),
                        timeDuration: category.timeDuration,
                        status: this.getStatus(accountType, category, paidPlanCategories),
                    } as FilteredCategory;
                });
                await this.repository.destroy({ where: { orgUnitId } });
                await this.repository.bulkCreate<FilteredCategory>(filteredCategories);
            } catch (e) {
                this.log.error(e);
                throw new QueryException(QueryException.save());
            }
        }
    }

    private getStatus(accountType: string, category: CategoryDTO, paidPlanCategories: string[]) {
        if (paidPlanCategories && paidPlanCategories.includes(category.id) && accountType === AccountTypes.CONSUMER) {
            return CategoryStatus.ALLOW;
        }
        return accountType === AccountTypes.CONSUMER ? category.status : category.enabled ? CategoryStatus.ALLOW : CategoryStatus.PREVENT;
    }

    /**
     * find all categories with orgUnitId
     * @param orgUnitIds
     * @param accountId
     * @param planType
     */
    async findAllByOrgUnitIds(orgUnitIds: string[], accountId: string, planType: string): Promise<FilteredCategory[]> {
        const results = await this.repository.findAll({
            where: { orgUnitId: orgUnitIds, accountId },
        });
        if (!results || results.length === 0) {
            for (const orgUnitId of orgUnitIds) {
                await this.saveDefaultCategoriesForOrgUnit(accountId, orgUnitId, planType);
            }
            return await this.repository.findAll({
                where: { orgUnitId: orgUnitIds, accountId },
            });
        }
        return results;
    }

    /**
     * Update category
     * @param id
     * @param objectToUpdate
     */
    async updateCategoryById(id: string, objectToUpdate = {}): Promise<void> {
        try {
            await this.repository.update(objectToUpdate, { where: { id } });
        } catch (e) {
            this.log.error(QueryException.update(e));
            throw new QueryException(QueryException.update());
        }
    }
}
