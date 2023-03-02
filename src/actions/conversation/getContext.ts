import { Request } from "express";
import replies from "../../constants/replies";
import ProcessManager from "../../utils/processManager";
import getChatGPTResponse from "./chatGPT";

function detectGreetingOrAppreciation(message: string): string | null {
    const greetingRegexes = [
        /^(hi|hello|hey)( there|).*$/i,
        /^(good )?(morning|afternoon|evening)( there|).*?$|^.*?(good )?(morning|afternoon|evening)( there|).*?$/i,
        /^(hi|hello|hey).*?[,.!]*$/i,
        /^(hey|hi|hello)\s+(man|dude|buddy)[,.!]*$/i,
    ];

    const appreciationRegexes = [
        /^(thanks|thank you|thx).*?[,.!]*$/i,
        /^(i )?(really )?appreciate(d)? it.*?[,.!]*$/i,
        /^(you )?(are )?(the )?(best|awesome|amazing).*?[,.!]*$/i,
    ];

    for (const regex of greetingRegexes) {
        if (regex.test(message)) {
            return "greeting";
        }
    }

    for (const regex of appreciationRegexes) {
        if (regex.test(message)) {
            return "appreciation";
        }
    }

    return null;
}

// function isSchedulePrompt(message: string): boolean {
//     const newsRegex = /(schedule|calendar|task|event|reminder|)/i;
//     return newsRegex.test(message);
// }

const getContext = async (message: string, req: Request): Promise<string> => {

    if (message === "will chat later") {
        return replies.chatLaterMessage as string;
    }
    const isGreetingOrAppreciation = detectGreetingOrAppreciation(message);
    if (isGreetingOrAppreciation !== null) {
        if (isGreetingOrAppreciation === "greeting") {
            const message = (replies.greetingMessage as ((name: string) => string))(req.user.name || "");
            return message;
        }

        if (isGreetingOrAppreciation === "appreciation") {
            return replies.appreciationMessage as string;
        }
    }

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