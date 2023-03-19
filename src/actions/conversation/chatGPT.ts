import { Request } from "express";
import { ChatCompletionRequestMessage } from "openai";
import ChatGPTRole, { chatGPTRoleAcknowledgeMent } from "../../constants/prompt";
import { getCurrentTime, getTodayDate } from "../../utils/messageBuilder";
import openai from "../../utils/openai";

export const getChatGPTPrompt = (chatHistory: ChatCompletionRequestMessage[], req: Request): ChatCompletionRequestMessage[] => {
  const chatGPTPrompt: ChatCompletionRequestMessage[] = [
    { role: 'system', content: ChatGPTRole(getTodayDate(), getCurrentTime()) },
    { role: 'assistant', content: chatGPTRoleAcknowledgeMent },
    { role: 'user', content: 'hey arjun, can you show my calendar' },
    {
      role: 'assistant', content: `{
            "type": "schedule#view",
            "tasksOnly": false,
            "eventsOnly": false,
            "all": true,
            "date": "${getTodayDate()}",
            "message": "Your upcoming tasks and events"
            }`},
    {
      role: 'user', content: 'schedule a meet with kane today in evening'
    },
    {
      role: 'assistant',
      content: `{
                "type": "schedule#add",
                "subType": "event",
                "dueDate": "${getTodayDate()}",
                "time": "19:00",
                "title": "Meet with Kane",
                "message": "Meeting scheduled with Kane on ${getTodayDate()} 7 PM"
                }`
    },
    ...chatHistory,
  ];

  let prompt = '';
  for (let i = chatGPTPrompt.length - 1; i > 0; i--) {
    prompt += chatGPTPrompt[i].content.trim();
    if ((prompt.split(" ").length) * 2 > 2000) {
      const newChatHistory: ChatCompletionRequestMessage[] = chatGPTPrompt.slice(i > 5 ? i - 1 : 5);
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
      max_tokens: 600
    });
    return response.data.choices[0].message?.content;
  } catch (error) {
    console.log("ChatGPT API error", error);
    return undefined;
  }
}

export default getChatGPTResponse;
