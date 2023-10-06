/// <reference types="express" />

declare namespace Express {
  interface Request {
    customHeader?: {
      authorization: string | undefined;
    }
  }
}
