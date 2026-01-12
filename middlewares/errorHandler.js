const { ZodError } = require("zod");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

module.exports = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues?.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Database validation error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({ message: "Token expired" });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
};
