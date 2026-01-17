const Comment = require("../models/comment.model");
const catchAsync = require("../utils/catchAsync")

/**
 * Create a comment on a ticket
 * - Admin: any ticket
 * - Engineer: assigned or created ticket
 * - Customer: own ticket
 */
exports.createComment = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { role, userId } = req.user;

  // Check ticket access
  const query = { _id: ticketId };
  if (role !== USER_ROLE.ADMIN) {
    query.$or = [{ reporter: userId }, { assignee: userId }];
  }

  const ticket = await Ticket.findOne(query);
  if (!ticket) {
    throw new AppError("Ticket not found or not authorized", 403);
  }

  // Create comment
  const comment = await Comment.create({
    content: req.body.content,
    ticket: ticketId,
    author: userId,
  });

  res.status(201).json({
    message: "Comment added successfully",
    data: comment,
  });
});

/**
 * Get all comments of a ticket
 * - Admin: any ticket
 * - Engineer: assigned or created ticket
 * - Customer: own ticket
 */
exports.getCommentsByTicket = catchAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { role, userId } = req.user;

  // Check ticket access
  const ticketQuery = { _id: ticketId };
  if (role !== USER_ROLE.ADMIN) {
    ticketQuery.$or = [{ reporter: userId }, { assignee: userId }];
  }

  const ticket = await Ticket.findOne(ticketQuery);
  if (!ticket) {
    throw new AppError("Ticket not found or not authorized", 403);
  }

  // Fetch comments for the ticket
  const comments = await Comment.find({ ticket: ticketId }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    count: comments.length,
    data: comments,
  });
});

/**
 * Update a comment
 * - Access: Admin / Comment Author
 */
exports.updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { role, userId } = req.user;

  const query = { _id: commentId };
  if (role !== USER_ROLE.ADMIN) {
    query.author = userId; // only author can update
  }

  const comment = await Comment.findOneAndUpdate(query, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) throw new AppError("Comment not found or not authorized", 403);

  res.status(200).json({
    message: "Comment updated successfully",
    data: comment,
  });
});

/**
 * Delete a comment
 * - Access: Admin / Comment Author
 */
exports.deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { role, userId } = req.user;

  const query = { _id: commentId };
  if (role !== USER_ROLE.ADMIN) {
    query.author = userId; // only author can delete
  }

  const comment = await Comment.findOneAndDelete(query);
  if (!comment) throw new AppError("Comment not found or not authorized", 403);

  res.status(200).json({
    message: "Comment deleted successfully",
  });
});
