import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from "@/types";
import { config } from "@/lib/config";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true
});

export async function POST(req: Request) {

  
  if (!config.cloudinaryApiKey || !config.cloudinaryApiSecret || !config.cloudinaryCloudName) {
    return new Response("Missing Cloudinary credentials. Don't forget to add them to your .env file.", {
      status: 401,
    });
  }

  try {
    // Get file data from the request
    const file = await req.arrayBuffer();
    const filename = req.headers.get("x-vercel-filename") || "file.txt";
    const contentType = req.headers.get("content-type") || "text/plain";
    
    // Convert ArrayBuffer to Buffer for Cloudinary upload
    const buffer = Buffer.from(file);
    
    // Create a Base64 data URI
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${contentType};base64,${base64Data}`;
    
    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'reflectai Images',
          resource_type: 'auto',
          public_id: filename.split('.')[0], // Use filename without extension as public_id
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        }
      );
    });
    
    // Return the Cloudinary response
    return NextResponse.json({
      url: result.secure_url,
      size: result.bytes,
      contentType: contentType,
      width: result.width,
      height: result.height,
      publicId: result.public_id
    });
    
  } catch (error ) {
    console.error('Upload error:', error);
    return new Response(`Upload failed: ${error}`, {
      status: 500,
    });
  }
}