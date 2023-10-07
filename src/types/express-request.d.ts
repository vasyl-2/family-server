/// <reference types="express" />

declare namespace Express {
  interface Request {
    headers:  {
      authorization: string | undefined;
    };
    // authorization: string | undefined;
  }
}
