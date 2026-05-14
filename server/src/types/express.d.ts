import exp from "constants";

//Extende Express Request objekt um authenticated user information zu includen
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

export {};
