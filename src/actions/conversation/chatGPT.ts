import { Request } from "express";
import { ChatCompletionRequestMessage } from "openai";
import openai from "../../utils/openai";
import getChatGPTPrompt from "../../constants/prompt";

export const getChatGPTResponse = async (prompt: ChatCompletionRequestMessage[], req: Request) => {
  const chatGPTPrompt = getChatGPTPrompt(prompt, req);
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatGPTPrompt,
      temperature: 0,
      max_tokens: 800
    });
    return response.data.choices[0].message?.content;
  } catch (error) {
    console.log("ChatGPT API error", error);
    return undefined;
  }
}

export default getChatGPTResponse;
