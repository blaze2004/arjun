import { NextFunction, Request, Response } from 'express';
import { AnyObject } from 'yup';
import { ChatGPTScheduleInfo, ScheduleAddInfo, ScheduleViewInfo } from '../types';
import { scheduleAddSchema, scheduleViewSchema } from '../schema/schedule.schema';

export const validate =
  (schema: AnyObject) => (req: Request, res: Response, next: NextFunction) => {
    schema
      .validate(req.body)
      .then(() => {
        next();
      })
      .catch((err: any) => {
        return res.status(400).json({ error: err.message });
      });
  };

export const validateSchedule = (schedule: ChatGPTScheduleInfo): boolean => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  if (schedule.type === "schedule#add") {
    const isDateValid = dateRegex.test((schedule as ScheduleAddInfo).dueDate);
    const isTimeValid = timeRegex.test((schedule as ScheduleAddInfo).time);

    if (isDateValid && isTimeValid && validateData(scheduleAddSchema, schedule)) {
      return true;
    }
    return false;
  } else {
    const isDateValid = dateRegex.test((schedule as ScheduleViewInfo).date);

    if (isDateValid && validateData(scheduleViewSchema, schedule)) {
      return true;
    }
    return false;
  }
};

export const validateData = (schema: AnyObject, data: AnyObject): boolean => {
  return schema
    .validate(data)
    .then(() => true)
    .catch((err: any) => {
      console.log("Error validating data", err);
      return false;
    });
}
export default validate;
