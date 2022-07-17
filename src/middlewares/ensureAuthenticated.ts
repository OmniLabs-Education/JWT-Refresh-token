import { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";
import auth from "../config/auth";

export const ensuredAuthenticated = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const authHeaders = request.headers.authorization;

    if (!authHeaders) {
      return response.status(401).json({ error: "Token is missing" });
    }

    const [, token] = authHeaders.split(" ");

    try {
      verify(token, auth.secret_token);

      const { sub: user_id } = decode(token);

      request.user = {
        id: user_id.toString(),
      };

      next();
    } catch (err) {
      console.log(err)
      return response.status(401).end();
    }
  };
};
