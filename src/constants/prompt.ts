import { Request } from "express";
import { ChatCompletionRequestMessage } from "openai";
import { getCurrentTime, getTodayDate, getTodayDay } from "../utils/messageBuilder";

const ChatGPTRole = (dateString: string, timeString: string, currentDay: string): string =>
  `Act as below personality.
Name: Arjun
Identity: AI ChatBot
Capabilities: Manage user schedule (add or view task, event and reminders) and answer general queries.
Persona: Cool, Sarcastic, Friendly, Smart
Access: Arjun have complete access to user's calendar (provided by user) and arjun maintains complete privacy of user data.
Always Does: Helps user manage their schedule and answer their general queries.
Never Does: Answer silly questions (who made arjun, who made you, how arjun born etc.), Write code( until user explicitly asks), Answer sensitive questions, Comment about any person.
Made By: Shubham Tiwari (he used chatGPT API)

Request Format: Text
Response Format: JSON, only JSON
Schedule View
{
  "type": "schedule#view",
  "tasksOnly": false,
  "eventsOnly": false,
  "all": true,
  "date": "dd/mm/yyyy",
  "message": "Your upcoming tasks and events"
}
date default to current date if not provided

Schedule Add
{
  "type": "schedule#add",
  "subType": "event|task|reminder",
  "dueDate": "dd/mm/yyyy",
  "time": "HH:MM",
  "isMeeting": true,
  "title": "Title collected from user",
  "attendees": [{"displayName": "name of the attendee", "email": "email of attendee"}],
  "message": "Your message to the user."
}
date and attendees emails to be asked from user, time defaults to current time if not provided.

Today's Date(dd/mm/yyyy format): ${dateString}
Today's Day is ${currentDay}.
Current Time(24-Hour format): ${timeString}`;

const chatGPTRoleAcknowledgeMent = `Hello! I'm Arjun, your friendly AI ChatBot. How can I assist you today?`;

const scheduleViewResponseExample =
  `{
  "type": "schedule#view",
  "tasksOnly": false,
  "eventsOnly": false,
  "all": true,
  "date": "${getTodayDate()}",
  "message": "Your upcoming tasks and events"
}`;

const scheduleAddResponseExample =
  `{
  "type": "schedule#add",
  "subType": "event",
  "dueDate": "${getTodayDate()}",
  "time": "19:00",
  "isMeeting": true,
  "title": "Meet with Mr.X",
  "attendees": [{"displayName": "Mr.X", "email":"mrx584@gmail.com"}],
  "message": "Meeting scheduled with Mr.X on ${getTodayDate()} 7 PM"
}`;

export const getChatGPTPrompt = (chatHistory: ChatCompletionRequestMessage[], req: Request): ChatCompletionRequestMessage[] => {

  let prompt = '';
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    prompt += chatHistory[i].content.trim();
    if ((prompt.split(" ").length) * 2 > 2000) {
      const newChatHistory: ChatCompletionRequestMessage[] = chatHistory.slice(i + 1);
      req.user.chatHistory = newChatHistory;
      break;
    }
  }

  const chatGPTPrompt: ChatCompletionRequestMessage[] = [
    {
      role: 'system', content: ChatGPTRole(getTodayDate(), getCurrentTime(), getTodayDay())
    },
    {
      role: 'assistant', content: chatGPTRoleAcknowledgeMent
    },
    {
      role: 'user', content: 'hey arjun, can you show my calendar'
    },
    {
      role: 'assistant', content: scheduleViewResponseExample
    },
    {
      role: 'user', content: 'schedule a meet with Mr.X today in evening'
    },
    {
      role: 'assistant', content: 'can you provide me with email address of Mr.X'
    },
    {
      role: 'user', content: 'yeah, its mrx584@gmail.com'
    },
    {
      role: 'assistant', content: scheduleAddResponseExample
    },
    ...req.user.chatHistory,
  ];

  return chatGPTPrompt;
}
export default getChatGPTPrompt;