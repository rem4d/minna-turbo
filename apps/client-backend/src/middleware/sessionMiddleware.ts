import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

import redis from "../redisClient";

export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

export async function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let sessionId = req.cookies.sessionId;

  async function createUser() {
    sessionId = generateSessionId();

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify({ createdAt: Date.now(), level: 3, shift: 20 }),
      { EX: 60 * 60 * 24 * 7 }, // 7 days
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
  }

  if (sessionId) {
    const data = await redis.get(`session:${sessionId}`);

    if (!data) {
      await createUser();
    }
  } else {
    await createUser();
  }

  req.sessionId = sessionId;
  next();
}
