// File: api/chat.ts
import { GoogleGenAI } from "@google/genai";
import type { Message } from '../types';

// This tells Vercel to use the Edge Runtime which is faster.
export const config = {
  runtime: 'edge',
};

const SYSTEM_INSTRUCTION = "You are GreenBot, a friendly and helpful assistant with a love for nature. Your responses should be positive, encouraging, and occasionally include fun facts about plants or animals. Keep your answers concise and easy to understand.";

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { history } = (await req.json()) as { history: Message[] };
    
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set on the server");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // The last message is the new user prompt
    const lastMessage = history.pop();
    if (!lastMessage || lastMessage.sender !== 'USER') {
        throw new Error("Last message in history must be from the user.");
    }
    
    // Reconstruct history for the Gemini API
    const geminiHistory = history.map(msg => ({
      role: msg.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: geminiHistory,
    });
    
    const result = await chat.sendMessageStream({ message: lastMessage.text });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: 'Something went wrong on the server.', details: errorMessage }), { status: 500 });
  }
}