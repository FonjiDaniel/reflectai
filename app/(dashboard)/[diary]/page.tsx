import React from "react";
import { getDiaryContent } from "@/lib/actions/library";
import { getServerAuthData } from "@/lib/actions/user";
import DiaryClient from "./diaryClient";
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    diary: string;
  }>;
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const diaryId = resolvedParams.diary;

  return {
    title: diaryId,
  };
}


export default async function Page({ params }: { params: Promise<{ diary: string }> }) {
  const resolvedParams = await params;
  const diaryId = resolvedParams.diary;

  const { token } = await getServerAuthData();

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
