import * as yup from 'yup';

export const ScheduleSchema = yup.object({
  type: yup.string().required(),
  message: yup.string().optional(),
});

export const MeetingAttendeeSchema = yup.object({
  displayName: yup.string().default(""),
  email: yup.string().email().required(),
});

export const scheduleAddSchema = yup.object({
  type: yup.string().required(),
  subType: yup.string().required(),
  dueDate: yup.string().required(),
  isMeeting: yup.boolean().default(false),
  time: yup.string().optional(),
  title: yup.string().optional(),
  attendees: yup.array(MeetingAttendeeSchema).required().default([]),
  message: yup.string().optional(),
});

export const scheduleViewSchema = yup.object({
  type: yup.string().required(),
  tasksOnly: yup.boolean().default(false),
  eventsOnly: yup.boolean().default(false),
  all: yup.boolean().default(true),
  date: yup.string().required(),
  message: yup.string().optional(),
})

export const messageObjectSchema = yup.object({
  phone: yup.string().required(),
  body: yup.string().required(),
  name: yup.string().optional(),
});

export const messageReqSchema = yup.object({
  owner: yup.string().required(),
  messageObj: messageObjectSchema,
});

/*
Schedule View
{
  "type": "schedule#view",
  "tasksOnly": false,
  "eventsOnly": false,
  "all": true,
  "date": "dd/mm/yyyy",
  "message": "Your upcoming tasks and events"
}

Schedule Add
{
  "type": "schedule#add",
  "subType": "event|task|reminder",
  "dueDate": "dd/mm/yyyy",
  "time": "HH:MM",
  "isMeeting": true,
  "title": "Title collected from user",
  "attendees": [{"displayName": "name of the attendee", "email": "email of attendee"}],
  "message": "Your message to the user."
}
*/