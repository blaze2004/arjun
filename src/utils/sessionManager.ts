import { Response, NextFunction, Request } from "express";
import session, { SessionData, SessionOptions } from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import { User } from "../types";
import { randomUUID } from "crypto";
import environmentVariables from "./config";

const pgPool = new Pool({
    connectionString: environmentVariables.databaseUrl,
});

const pgSessionStore = pgSession(session);
export const sessionStore = new pgSessionStore({
    pool: pgPool,
    tableName: "wa_bot_user_sessions",
});

export const saveUserSession = (req: Request) => (user: User) => {
    req.session.user = user;
    return new Promise((resolve: (value: User) => void, reject) => {
        req.session.save(err => {
            if (err) reject(err);
            else resolve(user);
        });
    })
};

const genId = (req: Request) => {

    // check if user number is available return that

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
        secure: environmentVariables.nodeEnv === "production",
    }
};