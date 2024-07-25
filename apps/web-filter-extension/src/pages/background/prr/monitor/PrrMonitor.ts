import { MLModels } from '../../../../shared/types/MLModels';
import { PrrCategory } from '../../../../shared/types/PrrCategory';
import { PrrLevel } from '../../../../shared/types/PrrLevel';
import { TriggerService } from '../PrrTriggerService';
import { UrlStatus } from '../../../../shared/types/UrlStatus';
import { PrrTrigger } from '../../../../shared/types/message_types';

export type PrrReport = {
    title?: string;
    texts?: string[];
    images?: string[];
    model?: MLModels;
    category?: PrrCategory;
    level?: PrrLevel;
    data?: string;
    status?: string;
    prrTriggered?: boolean;
    url?: string;
    tabId: number;
    fullWebUrl?: string;
    teacherId?: string;
    accessLimited?: boolean;
    prrTriggerId?: PrrTrigger;
    isAiGenerated?: boolean;
    eventId?: string;
};

export type PrrMonitor = {
    report: (report: PrrReport) => Promise<void>;
    reset: (tabId: number) => Promise<void>;
};

/**
 * Categories returned by NLP Model
 */
export enum MlModelCategory {
    GUN = 'GUN',
    PORN = 'PORN',
    PROXY = 'PROXY',
    SELF_HARM = 'SELF_HARM',
    WEAPONS = 'WEAPONS',
}

export class UrlPrrMonitor implements PrrMonitor {
    constructor(private readonly pprTriggerService: TriggerService) {}

    report = async (report: PrrReport): Promise<void> => {
        this.pprTriggerService.trigger(report);
        return;
    };

    async reset(tabId: number): Promise<void> {
        this.pprTriggerService.reset(tabId);
        return;
    }
}
