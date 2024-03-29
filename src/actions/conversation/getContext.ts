import { Request } from "express";
import { google } from "googleapis";
import replies from "../../constants/replies";
import { ArjunResponse, ScheduleElement, ScheduleAddInfo, ScheduleViewInfo } from "../../types";
import environmentVariables from "../../utils/config";
import { isJSONPresent } from "../../utils/messageBuilder";
import { isAccessTokenValid } from "../../utils/oauthToken";
import ScheduleManager from "../../utils/scheduleManager";
import getChatGPTResponse from "./chatGPT";
import { validateSchedule } from "../../validator/validateResources";

const getContext = async (req: Request): Promise<ArjunResponse[]> => {

  const response: ArjunResponse[] = [];

  const chatGPTResponse = await getChatGPTResponse(req.user.chatHistory, req);
  if (chatGPTResponse) {
    const scheduleInfo = isJSONPresent(chatGPTResponse);
    if (scheduleInfo.isJson && scheduleInfo.data) {
      const oauth2Client = new google.auth.OAuth2({
        clientId: environmentVariables.googleOauthClientID,
        clientSecret: environmentVariables.googleOauthClientSecret,
        redirectUri: environmentVariables.googleOauthRedirectUri
      });
      oauth2Client.setCredentials({ refresh_token: req.user.refreshToken, access_token: req.user.accessToken });

      if (!await isAccessTokenValid(req.user.accessToken as string)) {
        try {
          const newAccessToken = await oauth2Client.refreshAccessToken();
          req.user.accessToken = newAccessToken.credentials.access_token as string;
          oauth2Client.setCredentials({ refresh_token: req.user.refreshToken, access_token: newAccessToken.credentials.access_token });
        } catch (error) {
          console.log("Error generating Access Token, ", error);
          response.push({ owner: req.body.owner, isReply: false, message: replies.internalErrorMessage as string });
          req.user.chatHistory.pop();
          return response;
        }
      }

      if (scheduleInfo.data.type === "schedule#add") {
        scheduleInfo.data = scheduleInfo.data as ScheduleAddInfo;
        if (validateSchedule(scheduleInfo.data)) {
          const scheduleManager = new ScheduleManager(oauth2Client);
          const responseMessage = await scheduleManager.createCalendarEntry(scheduleInfo.data);
          response.push({ owner: req.body.owner, isReply: false, message: responseMessage });
          req.user.chatHistory.push({ role: 'assistant', content: chatGPTResponse });
          return response;
        }

      } else if (scheduleInfo.data.type === "schedule#view") {
        scheduleInfo.data = scheduleInfo.data as ScheduleViewInfo;
        if (validateSchedule(scheduleInfo.data)) {
          const scheduleManager = new ScheduleManager(oauth2Client);
          const userSchedule: ScheduleElement[] = await scheduleManager.getSchedule(scheduleInfo.data);
          if (userSchedule.length > 0) {
            response.push({ owner: req.body.owner, isReply: false, message: "Upcoming Tasks and Events" });
            userSchedule.forEach(scheduleItem => {
              response.push({
                owner: req.body.owner,
                isReply: false,
                message: `*Type:* ${scheduleItem.type}\n*Title:* ${scheduleItem.title}\n*Due:* ${scheduleItem.dueDate} ${scheduleItem.dueTime}`
              });
            });
          } else {
            response.push({ owner: req.body.owner, isReply: false, message: 'Looks like you have a free day today! 😎 Time to put on those comfy pants, grab some popcorn 🍿, and binge-watch your favorite show 📺. Enjoy your day off!' });
          }
          req.user.chatHistory.push({ role: "assistant", content: chatGPTResponse });
          return response;
        }
      }
      response.push({ owner: req.body.owner, isReply: false, message: replies.invalidInputMessage as string });
      req.user.chatHistory.pop();
      return response;
    }
    response.push({ owner: req.body.owner, isReply: false, message: chatGPTResponse as string });
    req.user.chatHistory.push({ role: "assistant", content: chatGPTResponse });
    return response;
  }

  response.push({ owner: req.body.owner, isReply: false, message: replies.invalidInputMessage as string });
  req.user.chatHistory.pop();
  return response;
}

export default getContext;