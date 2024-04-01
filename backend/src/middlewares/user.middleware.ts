import { createFactory } from "hono/factory";
import { verify } from "hono/jwt";

const factory = createFactory();

export const userMiddleware = factory.createMiddleware(async (c, next) => {
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      return await next();
    }

    c.status(403);
    return c.json({
      error: "You are not logged in",
    });
  } catch (error) {
    c.status(403);
    return c.json({ error: "You are not logged in" });
  }
});
