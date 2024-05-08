import { Inject, Injectable } from '@nestjs/common';
import { defaultCategories } from './default-categories';
import { ACCOUNT_REPOSITORY, CATEGORY_REPOSITORY } from '../constants';
import { Category } from './entities/category.entity';
import { QueryException } from '../error/common.exception';
import { CategoryDto } from './dto/category.dto';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class DefaultCategoryService {
    constructor(
        @Inject(CATEGORY_REPOSITORY)
        private readonly repository: typeof Category,
        @Inject(ACCOUNT_REPOSITORY)
        private readonly accountRepository: typeof Account
    ) {}

    /** Fetch categories
     * @returns categories
     */
    async findAll(): Promise<CategoryDto[]> {
        const categories = await this.repository.findAll<Category>({
            where: { enabled: true },
            order: [['name', 'ASC']],
        });

        return categories.map(({ id, name, editable, schoolDefault }) => ({
            id,
            enabled: !schoolDefault,
            name,
            editable,
        }));
    }

    /** Seed default categories
     * @returns void
     */
    async seedDefaultCategories(): Promise<void> {
        try {
            for (const category of defaultCategories) {
                await this.repository.upsert(category);
            }
        } catch (error) {
            throw new QueryException(QueryException.upsert());
        }
    }

    /**
     * Find all enabled categories
     * @param enabled
     */
    async findAllByStatus(enabled: boolean): Promise<Category[]> {
        return await this.repository.findAll<Category>({ where: { enabled } });
    }

    /** Fetch editable categories
     * @returns categories
     */
    async findEditableCategories(): Promise<string[]> {
        const editableCategories = await this.repository.findAll<Category>({
            attributes: ['id'],
            where: { enabled: true, editable: true },
            order: [['name', 'ASC']],
        });
        return editableCategories.map((category) => category.id);
    }

    /** Fetch editable paid categories
     * @returns categories
     */
    async findPaidPlanCategories(): Promise<string[]> {
        const paidPlanCategories = ['ADULT_SEXUAL_CONTENT', 'VIOLENCE', 'GAMBLING', 'INAPPROPRIATE_FOR_MINORS'];
        const editableCategories = await this.findEditableCategories();
        return editableCategories.filter((c) => !paidPlanCategories.includes(c));
    }
}
