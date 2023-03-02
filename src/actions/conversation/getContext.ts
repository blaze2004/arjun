import { Request } from "express";
import replies from "../../constants/replies";
import { isJSONPresent, validateSchedule } from "../../utils/messageBuilder";
import getChatGPTResponse from "./chatGPT";

const getContext = async (message: string, req: Request): Promise<string> => {

    const chatGPTResponse = await getChatGPTResponse(req.user.chatHistory, req);
    if (chatGPTResponse) {
        const scheduleInfo = isJSONPresent(chatGPTResponse);
        if (scheduleInfo.isJson) {
            if (validateSchedule(scheduleInfo.data!)) {
                // schedule the task, reminder or event
                return scheduleInfo.data!.message as string;
            }
            return replies.invalidInputMessage as string;
        }
        return chatGPTResponse as string;
    }

    return replies.invalidInputMessage as string;
}

export default getContext;