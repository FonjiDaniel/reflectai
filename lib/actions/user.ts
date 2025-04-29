import { User } from "@/types";
import { cookies } from "next/headers";

type AuthData = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
};

export async function getServerAuthData(): Promise<AuthData> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value || null;
  const userCookie = cookieStore.get("user")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  try {
    const user = userCookie ? (JSON.parse(userCookie) as User) : null;
    return {
      token,
      refreshToken,
      user,
      isAuthenticated: !!token && !!user,
    };
  } catch (error) {
    console.error("Failed to parse user cookie", error);
    return {
      token,
      refreshToken,
      user: null,
      isAuthenticated: false,
    };
  }
}

