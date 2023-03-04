import { Request } from "express";
import { google } from "googleapis";
import replies from "../../constants/replies";
import { isJSONPresent, validateSchedule } from "../../utils/messageBuilder";
import ScheduleManager from "../../utils/scheduleManager";
import getChatGPTResponse from "./chatGPT";

const getContext=async (message: string, req: Request): Promise<string> => {

    const chatGPTResponse=await getChatGPTResponse(req.user.chatHistory, req);
    if (chatGPTResponse) {
        const scheduleInfo=isJSONPresent(chatGPTResponse);
        if (scheduleInfo.isJson&&scheduleInfo.data) {
            if (validateSchedule(scheduleInfo.data)) {
                const oauth2Client=new google.auth.OAuth2();
                oauth2Client.setCredentials({ access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjc3OTIzODUzLCJzdWIiOiIxYTVlMzU0YS02NWJkLTQ0ZTEtOGQyMy0zMTg1MzhkZGZkZTQiLCJlbWFpbCI6InNodWJoYW10aXdhcmlweXRob24yMDA0QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WXdmRHIwazBBRUxuTmNidUtPamc2MXVYU0EtWC1vTUxrUk5nNlE9czk2LWMiLCJlbWFpbCI6InNodWJoYW10aXdhcmlweXRob24yMDA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJTaHViaGFtIFRpd2FyaSIsImlzcyI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3VzZXJpbmZvL3YyL21lIiwibmFtZSI6IlNodWJoYW0gVGl3YXJpIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFl3ZkRyMGswQUVMbk5jYnVLT2pnNjF1WFNBLVgtb01Ma1JOZzZRPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMTQ4NzE2NjMyNTQ5NDkwMDY4MjgiLCJzdWIiOiIxMTQ4NzE2NjMyNTQ5NDkwMDY4MjgifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTY3NzkyMDI1M31dLCJzZXNzaW9uX2lkIjoiNTRjMGZjMGQtYzVhYS00YmJiLTk4OTYtYWUyYzllMmZjNjJmIn0.9wPWeHoSW-iaK19KCI2AWfsct2U5G4Cz-uJtFxsC37k' });
                const scheduleManager=new ScheduleManager(oauth2Client);
                const responseMessage=await scheduleManager.createCalendarEntry(scheduleInfo.data);
                return responseMessage as string;
                return "hi";
            }
            return replies.invalidInputMessage as string;
        }
        return chatGPTResponse as string;
    }

    return replies.invalidInputMessage as string;
}

export default getContext;