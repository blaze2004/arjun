import { ChatCompletionRequestMessage } from 'openai';

export interface MessageObject {
  phone: string;
  name?: string;
  body: string;
}

export interface ArjunResponse {
  owner: string;
  message: string;
  isReply: boolean;
}

export interface ScheduleElement {
  title: string;
  dueDate: string;
  dueTime: string;
  type: string;
}

export interface JsonPresentResponse {
  isJson: boolean;
  data?: ChatGPTScheduleInfo;
}

export interface ScheduleInfo {
  type: string;
  subType: string;
  dueDate: string;
  time: string;
  title: string;
  message: string;
}

export interface ScheduleView {
  type: string;
  eventsOnly: boolean;
  tasksOnly: boolean;
  all: boolean;
  message: string;
}

export type ChatGPTScheduleInfo = ScheduleInfo | ScheduleView;

export interface AddToScheduleResponse {
  success: boolean;
  message: string;
}

export interface User {
  name?: string;
  phone: string;
  processId: string | null;
  chatHistory: ChatCompletionRequestMessage[];
  refreshToken?: string;
  accessToken?: string;
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
