import { ChatCompletionRequestMessage } from 'openai';
import { Message, MessageContent } from 'whatsapp-web.js';

export interface WaBotMessage extends Message {
  _data?: {
    notifyName?: string;
  };
}

export interface MessageSender {
  name?: string;
  chatId: string;
  body: MessageContent
  // More properties
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