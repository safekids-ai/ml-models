export interface IDatabaseConfigAttributes {
    username?: string;
    password?: string;
    database?: string;
    host?: string;
    port?: number | string;
    dialect?: string;
    urlDatabase?: string;
    logging?: boolean;
    logQueryParameters?: boolean;
    pool?: DatabasePoolConfig;
}

interface DatabasePoolConfig {
    max?: number;
    min?: number;
    acquire?: number;
    idle?: number;
}

export interface IDatabaseConfig {
    development: IDatabaseConfigAttributes;
    test: IDatabaseConfigAttributes;
    production: IDatabaseConfigAttributes;
}
