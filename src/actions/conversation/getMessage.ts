import { Request, Response } from "express";
import replies from "../../constants/replies";
import getContext from "./getContext";
import ProcessManager from "../../utils/processManager";
import { ArjunResponse, Message, User } from "../../types";
import { pgPool } from "../../utils/sessionManager";
import supabase from "../../utils/supabaseClient";

const getMessage=async (req: Request, res: Response) => {

    if (req&&req.body) {
        if (
            req.body.owner&&
            req.body.messageObj
        ) {

            const message: Message=req.body.messageObj;
            const user=req.user||null;

            if (user===null) {
                const userSession: User={
                    phone: message.phone,
                    processId: null,
                    chatHistory: [],
                    name: message.name
                };

                try {

                    let { data, error, status }=await supabase
                        .from("profiles")
                        .select(`full_name, phone_number, google_refresh_token`)
                        .eq("phone_number", userSession.phone)
                        .single();

                    if (error&&status!==406) {
                        console.error(error);
                        const response: ArjunResponse[]=[{ owner: req.body.owner, isReply: false, message: replies.internalErrorMessage as string }];
                        return res.status(200).send(response);
                    }
                    if (data&&data.google_refresh_token!==null) {
                        userSession.name=data.full_name||message.name;
                        userSession.refreshToken=data.google_refresh_token;
                        userSession.accessToken="";
                    }
                    else {
                        const response: ArjunResponse[]=[{ owner: req.body.owner, isReply: false, message: replies.unregisteredUser as string }];
                        return res.status(200).send(response);
                    }

                } catch (error) {
                    console.error(error);
                    const response: ArjunResponse[]=[{ owner: req.body.owner, isReply: false, message: replies.internalErrorMessage as string }];
                    return res.status(200).send(response);
                }

                req.user=userSession;
                await req.saveUserSession(userSession);
                let response: ArjunResponse[]=[];
                response.push({ owner: req.body.owner, isReply: false, message: (replies.userOnboardedMessage as ((name: string) => string))(req.user.name||"There") });
                req.user.chatHistory.push(
                    { role: 'assistant', content: response[0].message }
                );
                const newProcess=await ProcessManager.createProcess('user-onboarding', req);
                if (newProcess.welcomeMessage!=null) {
                    response.push({ owner: req.body.owner, isReply: false, message: newProcess.welcomeMessage });
                    req.user.chatHistory.push(
                        { role: 'assistant', content: newProcess.welcomeMessage }
                    );
                    await req.saveUserSession(req.user);
                    return res.status(200).send(response);
                }
                await req.saveUserSession(req.user);
                return res.status(200).send(response);
            }

            if (message.body==="") {
                const response: ArjunResponse[]=[{ owner: req.body.owner, isReply: false, message: replies.invalidInputMessage as string }];
                return res.status(200).send(response);
            }

            req.user.chatHistory.push(
                { role: 'user', content: message.body }
            );

            // Continue if there is any ongoing process
            if (user.processId!=null) {
                const currentProcess=ProcessManager.findProcess(user.processId);
                if (currentProcess===null) {
                    req.user.processId=null;
                }
                else {
                    const nextQuestion=await currentProcess.handleUserResponse(message.body);
                    if (nextQuestion!=null) {
                        const response: ArjunResponse[]=[{ owner: req.body.owner, isReply: false, message: nextQuestion }];
                        req.user.chatHistory.push(
                            { role: 'assistant', content: nextQuestion }
                        );
                        await req.saveUserSession(req.user);
                        return res.status(200).send(response);
                    }
                    const responseList=await currentProcess.postProcessAction(req);
                    const response: ArjunResponse[]=[];
                    for (let i=0; i<responseList.length; i++) {
                        response.push(
                            { owner: req.body.owner, isReply: false, message: responseList[i] }
                        );
                        req.user.chatHistory.push(
                            { role: 'assistant', content: responseList[i] }
                        );
                    }
                    await req.saveUserSession(req.user);
                    return res.status(200).send(response);
                }
            }

            // get context from user message and initiate appropriate process
            const response=await getContext(req);
            response.forEach((reply: ArjunResponse) => {
                req.user.chatHistory.push({ role: 'assistant', content: reply.message });
            });
            await req.saveUserSession(req.user);
            return res.status(200).send(response);
        }
        // Return a '404 Not Found' if data is missing
        return res.sendStatus(404);
    } else {
        // Return a '404 Not Found' if event is not from a WhatsApp Backend
        return res.sendStatus(404);
    }
}


export default getMessage;