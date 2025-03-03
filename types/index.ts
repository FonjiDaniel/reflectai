export interface LibraryEntry {
    id: string;
    title: string;
    icon: React.ReactNode | null;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
    clerkid: string;
    avatar_url: string | null;
    user_role: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
      token: string;
      user: User;
    };
  }
  