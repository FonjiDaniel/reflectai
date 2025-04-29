import { config } from "@/lib/config";
import { RefreshResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "no refreshToken provided" },
        { status: 401 }
      );
    }

    const response = await fetch(`${config.backendBaseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    const data: RefreshResponse = await response.json();
    if (!data.success) {
      return NextResponse.json(
        { success: false, message: `Backend refresh failed: ${data.message}` },
        { status: 401 }
      );
    }

    // Set new token cookie
    const nextResponse = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
      data: data.data,
    });
    nextResponse.cookies.set("token", data.data.token, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: true,
    });
    return nextResponse;
  } catch (err) {
    console.error("Refresh token error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
