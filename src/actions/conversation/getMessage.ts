import { Request, Response } from "express";
import replies from "../../constants/replies";
import { WaBotMessage } from "../../types";
import getContext from "./getContext";
import ProcessManager from "../../utils/processManager";
import { client } from "../..";

const getMessage = async (req: Request, res: Response) => {

    if (req && req.body) {
        if (
            req.body.object &&
            req.body.messageObj
        ) {

            const message: WaBotMessage = req.body.messageObj.message;
            const user = req.user || null;

            if (user === null) {
                const userSession = {
                    phone: message.from,
                    processId: null,
                    chatHistory: [],
                };

                req.user = userSession;
                await req.saveUserSession(userSession);
                const newProcess = await ProcessManager.createProcess('user-onboarding', req);
                if (newProcess.welcomeMessage != null) {
                    await client.sendMessage(message.from, newProcess.welcomeMessage);
                    return res.sendStatus(200);
                }
            }

            if (message.body === "") {
                await client.sendMessage(message.from, replies.invalidInputMessage as string);
                return res.sendStatus(200);
            }

            req.user.chatHistory.push(
                { role: 'user', content: message.body }
            );

            // Continue if there is any ongoing process
            if (user.processId != null) {
                const currentProcess = ProcessManager.findProcess(user.processId);
                if (currentProcess === null) {
                    req.user.processId = null;
                }
                else {
                    const nextQuestion = await currentProcess.handleUserResponse(message.body);
                    if (nextQuestion != null) {
                        await client.sendMessage(message.from, nextQuestion);
                        req.user.chatHistory.push(
                            { role: 'assistant', content: nextQuestion }
                        );
                    }
                    else {
                        const responseList = await currentProcess.postProcessAction(req);
                        for (let i = 0; i < responseList.length; i++) {
                            await client.sendMessage(message.from, responseList[i]);
                            req.user.chatHistory.push(
                                { role: 'assistant', content: responseList[i] }
                            );
                        }
                    }
                    await req.saveUserSession(req.user);
                    return res.sendStatus(200);
                }
            }

            // get context from user message and initiate appropriate process
            const response = await getContext(message.body, req);
            await client.sendMessage(message.from, response);
            req.user.chatHistory.push(
                { role: 'assistant', content: response }
            );
            await req.saveUserSession(req.user);
            return res.sendStatus(200);
        }
        // Return a '404 Not Found' if data is missing
        return res.sendStatus(404);
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp Backend
        return res.sendStatus(404);
    }
}


export default getMessage;