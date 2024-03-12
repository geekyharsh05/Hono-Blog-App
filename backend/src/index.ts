import { Hono } from "hono";
import { userRouter } from "./routes/user.routes";
import { Bindings } from "hono/types";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/api/v1/", userRouter);

// app.route('/api/v1/blog')

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("get blog route");
});

app.post("/api/v1/blog", (c) => {
  return c.text("signin route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("signin route");
});

export default app;
