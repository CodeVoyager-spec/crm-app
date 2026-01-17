const bcrypt = require("bcryptjs"); const User = require("../models/user.model"); 
const { USER_ROLE, USER_STATUS } = require("../constants/user.constants"); 
const AppError = require("../utils/AppError"); 
const catchAsync = require("../utils/catchAsync"); 
const { signToken } = require("../utils/jwt");


/**
 * Signup new user
 */
exports.signup = catchAsync(async (req, res) => {
  const { name, userId, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ userId });
  if (existingUser) {
    throw new AppError(
      "This user ID is already registered. Please use a different one.",
      409
    );
  }

  // Determine role and status
  const userRole = role || USER_ROLE.CUSTOMER;
  const status =
    userRole === USER_ROLE.CUSTOMER
      ? USER_STATUS.APPROVED
      : USER_STATUS.PENDING;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    userId,
    email,
    password: hashedPassword,
    role: userRole,
    status,
  });

  res.status(201).json({
    message: "Your account has been created successfully.",
    user: {
      name: user.name,
      userId: user.userId,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
  });
});


/**
 * Signin existing user
 */
exports.signin = catchAsync(async (req, res) => {
  const { userId, password } = req.body;

  // Find user with password
  const user = await User.findOne({ userId }).select("+password");
  if (!user) {
    throw new AppError(
      "Invalid user ID or password. Please try again.",
      401
    );
  }

  // Check approval status
  if (user.status !== USER_STATUS.APPROVED) {
    throw new AppError(
      "Your account is not approved yet. Please contact support.",
      403
    );
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid user ID or password. Please try again.",
      401
    );
  }

  // Generate JWT
  const token = signToken({ userId: user.userId, role: user.role });

  res.status(200).json({
    message: "Login successful.",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token,
    },
  });
});
