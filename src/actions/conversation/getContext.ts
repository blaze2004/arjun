import { Request } from "express";
import replies from "../../constants/replies";
import ProcessManager from "../../utils/processManager";
import getChatGPTResponse from "./chatGPT";


// function isSchedulePrompt(message: string): boolean {
//     const newsRegex = /(schedule|calendar|task|event|reminder|)/i;
//     return newsRegex.test(message);
// }

const getContext = async (message: string, req: Request): Promise<string> => {

    // if (isSchedulePrompt(message)) {
    //     const newProcess = await ProcessManager.createProcess("schedule", req);
    //     if (newProcess.welcomeMessage != null) {
    //         return newProcess.welcomeMessage;
    //     }
    //     return replies.welcomeMessage as string;
    // }

    const chatGPTResponse = await getChatGPTResponse(req.user.chatHistory, req);
    if (chatGPTResponse) {
        return chatGPTResponse as string;
    }

    return replies.invalidInputMessage as string;
}

export default getContext;