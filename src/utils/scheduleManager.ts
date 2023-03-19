import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { AddToScheduleResponse, ScheduleElement, ScheduleInfo } from "../types";
import { convertDateTimeToISO } from "./messageBuilder";

class ScheduleManager {
  private readonly calendar = google.calendar("v3");
  private readonly tasks = google.tasks("v1");
  private readonly auth: OAuth2Client;

  constructor(auth: OAuth2Client) {
    this.auth = auth;
  }

  public async createCalendarEntry(scheduleInfo: ScheduleInfo): Promise<string> {
    let response: AddToScheduleResponse;
    if (scheduleInfo.subType === "event") {
      response = await this.createEvent(scheduleInfo);
    } else if (scheduleInfo.subType === "task") {
      response = await this.createTask(scheduleInfo);
    } else {
      response = await this.createTask(scheduleInfo);
    }

    return response.message;
  }

  public async getSchedule({ eventsOnly = false, tasksOnly = false }): Promise<ScheduleElement[]> {

    let userSchedule: ScheduleElement[] = [];

    if (eventsOnly) {
      userSchedule = userSchedule.concat(await this.getEvents());
    } else if (tasksOnly) {
      userSchedule = userSchedule.concat(await this.getTasks());
    } else {
      userSchedule = userSchedule.concat(await this.getEvents());
      userSchedule = userSchedule.concat(await this.getTasks());
    }

    return userSchedule;
  }

  private async getEvents(): Promise<ScheduleElement[]> {
    const events = await this.calendar.events.list({
      auth: this.auth,
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      timeMax: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const eventsList: ScheduleElement[] = [];

    if (events.data.items) {
      events.data.items.forEach((event) => {
        if (event.summary && event.start && event.start.date) {
          const start = new Date(event.start.date);
          eventsList.push({
            title: event.summary,
            dueDate: start.toLocaleString('en-US', { dateStyle: 'short' }),
            dueTime: start.toLocaleString('en-US', { timeStyle: 'short' }),
            type: 'event'
          })
        }
      });
    }

    return eventsList;
  }

  private async getTasks(): Promise<ScheduleElement[]> {
    const tasks = await this.tasks.tasks.list({
      auth: this.auth,
      tasklist: '@default',
      dueMin: new Date().toISOString(),
      dueMax: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
      showCompleted: false,
    });

    const taskList: ScheduleElement[] = [];

    if (tasks.data.items) {
      tasks.data.items.forEach((task) => {
        if (task.title && task.due) {
          const due = new Date(task.due);
          taskList.push({
            title: task.title,
            dueDate: due.toLocaleString('en-US', { dateStyle: 'short' }),
            dueTime: due.toLocaleString('en-US', { timeStyle: 'short' }),
            type: 'task'
          });
        }
      });
    }

    return taskList;
  }

  private async createTask(TaskInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
    const task = {
      title: TaskInfo.title,
      due: convertDateTimeToISO(TaskInfo.dueDate, TaskInfo.time),
    };

    try {
      await this.tasks.tasks.insert({
        auth: this.auth,
        tasklist: '@default',
        requestBody: task,
      });

      return { success: true, message: TaskInfo.message }
    }
    catch (error) {
      console.log("Error creating task", error);
      return { success: false, message: `Error creating task` };
    }
  }

  // Google doesn't support creation of reminders currently
  // private async createReminder(ReminderInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
  // TODO: Implement Reminder Creation
  // }

  private async createEvent(EventInfo: ScheduleInfo): Promise<AddToScheduleResponse> {
    const eventStartTime = new Date((new Date(convertDateTimeToISO(EventInfo.dueDate, EventInfo.time))).getTime() - 5.5 * 60 * 60 * 1000).toISOString();
    const eventEndTime = new Date((new Date(eventStartTime)).getTime() + 60 * 60 * 1000);

    const event = {
      summary: EventInfo.title,
      start: {
        dateTime: eventStartTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: eventEndTime.toISOString(),
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
      console.log("Error Creating Event", error);
      return { success: false, message: "Error Creating Event" };
    }
  }
}

export default ScheduleManager;