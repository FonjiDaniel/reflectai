import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { AuthResponse } from '@/types/index';
import {config }from "@/lib/config"

export async function GET(): Promise<NextResponse<AuthResponse>> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated with Clerk' },
        { status: 401 }
      );
    }
    
    
        const clerk = await clerkClient()
        const clerkUser = await clerk.users.getUser(userId);
    
    const name =
      clerkUser.username ||
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
      "Unknown";
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'User email not available' },
        { status: 400 }
      );
    }
    
    const response = await fetch(config.authBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        clerkId: userId,
      }),
    });
    
    const data = await response.json() as AuthResponse;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to sync authentication' },
      { status: 500 }
    );
  }
}