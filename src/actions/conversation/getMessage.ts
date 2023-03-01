import { Request } from "express";
import replies from "../../constants/replies";
import { MessageSender, WaBotMessage } from "../../types";
import getContext from "./getContext";

const getMessage = async (message: WaBotMessage, req: Request) => {

    req.user = {
        name: message._data?.notifyName,
        phone: message.from,
        processId: null // if existing session use that
    }

    await req.saveUserSession(req.user);

    const user: MessageSender = {
        name: message._data?.notifyName,
        chatId: message.from,
        body: message.body
    }
    if (message.body != "") {
        const response = await getContext(message.body as string, req);
        message.reply(response);
    } else {
        message.reply(replies.invalidInputMessage as string);
    }
}


export default getMessage;