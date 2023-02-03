import { Message } from "whatsapp-web.js";

export default function ProcessMessage(msg: Message) {

    // Implement Watson connection here
    // Remove below code, it's just a sample

    if (msg.body==="!ping") {
        msg.reply("pong");
    } else {
        msg.reply("Hey, I am taskmaster a whatsapp bot.\n I can't understand humans random language, so please try to be precise.");
    }

}