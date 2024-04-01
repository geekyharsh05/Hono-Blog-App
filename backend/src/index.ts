import { Hono } from "hono";
import { Bindings } from "hono/types";
import { blogRouter, userRouter } from "./routes";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app;
