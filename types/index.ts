import { JSONContent } from "novel";

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
      refreshToken: string;
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
    created_at: string; 
    updated_at: string; 
    created_by: string;
    last_edited_by: string | null;
    parent_id: string | null;
    display_order: number;
    is_public: boolean;
    ai_generated: boolean;
    ai_prompt: string | null;
    ai_settings: JSONContent | null; 
  }
  


  export interface CloudinaryUploadResult {
    secure_url: string;
    bytes: number;
    width: number;
    height: number;
    public_id: string;
  }

  export interface WritingStats {
    user_id : string,
    entry_date: string,
    word_count: number,
    entry_count: number
  }

  export interface UserStreak {
    current_streak: number
    longest_streak: number
  }

  
  export interface WritingTrackerCalendarProps {
    year: number;
    month: number;
    entries: WritingStats[];
    onDateClick?: (date: Date) => void;
  }
  

  export interface RefreshResponse {
    success: boolean,
    message: string,
    data : {
      token: string,
      refreshToken: string
    }
  }

  