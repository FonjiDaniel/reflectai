import React from "react";
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


  return (

    <DiaryClient diaryId={diaryId} token={token!} />

  );
}
