import { ChatCompletionRequestMessage } from 'openai';

export type MessageRequestType = {
  owner: string;
  messageObj: MessageObject;
};

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

export interface ScheduleAddInfo {
  type: string;
  subType: string;
  dueDate: string;
  time: string;
  isMeeting: boolean;
  title: string;
  attendees: AttendeeInfo[];
  message: string;
}

export interface AttendeeInfo {
  displayName: string;
  email: string;
}

export interface ScheduleViewInfo {
  type: string;
  eventsOnly: boolean;
  tasksOnly: boolean;
  all: boolean;
  date: string;
  message: string;
}

export type ChatGPTScheduleInfo = ScheduleAddInfo | ScheduleViewInfo;

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
