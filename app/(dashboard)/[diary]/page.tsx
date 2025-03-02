import Tiptap from "@/components/Editor";
import React from "react";

type Diary = { title: string; content: string };

const diaries: { [key: string]: Diary } = {
  "1": { title: "My First Diary Entry", content: "This is my first entry..." },
  "2": { title: "Reflections on AI", content: "AI is transforming the world..." },
  "3": { title: "Financial Goals for 2025", content: "I want to achieve financial freedom..." },
};

export default async function Page({ params}: {params: Promise<{ diary: string }>}) {
  const path =  (await params)?.diary ;
  console.log(path);

  // const diary = diaries[path];


  return (
    <div>
      <Tiptap/>
      <h1 className="text-2xl font-bold">{diaries[1].title}</h1>
      <p className="mt-4 text-gray-600">{diaries[1].content}</p>
    </div>
  );
}
