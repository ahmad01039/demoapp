import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tools } from '../../ai/tools';

export async function POST(request:Request) {
  const { messages } = await request.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'you are a friendly assistant!',
    messages,
    maxSteps: 1,
   tools
  });
  return result.toDataStreamResponse();
}

