import { createLibraryProps, Library, User } from "@/types/index";
import { config } from "../config";

export const createLibrary = async (
  libraryData: createLibraryProps,
  token: string
) => {
  try {
    const response = await fetch("http://localhost:5000/api/v1/library", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(libraryData),
    });

    console.log("Response Status:", response.status);
    const responseText = await response.text();
    console.log("Response Text:", responseText);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}, Response: ${responseText}`
      );
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("Error creating library:", error);
    throw error;
  }
};

export const getLibraries = async (
  token: string,
  userId: string
): Promise<Library[]> => {
  console.log("Fetching libraries started for user:", userId);

  try {
    await new Promise(timer => setTimeout(timer, 2000)) 
    const response = await fetch(`http://localhost:5000/api/v1/libraries?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
  
    });
    
    console.log("Libraries API response status:", response.status);
    
    if (!response.ok) {
      console.error("Failed to fetch libraries:", response.status, response.statusText);
      return [];
    }
    
    const libraries: Library[] = await response.json();
    console.log("Libraries fetched successfully:", libraries.length);
    return libraries;
  } catch (er) {
    console.error("Error fetching libraries:", er);
    return [];
  }
};
