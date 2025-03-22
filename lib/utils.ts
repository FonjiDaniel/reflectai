import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(fullName: string ) {
  return fullName
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase()) 
      .join('');
}

export const timeAgo = (dateString: string):string => {
  const date = new Date(dateString);
  return `${formatDistanceToNow(date, { addSuffix: true })}`;

}