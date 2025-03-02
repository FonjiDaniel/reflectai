import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getInitials(fullName: string ) {
  return fullName
      .split(' ') // Split the name into an array of words
      .map(word => word.charAt(0).toUpperCase()) // Get the first letter and convert to uppercase
      .join(''); // Join the initials into a string
}