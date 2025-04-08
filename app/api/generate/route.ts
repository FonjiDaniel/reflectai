
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { match } from "ts-pattern";

// Initialize OpenAI with the API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_SECRET,
});

// Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  // Check if the OPENAI_API_KEY is set
 try {

  if (!process.env.OPENAI_API_SECRET) {
    return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
      status: 400,
    });
  }

  // Rate limiting (if KV credentials are provided)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

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

  // Define messages based on the option
  const messages = match(option)
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
    .run();

  // Generate streaming response
  const result = streamText({
    model: openai("gpt-4-turbo-preview"), // or "gpt-3.5-turbo" if preferred
    prompt:  messages[messages.length - 1].content,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  return result.toDataStreamResponse();
  
 } catch (error) {

  console.error("API Error:", error);
    return new Response(
      typeof error === "object" && error instanceof Error 
        ? error.message 
        : "An unexpected error occurred",
      { status: 500 }
    );
  
 }
}