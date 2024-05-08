export class OrgUnitErrors {
    static invalidUnits = (units: string): string => {
        return `Following org units are invalid: [${units}] .`;
    };
}
