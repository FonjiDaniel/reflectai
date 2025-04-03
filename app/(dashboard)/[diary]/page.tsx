"use client";
import React from "react";
import TailwindAdvancedEditor from "@/components/editor/editor";
import { notFound, useParams } from "next/navigation";
import { useMyAuth } from "@/hooks/useAuth";
import Head from "next/head";
import useSWR from "swr";
import { getDiaryContent } from "@/lib/actions/library";

const fetcher = (id: string, token: string) =>
  getDiaryContent(id, token);

export default function Page() {
  const { token } = useMyAuth();
  const param = useParams<{ diary: string }>();

  const { data: content, error, isLoading } = useSWR(
    param.diary && token ? [param.diary, token] : null,
    ([id, token,]) => fetcher(id, token)
  );

  if (error) return notFound();

  return (
    <>
      <Head>
        <title>{isLoading ? "Loading..." : "Diary"}</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-10">
        {isLoading ? (
          <div className="h-6 w-[50%] bg-[#312f2f] rounded-xl mt-4  animate-pulse"></div>
        ) : content && content.content ? (
          <TailwindAdvancedEditor initialValue={content} key={param.diary} />
        ) : (
          <p>An error occurred. Refresh the page.</p>
        )}
      </div>
    </>
  );
}
