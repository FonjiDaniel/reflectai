import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(fullName: string ) {
  return fullName
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase()) 
      .join('');
}