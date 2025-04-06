
import React from "react";
import { getDiaryContent } from "@/lib/actions/library";
import { getServerAuthData } from "@/lib/actions/user";
import DiaryClient from "./diaryClient";
import type { Metadata } from 'next';


export async function generateMetadata({ params }: { params: { diary: string } }): Promise<Metadata> {
  const {diary : diaryId} = await params;
  
  return {
    title: diaryId,
  };
}

export default async function Page({ params }: { params: Promise<{ diary: string }> }) {
  const { token } = await getServerAuthData();
  const { diary: diaryId } = await params;

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