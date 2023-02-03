import { Client, Message } from 'whatsapp-web.js';
import QRCode from "qrcode-terminal";

const client: Client=new Client({});

client.on('qr', (qr: string) => {
    QRCode.generate(qr, { small: true });
    console.log('QR code recieved.', qr);
});

client.on('ready', () => {
    console.log("Client is ready.");
});

client.on('disconnected', (reason) => {
    client.destroy();
    console.log('Client was logged out', reason);
});

client.on('message', (msg: Message) => {
    if (msg.body==='!ping') {
        msg.reply('pong');
    } else {
        console.log(msg.body);
    }
});

client.initialize();