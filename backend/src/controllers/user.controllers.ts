import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { createFactory } from "hono/factory";
import { genOtp } from "../utils";
import { resendService } from "../services/resend.service";
import { signInInput, signUpInput } from "@geekyharsh/blog-common";

const factory = createFactory();

export const verifyOtp = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { otp, email } = await c.req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user?.otp) return c.json({ error: "Invalid" });

    if (user.otp === otp) {
      await prisma.user.update({ where: { email }, data: { otp: 0 } });
      return c.json({ password: user.password });
    }

    return c.json({ error: "Invalid" });
  } catch (error) {
    c.status(403);
    return c.json({ error: "error occured while signing up" });
  }
});

export const signUpHandler = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  // zod validation
  const { success } = signUpInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error) {
    c.status(403);
    return c.json({ error: "error occured while signing up" });
  }
});

export const signInHandler = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  // zod validation
  const { success } = signInInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        error:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (error) {
    c.status(411);
    return c.text("Invalid");
  }
});

export const forgotPassHandler = factory.createHandlers(async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const apiKey = c.env.RESEND_API_KEY;

  // Use zod
  const body = await c.req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({
        error:
          "Invalid email or password. Please check your credentials and try again.",
      });
    }

    const otp = genOtp();

    // TODO: Send email with otp
    await resendService({
      RESEND_API_KEY: apiKey,
      textToSend: `Your OTP For Password Reset is ${otp}`,
      email: user.email,
    });

    await prisma.user.update({
      data: {
        otp: otp,
      },
      where: {
        email: body.email,
      },
    });

    // Trigger something to send a email

    return c.json({
      message: "email was sent to associated email address",
    });
  } catch (error) {
    c.status(411);
    return c.text("Invalid");
  }
});
