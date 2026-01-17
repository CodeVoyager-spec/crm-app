const { z } = require("zod");
const { TICKET_STATUS } = require("../constants/ticket.constants");

/**
 * Create Ticket Schema
 */
const createTicketSchema = z.object({
  body: z
    .object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      ticketPriority: z
        .number()
        .int("Priority must be an integer")
        .min(1, "Priority must be between 1 and 5")
        .max(5, "Priority must be between 1 and 5")
        .optional(), // default handled by DB
      status: z
        .enum(Object.values(TICKET_STATUS), {
          errorMap: () => ({ message: "Invalid ticket status" }),
        })
        .optional(), // default: OPEN
    })
    .strict(),
});

/**
 * Update Ticket Schema (partial update)
 */
const updateTicketSchema = z.object({
  params: z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
  }),
  body: createTicketSchema.shape.body
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "No valid fields to update",
    }),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};
