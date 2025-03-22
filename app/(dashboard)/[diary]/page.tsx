"use client"
import React, { useEffect } from "react";
import TailwindAdvancedEditor from "@/components/editor/editor";
import { notFound, useParams } from "next/navigation";
import { useMyAuth } from "@/hooks/useAuth";
import { getDiaryContent } from "@/lib/actions/library";
import Head from "next/head";



export default function Page({ params }: { params: Promise<{ diary: string }> }) {
  const [content, setContent] = React.useState();
  const { token } = useMyAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const param = useParams<{ diary: string }>()
  console.log(" param is param", param.diary);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const initialInfo = await getDiaryContent(param.diary, token);
        if(!initialInfo) notFound()
        console.log( " the initial content is " ,initialInfo)
        setContent(initialInfo);
        console.log("initial page content is :", initialInfo)
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (param.diary && token) {
      fetchData();
    }
  }, [param.diary, token]);



  return (
  <>
  <Head>
    <title>
      {isLoading? "next" : "title"}
    </title>
  </Head>
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-10">
      {isLoading ? (
        <p>Loading...</p>
      ) : content ? (
        <>
          <TailwindAdvancedEditor initialValue={content} />
        </>
      ) : (
        <p>an error occcured. Refresh The page </p>
      )}
    </div>
    </>
  );
}
