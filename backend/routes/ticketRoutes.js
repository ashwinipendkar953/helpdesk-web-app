const express = require("express");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const router = express.Router();

// Get all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("customer", "username")
      .sort({ updatedAt: -1 });

    const [totalTickets, totalCustomers] = await Promise.all([
      Ticket.countDocuments(),
      User.countDocuments({ role: "customer" }),
    ]);

    res.status(200).json({
      message: "All tickets fetched successfully",
      tickets,
      totalTickets,
      totalCustomers,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server Error: " + error.message });
  }
});

// get customer all ticket
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const tickets = await Ticket.find({ customer: customerId })
      .populate("customer", "username")
      .sort({ updatedAt: -1 });

    if (!tickets.length) {
      return res.status(404).json({
        message:
          "No tickets found for this customer. You can add a new ticket.",
      });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// get ticket by id
router.get("/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId).populate(
      "customer",
      "username"
    );

    if (!ticket) {
      return res.status(404).json({
        message: "No ticket found with this ID. You can add a new ticket.",
      });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// create new ticket
router.post("/", async (req, res) => {
  const { title, description, customer } = req.body;

  if (!title || !description || !customer) {
    return res.status(400).json({
      message: "Title, Description, and customerId are required",
    });
  }

  try {
    const findTicket = await Ticket.findOne({ title, customer });
    if (findTicket) {
      return res.status(400).json({
        message: "A ticket with this title already exists",
      });
    }

    const newTicket = await Ticket.create({
      title,
      description,
      status: "active",
      customer,
    });
    await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
});

// Update Ticket Status using PUT
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("customer", "username")
      .exec();

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      message: "Ticket status updated successfully.",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
});

// add notes
router.post("/:id/notes", async (req, res) => {
  const { text, addedBy } = req.body;
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const user = await User.findById(addedBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only store userId in addedBy field
    ticket.notes.push({ text, addedBy: user._id }); // Just the user ID
    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id).populate({
      path: "notes.addedBy",
      select: "username role", // Populate with username and role
    });

    res.json({ message: "Note added successfully", ticket: updatedTicket });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get notes by ticket
router.get("/:id/notes", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate({
      path: "notes.addedBy",
      select: "username role",
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const sortedNotes = ticket.notes.sort((a, b) => b.timestamp - a.timestamp);

    res.json({ notes: sortedNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
