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
  

  export interface createLibraryProps {

    title: string,
    description: string, 
    createdBy: string,
    parentId?: string,
    icon?: React.ReactNode,
    color?: string,
   
  }


  export interface Library {
    id: string;
    title: string;
    description: string;
    icon: string | null;
    color: string | null;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    created_by: string;
    last_edited_by: string | null;
    parent_id: string | null;
    display_order: number;
    is_public: boolean;
    ai_generated: boolean;
    ai_prompt: string | null;
    ai_settings: any | null; // Adjust type if ai_settings has a defined structure
  }
  


  export interface CloudinaryUploadResult {
    secure_url: string;
    bytes: number;
    width: number;
    height: number;
    public_id: string;
  }