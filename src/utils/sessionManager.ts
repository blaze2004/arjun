import { Response, NextFunction, Request } from "express";
import session, { SessionData, SessionOptions } from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import { User } from "../types";
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
        secure: environmentVariables.nodeEnv === "production",
    }
};

export const sessionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req && req.body) {
        if (
            req.body.owner &&
            req.body.messageObj
        ) {
            const customerPhoneNumber: string = req.body.messageObj.phone;

            const session = await new Promise((resolve, reject) => {
                req.sessionStore.get(customerPhoneNumber, (error, session) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(session);
                    }
                });
            });

            if (session) {
                req.session.user = (session as SessionData).user;
                req.session.cookie = (session as SessionData).cookie;
            }
        }
    }
    req.user = req.session.user!;
    req.saveUserSession = saveUserSession(req);
    next();
};