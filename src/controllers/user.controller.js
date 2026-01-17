const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { USER_ROLE, USER_STATUS } = require("../constants/user.constants");

/**
 * Get all users with search filters (ADMIN only)
 */
exports.getAllUsers = catchAsync(async (req, res) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      "You do not have permission to view the users list.",
      403
    );
  }

  const { role, status } = req.query;

  // Build dynamic query
  const query = {};

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  const users = await User.find(query).select("-password");

  res.status(200).json({
    count: users.length,
    users,
  });
});

/**
 * Get user by userId (Admin only)
 */
exports.getUserById = catchAsync(async (req, res) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      "You do not have permission to view user details.", 
      403
    );
  }

  const { userId } = req.params;

  const user = await User.findOne({ userId }).select("-password");
  if (!user) {
    throw new AppError(
      "User not found. Please check the user ID and try again.",
      404
    );
  }

  res.status(200).json(user);
});

/**
 * Update user (Admin only)
 */
exports.updateUser = catchAsync(async (req, res) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      "You do not have permission to update user details.",
      403
    );
  }

  const { userId } = req.params;
 
  const user = await User.findOneAndUpdate({ userId }, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user)
    throw new AppError(
      "User not found. Please check the user ID and try again.",
      404
    );

  res.status(200).json(user);
});

/**
 * Delete user (Admin only)
 */
exports.deleteUser = catchAsync(async (req, res) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    throw new AppError(
      "You do not have permission to delete a user.", 
      403
    );
  }

  const { userId } = req.params;

  const user = await User.findOneAndDelete({ userId });
  if (!user) {
    throw new AppError(
      "User not found. Unable to delete the user.", 
      404
    );
  }

  res.status(200).json({
    message: "User deleted successfully",
  });
});
