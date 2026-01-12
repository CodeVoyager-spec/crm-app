const mongoose = require("mongoose");
const { TICKET_STATUS } = require("../constants/ticket.constants");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titcketPriority: {
      type: Number,
      required: true,
      default: 4,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: TICKET_STATUS.OPEN,
    },
    reporter: {
      type: String, // We will be use the userId
      required: true,
    },
    assignee: {
      type: String, // userId
      default: null, // allow unassigned
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
