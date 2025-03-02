const asyncHandler = require("../middleware/async");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");

// @desc    Get users
// @route   GET /api/v1/users
// @access  Private

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});


exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ message: "User not found with id of ${req.params.id}" });
  } else {
    res.status(200).json({
      success: true,
      data: user,
    });
  }
});

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });
  console.log(req.body);
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }

  await User.create(req.body);

  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
});


exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
});



exports.updateUser = asyncHandler(async (req, res, next) => {
  const fan = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, fan, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});


exports.getMe = asyncHandler(async (req, res, next) => {
  // Show current user and don't show the password
  const user = await User.findById(req.user.id).select("-password");

  res.status(200).json(user);
});


exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          user.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "User deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

// @desc Upload Single Image
// @route POST /api/v1/auth/upload
// @access Private

exports.uploadImage = asyncHandler(async (req, res, next) => {
  // // check for the file size and send an error message
  // if (req.file.size > process.env.MAX_FILE_UPLOAD) {
  //   return res.status(400).send({
  //     message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
  //   });
  // }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (User, statusCode, res) => {
  const token = User.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }
  //we have created a cookie with a token

  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });
};
