import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/tokenHandler";
import { Constants } from "../lib/constants";

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[Constants.ACCESS_TOKEN];
  if (!token) return res.status(401).end();

  const user = verifyAccessToken(token);
  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
}