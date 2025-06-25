const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require('../models/user')

const getDeatils = (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "Details found successfully",
  });
};

const changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;


  // Check if all fields are provided
  if (!email || !currentPassword || !newPassword) {
    throw new BadRequestError(
      "Please provide email, current password, and new password"
    );
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // If user is not found, throw an error
  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  // Check if the current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new UnauthenticatedError("Incorrect current password");
  }

  // Update the user's password
  user.password = newPassword;
  await user.save();

  // Respond with a success message
  res.status(200).json({ message: "Password updated successfully" });
};

module.exports = { getDeatils,changePassword, };
