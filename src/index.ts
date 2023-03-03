import express, { Request, Response } from 'express';
import session from 'express-session';
import getMessage from './actions/conversation/getMessage';
import { sessionConfig, sessionMiddleware } from './utils/sessionManager';
import environmentVariables from './utils/config';
import bodyParser from 'body-parser';
import checkApiKey from './utils/apiKey';

const app = express();

app.use(bodyParser.json());

// Session Middleware
app.use(session(sessionConfig));
app.use(sessionMiddleware);

// API Check Middleware
app.use(checkApiKey)

app.get("/api/v1", (_req: Request, res: Response) => {
  return res.send("Arjun v1.0.0");
});

app.post("/api/v1/chat", getMessage);

// Start the server
app.listen(environmentVariables.port, () => console.log("Server is up and running!"));