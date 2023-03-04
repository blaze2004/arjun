import { Request } from "express";
import { ChatCompletionRequestMessage } from "openai";
import ChatGPTRole from "../../constants/prompt";
import { getTodayDate } from "../../utils/messageBuilder";
import openai from "../../utils/openai";

export const getChatGPTPrompt = (chatHistory: ChatCompletionRequestMessage[], req: Request): ChatCompletionRequestMessage[] => {
    const chatGPTPrompt: ChatCompletionRequestMessage[] = [
        { role: 'system', content: ChatGPTRole + getTodayDate() },
        ...chatHistory,
    ];

    let prompt = '';
    for (let i = chatGPTPrompt.length - 1; i > 0; i--) {
        prompt += chatGPTPrompt[i].content;
        if ((prompt.split(" ").length) > 2000) {
            const newChatHistory: ChatCompletionRequestMessage[] = chatGPTPrompt.slice(i > 1 ? i - 1 : 1, -1);
            req.user.chatHistory = newChatHistory;
            return newChatHistory;
        }
    }

    return chatGPTPrompt;
}

export const getChatGPTResponse = async (prompt: ChatCompletionRequestMessage[], req: Request) => {
    const chatGPTPrompt = getChatGPTPrompt(prompt, req);
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chatGPTPrompt,
            temperature: 0,
            max_tokens: 1000
        });
        return response.data.choices[0].message?.content;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export default getChatGPTResponse;
