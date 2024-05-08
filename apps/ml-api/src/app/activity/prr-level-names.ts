export enum PrrLevel {
    ONE = '1',
    TWO = '2',
    THREE = '3',
}

export enum PrrLevelNames {
    CASUAL = 'Casual',
    COACHED = 'Coached',
    CRISIS = 'Crisis',
}

export function getPrrLevelName(key: string): string {
    const map = new Map<string, string>();
    map.set(PrrLevel.ONE, PrrLevelNames.CASUAL);
    map.set(PrrLevel.TWO, PrrLevelNames.COACHED);
    map.set(PrrLevel.THREE, PrrLevelNames.CRISIS);
    const prrName = map.get(key);
    return prrName ? prrName : '';
}
