import express from 'express';
import session from 'express-session';
import { sessionConfig } from './utils/sessionManager';
import environmentVariables from './utils/config';
import checkApiKey from './utils/apiKey';
import router from './routes';
import { sessionMiddleware } from './middleware/sessions';
import validate from './validator/validateResources';
import { messageReqSchema } from './schema/user.schema';
const app = express();

app.use(express.json());

app.use(validate(messageReqSchema));

// Session Middleware
app.use(session(sessionConfig));
app.use(sessionMiddleware);

// API Check Middleware
app.use(checkApiKey);

// Using router
app.use(router);

// Start the server
app.listen(environmentVariables.port, () =>
  console.log('Server is up and running!')
);
