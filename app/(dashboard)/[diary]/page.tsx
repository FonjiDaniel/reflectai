"use client"
import React, { useEffect } from "react";
import TailwindAdvancedEditor from "@/components/editor/editor";
import { ModeToggle } from "@/components/ModeToggle";


export default function Page({ params }: { params: Promise<{ diary: string }> }) {
  // const [content, setContent] = React.useState<string | undefined>('initialcontent');

  useEffect(() => {
    const fetchDiary = async () => {
      const path = (await params)?.diary;
      console.log(path);
    };
    fetchDiary();
  },)


  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-10">
      <TailwindAdvancedEditor />
    </div>
  );
}
