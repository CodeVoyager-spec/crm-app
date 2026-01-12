const { z } = require("zod");
const { USER_ROLE, USER_STATUS } = require("../constants/user.constants");

const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),

  body: z
    .object({
      role: z
        .enum(Object.values(USER_ROLE), {
          errorMap: () => ({ message: "Invalid user role" }),
        })
        .optional(),

      status: z
        .enum(Object.values(USER_STATUS), {
          errorMap: () => ({ message: "Invalid user status" }),
        })
        .optional(),

      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .optional(),

      email: z
        .string()
        .email("Invalid email address")
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "No valid fields to update",
    }),
});

module.exports = {
  updateUserSchema,
};
