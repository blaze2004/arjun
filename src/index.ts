import * as WAWebJS from 'whatsapp-web.js';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
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

client.on('disconnected', (reason: WAWebJS.WAState) => {
  client.destroy();
  console.log('Client was logged out', reason);
});

client.on('message', (msg: WAWebJS.Message) => {
  if (msg.body === '!ping') {
    msg.reply('pong');
  } else {
    console.log(msg.body);
  }
});

client.initialize();
