import { ChatCompletionRequestMessage } from 'openai';
import { Message } from 'whatsapp-web.js';

export interface WaBotMessage extends Message {
  _data?: {
    notifyName?: string;
  };
}

export interface JsonPresentResponse {
  isJson: boolean;
  data?: ScheduleInfo;
}

export interface ScheduleInfo {
  type: string;
  subtype: string;
  dueDate: string;
  time: string;
  title: string;
  message: string;
}

export interface User {
  name?: string;
  phone: string;
  processId: string | null;
  chatHistory: ChatCompletionRequestMessage[];
}

export interface Question {
  question: string;
  answer: string | null;
  errorMsg?: string;
  validateAnswer: (answer: string) => Promise<boolean> | boolean;
}

declare module 'express-session' {
  export interface SessionData {
    user: User;
  }
}