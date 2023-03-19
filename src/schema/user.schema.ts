import * as yup from 'yup';

const messageObjectSchema = yup.object({
  phone: yup.string().required(),
  body: yup.string().required(),
  name: yup.string().optional(),
});

export const messageReqSchema = yup.object({
  owner: yup.string().required(),
  messageObj: messageObjectSchema,
});
