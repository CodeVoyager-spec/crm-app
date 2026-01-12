const mongoose = require("mongoose");

/**
 * Comment Schema
 * - Linked to a ticket
 * - Created by a user
 */
const commentSchema = new mongoose.Schema(
  {
    // Comment text
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Related ticket
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    // Comment author
    author: {
      type: String, // userId
      required: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Comment", commentSchema);
