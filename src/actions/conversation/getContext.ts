import { Request } from "express";
import { google } from "googleapis";
import replies from "../../constants/replies";
import { ArjunResponse, ScheduleElement, ScheduleInfo, ScheduleView } from "../../types";
import environmentVariables from "../../utils/config";
import { isJSONPresent, validateSchedule } from "../../utils/messageBuilder";
import ScheduleManager from "../../utils/scheduleManager";
import getChatGPTResponse from "./chatGPT";

const getContext = async (message: string, req: Request): Promise<ArjunResponse[]> => {

    let response: ArjunResponse[] = [];
    // const token=await oauth2Client.refreshAccessToken();
    // console.log(token.credentials.access_token);

    const chatGPTResponse = await getChatGPTResponse(req.user.chatHistory, req);
    if (chatGPTResponse) {
        let scheduleInfo = isJSONPresent(chatGPTResponse);
        if (scheduleInfo.isJson && scheduleInfo.data) {
            const oauth2Client = new google.auth.OAuth2({
                clientId: environmentVariables.googleOauthClientID,
                clientSecret: environmentVariables.googleOauthClientSecret,
                redirectUri: environmentVariables.googleOauthRedirectUri
            });
            oauth2Client.setCredentials({ refresh_token: 'user refresh token fetched from database', access_token: 'user access token fetched with refresh token' });
            if (scheduleInfo.data.type === "schedule#add") {
                scheduleInfo.data = scheduleInfo.data as ScheduleInfo;
                if (validateSchedule(scheduleInfo.data)) {
                    const scheduleManager = new ScheduleManager(oauth2Client);
                    const responseMessage = await scheduleManager.createCalendarEntry(scheduleInfo.data);
                    response.push({ owner: req.body.owner, isReply: false, message: responseMessage });
                    req.user.chatHistory.push(
                        { role: 'assistant', content: responseMessage }
                    );
                    return response;
                }

            } else if (scheduleInfo.data.type === "schedule#view") {
                scheduleInfo.data = scheduleInfo.data as ScheduleView;
                const scheduleManager = new ScheduleManager(oauth2Client);
                const userSchedule: ScheduleElement[] = await scheduleManager.getSchedule({ eventsOnly: scheduleInfo.data.eventsOnly, tasksOnly: scheduleInfo.data.tasksOnly });
                if (userSchedule.length > 0) {
                    response.push({ owner: req.body.owner, isReply: false, message: "Upcoming Tasks and Events" });
                    userSchedule.forEach(scheduleItem => {
                        response.push({
                            owner: req.body.owner,
                            isReply: false,
                            message: `*Type:* ${scheduleItem.type}\n*Title:* ${scheduleItem.title}\n*Due:* ${scheduleItem.dueDate} ${scheduleItem.dueTime}`
                        });
                        req.user.chatHistory.push(
                            { role: 'assistant', content: `*Type:* ${scheduleItem.type}\n*Title:* ${scheduleItem.title}\n*Due:* ${scheduleItem.dueDate} ${scheduleItem.dueTime}` }
                        );
                    });
                } else {
                    response.push({ owner: req.body.owner, isReply: false, message: 'Looks like you have a free day today! 😎 Time to put on those comfy pants, grab some popcorn 🍿, and binge-watch your favorite show 📺. Enjoy your day off!' });
                    req.user.chatHistory.push(
                        { role: 'assistant', content: 'Looks like you have a free day today! 😎 Time to put on those comfy pants, grab some popcorn 🍿, and binge-watch your favorite show 📺. Enjoy your day off!' }
                    );
                }
                return response;
            }
            response.push({ owner: req.body.owner, isReply: false, message: replies.invalidInputMessage as string });
            req.user.chatHistory.push(
                { role: 'assistant', content: replies.invalidInputMessage as string }
            );
            return response;
        }
        response.push({ owner: req.body.owner, isReply: false, message: chatGPTResponse as string });
        req.user.chatHistory.push(
            { role: 'assistant', content: chatGPTResponse }
        );
        return response;
    }

    response.push({ owner: req.body.owner, isReply: false, message: replies.invalidInputMessage as string });
    req.user.chatHistory.push(
        { role: 'assistant', content: replies.invalidInputMessage as string }
    );
    return response;
}

export default getContext;