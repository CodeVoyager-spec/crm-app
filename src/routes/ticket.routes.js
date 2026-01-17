const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const ticketController = require("../controllers/ticket.controller");

const {
  createTicketSchema,
  updateTicketSchema,
} = require("../src/validators/ticket.validator");

/**
 * Protect all ticket & comment routes
 * User must be authenticated
 */
router.use(authenticate);

/**
 * /tickets
 * - GET  : Fetch tickets based on user role
 *         (Admin → all, Engineer → assigned/created, Customer → own)
 * - POST : Create a new ticket (auto-assign engineer if available)
 */
router
  .route("/tickets")
  .get(ticketController.getAllTickets)
  .post(validate(createTicketSchema), ticketController.createTicket);

/**
 * /tickets/:ticketId
 * - GET   : Fetch a single ticket
 * - PATCH : Update a ticket
 *           (Admin / Assigned Engineer / Reporter)
 */
router
  .route("/tickets/:ticketId")
  .get(ticketController.getSingleTicket)
  .patch(validate(updateTicketSchema), ticketController.updateTicket);

module.exports = router;
