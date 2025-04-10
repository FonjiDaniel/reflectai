import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText, type CoreMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { match } from "ts-pattern";
import { getServerAuthData } from "@/lib/actions/user";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});


export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  try {
  
    if (!process.env.GEMINI_API_KEY) {
      return new Response("Missing GEMINI_API_KEY - make sure to add it to your .env file.", {
        status: 400,
      });
    }

    if (process.env.redis_KV_REST_API_URL && process.env.redis_KV_REST_API_TOKEN) {

      const {user} = await getServerAuthData();

      if(!user?.id) return new Response("Unauthorized", { status: 401 });
      const ratelimit = new Ratelimit ({
        redis: kv,
        limiter: Ratelimit.slidingWindow(3, "1 d"),
      })

      

      const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${user.id}`);

      if (!success) {
        return new Response("You have reached your request limit for the day.", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }

    const { prompt, option, command } = await req.json();

    if (!prompt || !option) {
      return new Response("Missing required fields: prompt or option", { status: 400 });
    }

    console.error("the request is: ", { prompt, option, command });


    const messages: CoreMessage[] = match(option)
      .with("continue", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that continues existing text based on context from prior text. " +
            "Give more weight/priority to the later characters than the beginning ones. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: prompt },
      ])
      .with("improve", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that improves existing text. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: `The existing text is: ${prompt}` },
      ])
      .with("shorter", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that shortens existing text. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: `The existing text is: ${prompt}` },
      ])
      .with("longer", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that lengthens existing text. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: `The existing text is: ${prompt}` },
      ])
      .with("fix", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
            "Limit your response to no more than 200 characters, but make sure to construct complete sentences. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: `The existing text is: ${prompt}` },
      ])
      .with("zap", () => [
        {
          role: "system",
          content:
            "You are an AI writing assistant that generates text based on a prompt. " +
            "You take an input from the user and a command for manipulating the text. " +
            "Use Markdown formatting when appropriate.",
        },
        { role: "user", content: `For this text: ${prompt}. You have to respect the command: ${command}` },
      ])
      .run() as CoreMessage[];

    
    const result = await streamText({

      model: google("gemini-1.5-pro-latest"), 
      messages: messages,
      maxTokens: 4096, // Check Gemini's limits if necessary
      temperature: 0.7,
      topP: 1, 
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    const status = error instanceof Error && 'status' in error ? (error as any).status : 500; // Attempt to get status code if available

    return new Response(
      JSON.stringify({ error: message }), 
      {
        status: status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}