import { z } from "zod";

export const signUpInput = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast of 6 characters").max(30),
  name: z.string().optional(),
});

// type inference better for exporting it as types.
export type signUpInput = z.infer<typeof signUpInput>;

export const signInInput = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast of 6 characters"),
});

export type signInInput = z.infer<typeof signInInput>;

export const createBlogInput = z.object({
  title: z.string().min(1, "Title cannot be empty").max(10),
  content: z.string().min(1, "Content cannot be empty").max(2000),
});

export type createBlogInput = z.infer<typeof createBlogInput>;

export const updateBlogInput = z.object({
  id: z.number().min(1, "Invalid ID, Please enter a valid ID!"),
  title: z.string().min(1, "Title cannot be empty").max(10),
  content: z.string().min(1, "Content cannot be empty").max(2000),
});

export type updateBlogInput = z.infer<typeof updateBlogInput>;
