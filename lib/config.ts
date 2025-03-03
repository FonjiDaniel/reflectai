interface Config {
    authBaseUrl: string;
    databaseUrl: string
}

export const config: Config = {
    authBaseUrl: process.env.AUTH_BASE_URL!,
    databaseUrl: process.env.DATABASE_URL!
};