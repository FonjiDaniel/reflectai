
import React from "react";
import { getDiaryContent } from "@/lib/actions/library";
import { getServerAuthData } from "@/lib/actions/user";
import DiaryClient from "./diaryClient";
import type { Metadata } from 'next';


interface PageProps {
  params: {
    diary: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const  diaryId = params.diary

  return {
    title: diaryId,
  };
}

export default async function Page({ params }: PageProps ) {
  const { token } = await getServerAuthData();
  const diaryId  = params.diary

  if (!token) {
    return <p>Not authenticated.</p>;
  }

  let initialContent;
  try {
    initialContent = await getDiaryContent(diaryId, token);
  } catch (error) {
    console.error("Failed to fetch diary content:", error);
    return <p>Failed to load diary content. Please try again</p>;
  }


  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 max-sm:px-0">
      <DiaryClient initialContent={initialContent} diaryId={diaryId} />
    </div>
  );
}