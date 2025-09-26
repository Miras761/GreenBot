import { Message } from '../types';

export async function getBotResponseStream(history: Message[]): Promise<ReadableStream<string>> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error('Failed to connect to the chatbot service.');
  }

  if (!response.body) {
    throw new Error('The response body is empty.');
  }
  
  const reader = response.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          // value is a Uint8Array, we decode it to a string
          const textChunk = decoder.decode(value, { stream: true });
          controller.enqueue(textChunk);
        }
      } catch (error) {
        console.error("Error reading stream:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
