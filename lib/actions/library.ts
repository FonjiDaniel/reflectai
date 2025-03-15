import { createLibraryProps, Library } from "@/types/index";
import { config } from "../config";
import { JSONContent } from "novel";

export const createLibrary = async (
  libraryData: createLibraryProps,
  token: string
) => {
  try {
    const response = await fetch(`${config.backendBaseUrl}/library`, {
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
  userId: string,
  token: string
): Promise<Library[]> => {
  try {
    await new Promise((timer) => setTimeout(timer, 2000));
    const response = await fetch(
      `${config.backendBaseUrl}/libraries?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch libraries:",
        response.status,
        response.statusText
      );
      return [];
    }

    const libraries: Library[] = await response.json();
    return libraries;
  } catch (er) {
    console.error("Error fetching libraries:", er);
    return [];
  }
};

export const getLibraryContent = async (id: string, token: string) => {
  try {
    const response = await fetch(
      `${config.backendBaseUrl}/library/content/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch library content:",
        response.status,
        response.statusText
      );
      return;
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (er) {
    console.log(er);
    throw er;
  }
};

export const updateLibraryContent = async (
  id: string,
  token: string,
  title: string,
  content: JSONContent,
  metadata?: string
) => {
  try {
    const body: Record<string, any> = {};

    if (title) body.title = title;
    if (content) body.content = content;
    if (metadata) body.metadata = metadata;

    if (Object.keys(body).length === 0) {
      throw new Error(
        "At least one field (title, metadata, or content) must be provided."
      );
    }

    const res = await fetch(`${config.backendBaseUrl}/library/content/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to update library content: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error updating library content:", error);
    throw error;
  }
};
