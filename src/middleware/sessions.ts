import { Request, Response, NextFunction } from 'express';
import { SessionData } from 'express-session';
import { User } from '../types';

export const saveUserSession = (req: Request) => (user: User) => {
  req.session.user = user;
  return new Promise((resolve: (value: User) => void, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
};

export const sessionMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
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
  req.user = req.session.user as User;
  req.saveUserSession = saveUserSession(req);
  next();
};
