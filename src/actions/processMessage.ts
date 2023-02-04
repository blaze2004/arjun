import { Message } from 'whatsapp-web.js';

export const processMessage = (msg: Message) => {
  // Implement Watson connection here
  // Remove below code, it's just a sample
  if (msg.body === '!ping') {
    msg.reply('pong');
  } else {
    msg.reply(
      "Hey, I am taskmaster, a WhatsApp Bot.\n I can't understand human language, so please try to be precise."
    );
  }
};
