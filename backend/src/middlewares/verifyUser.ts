import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/tokenHandler";

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).end();

  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
}