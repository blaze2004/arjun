import * as WAWebJS from "whatsapp-web.js";

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
