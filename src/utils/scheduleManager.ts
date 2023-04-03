import { calendar_v3, google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { AddToScheduleResponse, ScheduleElement, ScheduleAddInfo, ScheduleViewInfo } from "../types";
import { convertDateTimeToISO, getTodayDate } from "./messageBuilder";
import replies from "../constants/replies";
import { randomUUID } from "crypto";

class ScheduleManager {
  private readonly calendar = google.calendar("v3");
  private readonly tasks = google.tasks("v1");
  private readonly auth: OAuth2Client;

  constructor(auth: OAuth2Client) {
    this.auth = auth;
  }

  public async createCalendarEntry(scheduleInfo: ScheduleAddInfo): Promise<string> {
    let response: AddToScheduleResponse;
    if (scheduleInfo.subType === "task") {
      response = await this.createTask(scheduleInfo);
    } else {
      response = await this.createEvent(scheduleInfo);
    }

    return response.message;
  }

  public async getSchedule({ date = getTodayDate(), eventsOnly = false, tasksOnly = false }: ScheduleViewInfo): Promise<ScheduleElement[]> {

    let userSchedule: ScheduleElement[] = [];
    let calendarList: string[] = [];

    if (!tasksOnly) {
      calendarList = await this.getCalendars();
    }

    if (eventsOnly) {
      for (let i = 0; i < calendarList.length; i++) {
        userSchedule = userSchedule.concat(await this.getEvents(date, calendarList[i]));
      }
    } else if (tasksOnly) {
      userSchedule = userSchedule.concat(await this.getTasks(date));
    } else {
      for (let i = 0; i < calendarList.length; i++) {
        userSchedule = userSchedule.concat(await this.getEvents(date, calendarList[i]));
      }
      userSchedule = userSchedule.concat(await this.getTasks(date));
    }
    return userSchedule;
  }

  private async getCalendars(): Promise<string[]> {
    const calendars = await this.calendar.calendarList.list({
      auth: this.auth,
      maxResults: 20,
    });

    const calendarList: string[] = [];

    if (calendars.data.items) {
      calendars.data.items.forEach((calendar) => {
        if (calendar.id) {
          calendarList.push(calendar.id);
        }
      })
    }

    return calendarList;
  }

  private async getEvents(date: string, calendarId: string): Promise<ScheduleElement[]> {
    const minTime = convertDateTimeToISO(date).slice(0, 10) + "T00:00:00.000Z";
    const maxTime = new Date((new Date(minTime)).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T00:00:00.000Z";

    const events = await this.calendar.events.list({
      auth: this.auth,
      calendarId: calendarId,
      timeMin: minTime,
      timeMax: maxTime,
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const eventsList: ScheduleElement[] = [];

    if (events.data.items) {
      events.data.items.forEach((event) => {
        if (event.summary && event.start && (event.start.date || event.start.dateTime)) {
          let start: Date;
          const dateOptions: Intl.DateTimeFormatOptions = { dateStyle: 'short' };
          const timeOptions: Intl.DateTimeFormatOptions = { timeStyle: 'short' };

          if (event.start.date) {
            start = new Date(event.start.date);
          } else if (event.start.dateTime && event.start.timeZone) {
            start = new Date(event.start.dateTime);
            dateOptions.timeZone = event.start.timeZone;
            timeOptions.timeZone = event.start.timeZone;
          } else {
            return;
          }
          eventsList.push({
            title: event.summary,
            dueDate: start.toLocaleString('en-US', dateOptions),
            dueTime: start.toLocaleString('en-US', timeOptions),
            type: 'event'
          })
        }
      });
    }

    return eventsList;
  }

  private async getTasks(date: string): Promise<ScheduleElement[]> {
    const minTime = convertDateTimeToISO(date).slice(0, 10) + "T00:00:00.000Z";
    const maxTime = new Date((new Date(minTime)).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T00:00:00.000Z";

    const tasks = await this.tasks.tasks.list({
      auth: this.auth,
      tasklist: '@default',
      dueMin: minTime,
      dueMax: maxTime,
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
            dueTime: '',
            type: 'task'
          });
        }
      });
    }

    return taskList;
  }

  private async createTask(TaskInfo: ScheduleAddInfo): Promise<AddToScheduleResponse> {
    const task = {
      title: TaskInfo.title,
      due: convertDateTimeToISO(TaskInfo.dueDate, TaskInfo.time),
      notes: replies.calendarDescription as string,
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

  // Google doesn't support creation of reminders through api currently

  private async createEvent(EventInfo: ScheduleAddInfo): Promise<AddToScheduleResponse> {
    const eventStartTime = new Date((new Date(convertDateTimeToISO(EventInfo.dueDate, EventInfo.time))).getTime() - 5.5 * 60 * 60 * 1000).toISOString();
    const eventEndTime = new Date((new Date(eventStartTime)).getTime() + 60 * 60 * 1000);

    const event: calendar_v3.Schema$Event = {
      summary: EventInfo.title,
      description: replies.calendarDescription as string,
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
      attendees: EventInfo.attendees
    };

    if (EventInfo.isMeeting) {
      event.conferenceData = {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          },
        }
      }
    }

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