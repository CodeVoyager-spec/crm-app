const AppError = require("../utils/AppError");

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));
  if (!roles.includes(req.user.role)) return next(new AppError("Access denied", 403));
  next();
};

module.exports = authorize;
