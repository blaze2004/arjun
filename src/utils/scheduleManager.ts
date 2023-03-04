import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { AddToScheduleResponse, ScheduleInfo } from "../types";

class ScheduleManager {
    private readonly calendar=google.calendar("v3");
    private readonly tasks=google.tasks("v1");
    private readonly auth: OAuth2Client;

    constructor(auth: OAuth2Client) {
        this.auth=auth;
    }

    public async createCalendarEntry(scheduleInfo: ScheduleInfo): Promise<string> {
        let response: AddToScheduleResponse;
        if (scheduleInfo.subType==="reminder") {
            response=await this.createReminder(scheduleInfo);
        } else if (scheduleInfo.subType==="task") {
            response=await this.createTask(scheduleInfo);
        } else {
            response=await this.createEvent(scheduleInfo);
        }

        return response.message;
    }

    private async createTask(TaskInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
        const task={
            title: TaskInfo.title,
            due: new Date(`${TaskInfo.dueDate} ${TaskInfo.time}:00`).toISOString(),
        };

        try {
            await this.tasks.tasks.insert({
                auth: this.auth,
                tasklist: 'primary',
                requestBody: task,
            });

            return { success: true, message: TaskInfo.message }
        }
        catch (error) {
            console.log("Error creating task", error);
            return { success: false, message: `Error creating task` };
        }
    }

    private async createReminder(ReminderInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
        const reminder={
            summary: ReminderInfo.title,
            start: {
                dateTime: new Date(`${ReminderInfo.dueDate} ${ReminderInfo.time}:00`).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: new Date(`${ReminderInfo.dueDate} ${ReminderInfo.time}:00`).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            reminder: {
                useDefault: false,
                overrides: [
                    {
                        method: 'popup',
                        minutes: 2,
                    },
                ],
            }
        };

        try {
            await this.calendar.events.insert({
                auth: this.auth,
                calendarId: 'primary',
                sendUpdates: 'all',
                requestBody: reminder,
            });

            return { success: true, message: ReminderInfo.message };
        } catch (error) {
            console.log("Error Creating Reminder", error);
            return { success: false, message: "Error Creating Reminder" };
        }
    }

    private async createEvent(EventInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
        const event={
            summary: EventInfo.title,
            start: {
                dateTime: new Date(`${EventInfo.dueDate} ${EventInfo.time}:00`).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: new Date(`${EventInfo.dueDate} ${EventInfo.time}:00`).toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            reminders: {
                useDefault: true,
            },
        };

        try {
            await this.calendar.events.insert({
                auth: this.auth,
                calendarId: 'primary',
                requestBody: event,
            });

            return { success: true, message: EventInfo.message };
        } catch (error) {
            console.log("Error Creating Reminder", error);
            return { success: false, message: "Error Creating Event" };
        }
    }
}

export default ScheduleManager;