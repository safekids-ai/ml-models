import { Inject, Injectable } from '@nestjs/common';
import { FILTEREDURL_REPOSITORY, ORG_UNIT_REPOSITORY, SEQUELIZE } from '../constants';
import { FilteredUrl, FilteredUrlCreationAttributes } from './entities/filtered-url.entity';
import { QueryException } from '../error/common.exception';
import { FilteredUrlDto } from './dto/filtered-url.dto';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { QueryTypes } from 'sequelize';
import { OrgUnit } from '../org-unit/entities/org-unit.entity';
import { getSimpleURL } from '../utils/http.util';
import { LoggingService } from '../logger/logging.service';

@Injectable()
export class FilteredUrlService {
    private readonly sequelize: Sequelize;

    constructor(
        @Inject(FILTEREDURL_REPOSITORY) private readonly filteredUrlRepository: typeof FilteredUrl,
        @Inject(ORG_UNIT_REPOSITORY) private readonly orgUnitRepository: typeof OrgUnit,
        @Inject(SEQUELIZE) sequelize: Sequelize,
        private readonly log: LoggingService
    ) {
        this.sequelize = sequelize;
    }

    /**
     * Save filtered url
     * @param dto
     * @returns void
     */
    async create(dto: FilteredUrlCreationAttributes): Promise<void> {
        await this.filteredUrlRepository.create(dto);
    }

    /**
     * Save filtered url in bulk
     * @param dto
     * @returns void
     */
    async createBulk(dto: FilteredUrlCreationAttributes[]): Promise<void> {
        try {
            await this.filteredUrlRepository.bulkCreate(dto);
        } catch (e) {
            this.log.error(QueryException.bulkCreate(e));
            throw new QueryException(QueryException.bulkCreate());
        }
    }

    async update(id: string, objToUpDate = {}): Promise<void> {
        await this.filteredUrlRepository.update(objToUpDate, { where: { id: id } });
    }

    /**
     * Find by orgUnitId and filtered url
     * @param orgUnitId
     * @param url
     * @returns boolean
     */
    async findOne(orgUnitId: string, url: string): Promise<FilteredUrl[]> {
        url = `%${url}%`;
        const query = `select fu.id,fu.enabled from filtered_url fu where fu.org_unit_id = :orgUnitId and fu.url LIKE :url`;
        return await this.filteredUrlRepository.sequelize.query(query, {
            replacements: { orgUnitId, url },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: FilteredUrl,
        });
    }

    findAllByOrgUnitId(orgUnitId: string, accountId: string): Promise<FilteredUrl[]> {
        return this.filteredUrlRepository.findAll({ where: { orgUnitId, accountId } });
    }

    async findAllTypeUrls(accountId: string, userId: string) {
        const results = await this.filteredUrlRepository.sequelize.query(
            'select * from filtered_url' +
                ' INNER JOIN user u on u.org_unit_id = filtered_url.org_unit_id ' +
                ' where u.id = :userId and filtered_url.account_id = :accountId',
            {
                replacements: { accountId: accountId, userId: userId },
                type: QueryTypes.SELECT,
                mapToModel: true,
                model: FilteredUrl,
            }
        );
        const permissible = results.filter((o) => o.enabled).map((o) => o.url);
        const nonPermissible = results.filter((o) => !o.enabled).map((o) => o.url);
        return { permissible: permissible, nonPermissible: nonPermissible };
    }

    async deleteAll(ids: string[]): Promise<void> {
        try {
            await this.filteredUrlRepository.destroy({ where: { orgUnitId: ids } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * Delete filtered url by id
     * @param id
     * @returns void
     */
    async delete(id: string): Promise<void> {
        try {
            await this.filteredUrlRepository.destroy({ where: { id } });
        } catch (e) {
            this.log.error(QueryException.delete(e));
            throw new QueryException(QueryException.delete());
        }
    }

    /**
     * Save filtered urls
     * @param dto
     * @param accountId
     * @returns void
     */
    async saveFilteredUrls(dto: FilteredUrlDto, accountId: string): Promise<void> {
        const urls = dto.urls;
        let transaction;
        for (const orgUnitId of dto.orgUnitIds) {
            try {
                transaction = await this.sequelize.transaction();
                const filteredUrls = urls.map((url) => {
                    return { id: uuidv4(), url: url.name, orgUnitId, accountId, enabled: url.enabled };
                });
                await this.filteredUrlRepository.destroy({ where: { orgUnitId } });
                await this.filteredUrlRepository.bulkCreate<FilteredUrl>(filteredUrls);
                await transaction.commit();
            } catch (e) {
                await transaction.rollback();
                throw new QueryException(QueryException.save());
            }
        }
    }

    /**
     * Update a filtered url for an account
     * @param dto
     */
    async updateUrlForAccount(dto: FilteredUrlCreationAttributes) {
        dto.url = getSimpleURL(dto.url);
        let transaction;
        try {
            transaction = await this.sequelize.transaction();
            await this.filteredUrlRepository.destroy({ where: { url: dto.url, accountId: dto.accountId }, force: true });
            const orgUnits = await this.orgUnitRepository.findAll({ where: { accountId: dto.accountId } });
            const urls: FilteredUrlCreationAttributes[] = [];
            for (const orgUnit of orgUnits) {
                const url: FilteredUrlCreationAttributes = { id : uuidv4(), orgUnitId : orgUnit.id, accountId : dto.accountId, enabled : dto.enabled == undefined ? true : dto.enabled, url : dto.url, inheritFromParent: true };
                urls.push(url);
            }
            await this.filteredUrlRepository.bulkCreate(urls);
            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            this.log.error(QueryException.save(e));
            throw new QueryException(QueryException.save());
        }
        return 'SUCCESS';
    }
}
