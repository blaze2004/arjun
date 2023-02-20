import { WAState, ClientOptions } from 'whatsapp-web.js';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { processMessage } from './actions/processMessage';
import dotenv from 'dotenv';

dotenv.config();

export const client: Client = new Client({
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  authStrategy: new LocalAuth({
    dataPath: `${__dirname}/session`,
  }),
});

client.on('qr', (qr: string) => {
  qrcode.generate(qr, { small: true });
  console.log('QR code recieved.', qr);
});

client.on('ready', () => {
  console.log('Client is ready.');
});

client.on('disconnected', (reason: WAState) => {
  client.destroy();
  console.log('Client was logged out', reason);
});

client.on('message', processMessage);

client.initialize();
