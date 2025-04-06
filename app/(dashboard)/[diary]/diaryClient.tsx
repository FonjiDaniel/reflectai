
"use client";
import TailwindAdvancedEditor from "@/components/editor/editor";
import useSWR from "swr";
import { getDiaryContent } from "@/lib/actions/library";

interface DiaryEditorClientProps {
  diaryId: string;
  token: string;
}

export default function DiaryClient({ diaryId, token }: DiaryEditorClientProps) {

  const { data: initialContent, error, isLoading } = useSWR(
    [diaryId, token],
    async () => await getDiaryContent(diaryId, token),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  if (isLoading) {
    return (
      <div className="h-6 w-[50%] bg-[#312f2f] rounded-xl mt-4 animate-pulse"></div>
    );
  }

  if (error) {
    return <p>Failed to load diary content. Please try again</p>;
  }

  return <TailwindAdvancedEditor initialValue={initialContent} />;
}