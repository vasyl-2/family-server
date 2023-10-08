/// <reference types="express" />

declare namespace Express {
  interface Request {
    headers:  {
      Authorization: string | undefined;
      BBB: string | undefined;
    };
    BBB: string | undefined;
  }
}
