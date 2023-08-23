import OpenAI from 'openai';

import { PromptData } from "../data"; // make sure the correct import is used
const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openAIKey,
  dangerouslyAllowBrowser: true,
});

export const generateResponse = async (promptData: PromptData, updateUI: (content: string) => void) => {
  const stream = await openai.chat.completions.create({
    model: promptData.model,
    messages: promptData.messages,
    temperature: promptData.parameters.temperature,
    stream: true,
  });
  

  for await (const part of stream) {
    const content = part.choices[0]?.delta?.content || '';
    // console.log(content);
    updateUI(content); // This will call the updateUI function with the content
  }
}
