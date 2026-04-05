import { PartialUser } from "./user";

declare global {
  namespace Express {
    interface Request {
      user: PartialUser;
    }
  }
}