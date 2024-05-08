export type Props = {
    ouData: any[];
    urls: any[];
    removeUrls: (urls: string[]) => void;
    setOU: (node: any) => void;
    inherit: boolean;
    toggleInherit: (value: boolean) => void;
    isRootNode: boolean;
    enableApplyToAll: boolean;
    applyToAll: () => void;
    showFeatureDescription: (description: string) => void;
    isSettings?: boolean;
    tabValue: string;
    handleTabChange: (e: any, value: number) => void;
    accountType?: string | null;
};
