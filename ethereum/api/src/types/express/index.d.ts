import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
    interface SessionData {
      cookie: any;
    }
  }
}
