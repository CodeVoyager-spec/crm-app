const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const { createCommentSchema } = require("../src/validators/comment.validator");

/**
 * Routes for comments related to a ticket
 * - POST: Create a comment
 * - GET: Get all comments for a ticket
 * Access: Admin / Assigned Engineer / Ticket Reporter
 */
router
  .route("/tickets/:ticketId/comments")
  .post(
    authenticate, // must be logged in
    validate(createCommentSchema),
    commentController.createComment
  )
  .get(authenticate, commentController.getCommentsByTicket);

/**
 * Routes for a specific comment
 * - PUT: Update a comment (Admin / Comment Author)
 * - DELETE: Delete a comment (Admin / Comment Author)
 */
router
  .route("/comments/:commentId")
  .put(authenticate, commentController.updateComment)
  .delete(authenticate, commentController.deleteComment);

module.exports = router;
