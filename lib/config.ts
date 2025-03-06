interface Config {
    authBaseUrl: string;
    databaseUrl: string
    libraryUrl: string
}

export const config: Config = {
    authBaseUrl: process.env.AUTH_BASE_URL!,
    databaseUrl: process.env.DATABASE_URL!,
    libraryUrl: process.env.DATABASE_LIBRARY_URL!
};