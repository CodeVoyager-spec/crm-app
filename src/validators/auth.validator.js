const { z } = require("zod");
const { USER_ROLE } = require("../constants/user.constants");

// Signup
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  userId: z.string().min(3, "UserId must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must have one uppercase letter")
    .regex(/[0-9]/, "Password must have one number"),
  role: z.enum(Object.values(USER_ROLE)).optional(),
});

// Signin
const signinSchema = z.object({
  userId: z.string().min(3, "UserId must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = {
  signupSchema,
  signinSchema,
};
