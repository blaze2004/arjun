import express from 'express';
import session from 'express-session';
import { WAState, Events, Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import getMessage from './actions/conversation/getMessage';
import { sessionConfig } from './utils/sessionManager';
import environmentVariables from './utils/config';

const app = express();

// Session Middleware
app.use(session(sessionConfig));

app.listen(environmentVariables.port, () => console.log("Server is up adnd running!"));


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

client.on(Events.MESSAGE_RECEIVED, getMessage);

client.initialize();
