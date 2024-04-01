import { Hono } from "hono";
import { Bindings, Variables } from "hono/types";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
} from "../controllers/index";
import { userMiddleware } from "../middlewares/user.middleware";

export const blogRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

blogRouter.use("/*", userMiddleware);

blogRouter.post("/createpost", ...createPostHandler);
blogRouter.put("/updatepost", ...updatePostHandler);
blogRouter.get("/bulk", ...getAllPostsHandler);
blogRouter.get("/:id", ...getPostByIdHandler);
