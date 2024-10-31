const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["active", "pending", "closed"],
      default: "active",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: [
      {
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
