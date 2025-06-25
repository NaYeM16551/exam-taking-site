const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/user");
const mongoose = require("mongoose");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthenticatedError("Invalid credentials2");

  const sessionId = new mongoose.Types.ObjectId().toString();
  user.currentSessionID = sessionId;
  await user.save();

  // Generate a JWT
  const token = jwt.sign(
    { userId: user._id, sessionId },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Send the token to the client
  res.status(StatusCodes.OK).json({ token });
};

const register = async (req, res) => {
  const {
    name,
    email,
    password,
    lastName,
    location,
    phoneNumber,
    guardianPhoneNumber,
    hscYear,
    college,
    facebookID,
  } = req.body;
  {
    // Check if the email or phone number is already registered
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }

    // Create a new user instance
    const user = new User({
      name,
      email,
      password,
      lastName,
      location,
      phoneNumber,
      guardianPhoneNumber,
      hscYear,
      college,
      facebookID,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = user.createJWT();

    // Send the token to the client
    res
      .status(201)
      .json({ user: { name: user.name, email: user.email }, token });
  }
};

const logout = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Invalidate the current session by setting the currentSessionID to null
  user.currentSessionID = null;
  await user.save();

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { login, register };
