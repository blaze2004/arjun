import * as WAWebJS from 'whatsapp-web.js';

export interface TMessage extends WAWebJS.Message {
  _data?: {
    notifyName?: string;
  };
}


export type UserObject = {
  name?: string;
  chatId: string;
  body: WAWebJS.MessageContent
  // more types
}

export type WatsonReply = {
  response_type: string;
}

export type WatsonTextReply = {
  response_type: string;
  text: string
}

export type WatsonSuggestion = {
  label: string;
  value: object;
  output: object;
  dialog_node?: string
}
export type WatsonSuggestionReply = {
  reponse_type: string;
  title: string;
  suggestions: Array<WatsonSuggestion>;
}
