// // import { openai } from "@ai-sdk/openai";
// import { Ratelimit } from "@upstash/ratelimit";
// import { kv } from "@vercel/kv";
// import { streamText } from "ai";
// import { match } from "ts-pattern";
// import { createOpenAI } from '@ai-sdk/openai';

// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';



// const openai = new OpenAI({

//   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_SECRET
// });
// // IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
// export const runtime = "edge";

// export async function POST(req: Request): Promise<Response> {
//   // Check if the OPENAI_API_KEY is set, if not return 400
//   if (!process.env.NEXT_PUBLIC_OPENAI_API_SECRET || process.env.NEXT_PUBLIC_OPENAI_API_SECRET === "") {
//     return new Response("Missing OPENAI_API_KEY - make sure to add it to your .env file.", {
//       status: 400,
//     });
//   }
//   if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
//     const ip = req.headers.get("x-forwarded-for");
//     const ratelimit = new Ratelimit({
//       redis: kv,
//       limiter: Ratelimit.slidingWindow(50, "1 d"),
//     });

//     const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

//     if (!success) {
//       return new Response("You have reached your request limit for the day.", {
//         status: 429,
//         headers: {
//           "X-RateLimit-Limit": limit.toString(),
//           "X-RateLimit-Remaining": remaining.toString(),
//           "X-RateLimit-Reset": reset.toString(),
//         },
//       });
//     }
//   }

//   const { prompt, option, command } = await req.json();
//   console.log( "the request is : ", req.json());
//   const messages = match(option)
//     .with("continue", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that continues existing text based on context from prior text. " +
//           "Give more weight/priority to the later characters than the beginning ones. " +
//           "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
//           "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: prompt,
//       },
//     ])
//     .with("improve", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that improves existing text. " +
//           "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
//           "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: `The existing text is: ${prompt}`,
//       },
//     ])
//     .with("shorter", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that shortens existing text. " + "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: `The existing text is: ${prompt}`,
//       },
//     ])
//     .with("longer", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that lengthens existing text. " +
//           "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: `The existing text is: ${prompt}`,
//       },
//     ])
//     .with("fix", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that fixes grammar and spelling errors in existing text. " +
//           "Limit your response to no more than 200 characters, but make sure to construct complete sentences." +
//           "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: `The existing text is: ${prompt}`,
//       },
//     ])
//     .with("zap", () => [
//       {
//         role: "system",
//         content:
//           "You are an AI writing assistant that generates text based on a prompt. " +
//           "You take an input from the user and a command for manipulating the text" +
//           "Use Markdown formatting when appropriate.",
//       },
//       {
//         role: "user",
//         content: `For this text: ${prompt}. You have to respect the command: ${command}`,
//       },
//     ])
//     .run();

//   // const result = streamText({
//   //   prompt: messages[messages.length - 1].content,
//   //   maxTokens: 4096,
//   //   temperature: 0.7,
//   //   topP: 1,
//   //   frequencyPenalty: 0,
//   //   presencePenalty: 0,
//   //   model: openai("gpt-4o-mini")
//   // });



//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     messages: [
//       {
//         role: 'system',
//         content:
//           'You are an AI writing assistant that continues existing text based on context from prior text. ' +
//           'Give more weight/priority to the later characters than the beginning ones. ' +
//           'Limit your response to no more than 200 characters, but make sure to construct complete sentences.',
//       },
//       {
//         role: 'user',
//         content: prompt,
//       },
//     ],
//     temperature: 0.7,
//     top_p: 1,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     stream: true,
//     n: 1,
//   });

//   console.log(result);

//   return result.toDataStreamResponse();
// }




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
  const result = await streamText({
    model: openai("gpt-4o-mini"), // or "gpt-3.5-turbo" if preferred
    prompt:  messages[messages.length - 1].content,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
  });

  return result.toDataStreamResponse();
}