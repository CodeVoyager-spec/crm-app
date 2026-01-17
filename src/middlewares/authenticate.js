const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new AppError("Not authenticated", 401));

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
