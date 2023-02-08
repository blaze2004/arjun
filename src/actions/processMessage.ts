import AssistantV2 from 'ibm-watson/assistant/v2';
import { IamAuthenticator } from 'ibm-watson/auth';
// import { assistant } from '../index';
import { TMessage, WatsonSuggestionReply, WatsonTextReply } from '../types';
import dotenv from 'dotenv';

dotenv.config();

let session_id: string;

export const assistant: AssistantV2 = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY
  }),
  serviceUrl: process.env.WATSON_SERVICE_URL
});

const watsonSession = assistant.createSession({
  assistantId: process.env.WATSON_ASSISTANT_ID
})
  .then(res => session_id = res.result.session_id)
  .catch(error => console.log(error));

export const processMessage = async (msg: TMessage) => {
  // Implement Watson connection here
  // Remove below code, it's just a sample
  if (msg.body != '') {
    const res = await assistant.message({
      assistantId: process.env.WATSON_ASSISTANT_ID,
      sessionId: session_id,
      input: {
        message_type: 'text',
        'text': msg.body
      }
    });

    console.log(res);

    if (typeof res.result.output.generic[0] === 'object') {
      console.log(res.result.output.generic[0]);
      const response = res.result.output.generic[0] as WatsonTextReply;
      msg.reply(response.text);
    } else {
      msg.reply("I don't understand!");
    }

  } else {
    msg.reply(
      "Hey, I am taskmaster, a WhatsApp Bot.\n I can't understand human language, so please try to be precise."
    );
  }
};
