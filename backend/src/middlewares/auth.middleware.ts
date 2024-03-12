import { verify } from "hono/jwt";
import { createFactory } from "hono/factory";

const factory = createFactory();

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  const response = await verify(token, c.env.JWT_SECRET);

  if (response.id) {
    return next();
  }
  c.status(403);
  return c.json({ error: "unauthorized access" });
});

