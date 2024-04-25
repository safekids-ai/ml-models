import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionFeedbackDto } from './dto/subscription-feedback-dto';
import { SubscriptionFeedback } from './entities/subscription-feedback.entity';
import { SUBSCRIPTION_FEEDBACK_REPOSITORY } from '../../constants';

@Injectable()
export class SubscriptionFeedbackService {
    constructor(@Inject(SUBSCRIPTION_FEEDBACK_REPOSITORY) private readonly repository: typeof SubscriptionFeedback) {}

    /** Creates subscription feedback
     * @param dto
     */
    async create(dto: SubscriptionFeedbackDto): Promise<void> {
        await this.repository.create(dto);
    }

    /** Delete subscription feedback
     * @param accountId
     * @param softDelete
     */
    async delete(accountId: string, softDelete: boolean): Promise<void> {
        const whereOptions = softDelete ? { where: { accountId } } : { where: { accountId }, force: true };
        await this.repository.destroy(whereOptions);
    }
}
