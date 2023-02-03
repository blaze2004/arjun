import express from "express";

const app=express();
const port=8000||process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hi!");
});

app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});

/*
const { Client } = require('whatsapp-web');
const qrcode = require('qrcode-terminal');

const client = new Client(
    {
        puppeteer: {
            args: ['--no-sandbox'],
        }
    }
);

client.on('qr', (qr: any) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('message', (msg: any) => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
*/