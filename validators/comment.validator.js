const { z } = require("zod");

/**
 * Create Comment Schema
 */
const createCommentSchema = z.object({
  params: z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
  }),

  body: z.object({
    content: z
      .string()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment is too long"),
  }),
});

module.exports = {
  createCommentSchema,
};
