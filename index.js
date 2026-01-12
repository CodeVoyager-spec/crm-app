const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const ticketRoutes = require("./routes/ticket.routes");
const commentRoutes = require("./routes/comment.routes");

const errorHandler = require("./middlewares/errorHandler");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Global Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes (v1)
 * Base URL: /crm/api/v1
 */
app.use("/crm/api/v1", authRoutes);
app.use("/crm/api/v1", userRoutes);
app.use("/crm/api/v1", ticketRoutes);
app.use("/api/crm/v1", commentRoutes);

/**
 * Global Error Handler
 * (Must be after routes)
 */
app.use(errorHandler);

/**
 * Connect DB and start server
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
