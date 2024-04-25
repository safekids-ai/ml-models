export type Props = {
    ouData: any[];
    categories: any[];
    categoryToggle: (categories: any[], categoryName: string, value: boolean) => void;
    setOU: (node: any) => void;
    inherit: boolean;
    toggleInherit: (value: boolean) => void;
    isRootNode: boolean;
    enableApplyToAll: boolean;
    applyToAll: () => void;
    showFeatureDescription: (description: string) => void;
    isSettings?: boolean;
    accountType?: string | null;
    defaultCategories: { name: string; enable: boolean; editable: boolean }[];
};
