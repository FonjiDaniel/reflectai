interface Config {
    openAiKey: string,
    backendBaseUrl: string,
    cloudinaryCloudName: string,
    cloudinaryApiKey: string,
    cloudinaryApiSecret : string, 
    socketUrl: string

}

export const config: Config = {
    openAiKey: process.env.OPEN_AI_SECRET!,
    backendBaseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL!,
    cloudinaryCloudName : process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    cloudinaryApiKey : process.env.CLOUDINARY_API_KEY!,
    cloudinaryApiSecret : process.env.CLOUDINARY_API_SECRET!,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_BASE_URL!

};
