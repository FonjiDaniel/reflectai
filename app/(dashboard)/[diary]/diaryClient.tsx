
"use client";

import React from "react";
import TailwindAdvancedEditor from "@/components/editor/editor";
import { JSONContent } from "novel";

interface DiaryEditorClientProps {
  initialContent: JSONContent;
  diaryId: string;
}

export default function DiaryClient({ initialContent, diaryId }: DiaryEditorClientProps) {
  return (
    <TailwindAdvancedEditor initialValue={initialContent} key={diaryId} />
  );
}