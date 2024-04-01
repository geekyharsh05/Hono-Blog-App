import { Hono } from "hono";
import {
  forgotPassHandler,
  signInHandler,
  signUpHandler,
  verifyOtp,
} from "../controllers";
import { Bindings } from "hono/types";

export const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.post("/signin", ...signInHandler);
userRouter.post("/signup", ...signUpHandler);
userRouter.post("/forgot/", ...forgotPassHandler);
userRouter.post("/verify/", ...verifyOtp);
