import { Hono } from "hono";
import { signInHandler, signUpHandler } from "../controllers/user.controllers";
import { Bindings } from "hono/types";

export const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.post("/signin", ...signInHandler);
userRouter.post("/signup", ...signUpHandler);
