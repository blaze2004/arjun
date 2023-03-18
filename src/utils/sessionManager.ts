import { Request } from "express";
import session, { SessionOptions } from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import { randomUUID } from "crypto";
import environmentVariables from "./config";

export const pgPool = new Pool({
    connectionString: environmentVariables.databaseUrl,
});

const pgSessionStore = pgSession(session);
export const sessionStore = new pgSessionStore({
    pool: pgPool,
    tableName: "user_sessions",
});

const genId = (req: Request) => {

    if (req && req.body) {
        if (
            req.body.owner &&
            req.body.messageObj
        ) {
            const customerPhoneNumber: string = req.body.messageObj.phone;
            return customerPhoneNumber;
        }
    }

    return randomUUID();
}

export const sessionConfig: SessionOptions = {
    name: "SESS_ID",
    secret: environmentVariables.sessionSecret,
    resave: false,
    genid: genId,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 100*365*24*60*60*1000,
        secure: environmentVariables.nodeEnv === "production",
    }
};

