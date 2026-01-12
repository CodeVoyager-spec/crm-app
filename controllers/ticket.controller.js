const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { USER_ROLE } = require("../constants/user.constants");

/**
 * Create a ticket and auto-assign an engineer if available
 */
exports.createTicket = catchAsync(async (req, res) => {
  // Find any approved engineer
  const engineer = await User.findOne({
    role: USER_ROLE.ENGINEER,
    status: USER_STATUS.APPROVED,
  }).select("userId");

  // Create ticket
  const ticket = await Ticket.create({
    ...req.body, // title, description, priority, status
    reporter: req.user.userId, // ticket creator
    assignee: engineer?.userId || null,
  });

  res.status(201).json({
    message: engineer
      ? "Ticket created and assigned to engineer"
      : "Ticket created but not assigned",
    data: ticket,
  });
});

/**
 * Update ticket
 * - Admin: any ticket
 * - Engineer: assigned ticket
 * - Customer: own ticket
 */
exports.updateTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { role, userId } = req.user;

  // Always match ticket by ID
  const query = { _id: ticketId };

  // Non-admins can update only their related tickets
  if (role !== USER_ROLE.ADMIN) {
    query.$or = [{ reporter: userId }, { assignee: userId }];
  }

  // Update ticket
  const ticket = await Ticket.findOneAndUpdate(query, req.body, {
    new: true,
    runValidators: true,
  });

  // Not found or not authorized
  if (!ticket) {
    throw new AppError("Not authorized or ticket not found", 403);
  }

  res.status(200).json({
    message: "Ticket updated successfully",
    data: ticket,
  });
});

/**
 * Get tickets based on user role
 * - CUSTOMER: tickets created by the user
 * - ENGINEER: tickets created by or assigned to the user
 * - ADMIN: all tickets
 */
exports.getAllTickets = catchAsync(async (req, res) => {
  const { role, userId } = req.user;
  const query = {};

  if (role === USER_ROLE.CUSTOMER) {
    // Customer can see only their own tickets
    query.reporter = userId;
  }

  if (role === USER_ROLE.ENGINEER) {
    // Engineer can see assigned tickets and tickets created by them
    query.$or = [{ assignee: userId }, { reporter: userId }];
  }
  // Admin has no filter → gets all tickets

  const tickets = await Ticket.find(query);

  res.status(200).json({
    count: tickets.length,
    data: tickets,
  });
});

/**
 * Get a single ticket
 * - Admin: any ticket
 * - Engineer: assigned ticket
 * - Customer: own ticket
 */
exports.getSingleTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { role, userId } = req.user;

  // Base query: match ticket by ID
  const query = { _id: ticketId };

  // Restrict access for non-admin users
  if (role !== USER_ROLE.ADMIN) {
    query.$or = [{ reporter: userId }, { assignee: userId }];
  }

  // Find ticket
  const ticket = await Ticket.findOne(query);

  // Not found or not authorized
  if (!ticket) {
    throw new AppError("Ticket not found or not authorized", 404);
  }

  res.status(200).json({
    data: ticket,
  });
});
