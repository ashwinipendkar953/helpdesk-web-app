// src/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(express.json());

connectDB();

const frontendUrl = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).trim();

const corsOptions = {
  origin: frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
