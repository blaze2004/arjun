import express, { Request, Response } from 'express';
import session from 'express-session';
import { WAState, Events, Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import getMessage from './actions/conversation/getMessage';
import { sessionConfig, sessionMiddleware } from './utils/sessionManager';
import environmentVariables from './utils/config';
import { WaBotMessage } from './types';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
// Session Middleware
app.use(session(sessionConfig));
app.use(sessionMiddleware);

app.listen(environmentVariables.port, () => console.log("Server is up adnd running!"));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Arjun v1.0.0");
});

app.post("/messages", getMessage);

// WhatsApp Web Js Configuration
export const client: Client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth({
    dataPath: `${__dirname}/session`,
  }),
});

client.on(Events.QR_RECEIVED, (qr: string) => {
  qrcode.generate(qr, { small: true });
  console.log('QR code recieved.', qr);
});

client.on(Events.READY, () => {
  console.log('Client is ready.');
});

client.on(Events.DISCONNECTED, (reason: WAState) => {
  client.destroy();
  console.log('Client was logged out', reason);
});

client.on(Events.MESSAGE_RECEIVED, async (message: WaBotMessage) => {

  const messageData = {
    name: message._data?.notifyName,
    phone: message.from,
    message: message
  };

  try {
    const response = await axios.post(`${environmentVariables.deploymentUrl}/messages`, {
      object: "whatsapp_backend",
      messageObj: messageData
    });
  } catch (error) {
    console.log("Error forwarding message. \nError: ", error);
  }
  return;

});

client.initialize();
