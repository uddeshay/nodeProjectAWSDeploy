const User = require("@model/User");
const bcrypt = require("bcrypt");
const Responder = require("@service/ResponderService");
const jwt = require("jsonwebtoken");

class LoginController {
  static async signup(req, res) {
    const saltRounds = 10;

    try {
      const { email, name, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Responder.respondWithSingleValidationError(
          req,
          res,
          "User already exists",
        );
      }
      const user = await User.create({ name, email, password: hashedPassword });
      return Responder.respondWithSuccess(
        req,
        res,
        user,
        "User created successfully",
      );
    } catch (error) {
      return Responder.respondWithError(req, res, error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return Responder.respondWithSingleValidationError(
          req,
          res,
          "Invalid credentials",
        );
      }
      const isMatch = await bcrypt.compare(password, user.password);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2m",
      });
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // JS access nahi kar sakta (secure)
        secure: false, // production me true (HTTPS)
        sameSite: "Strict", // CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      if (!isMatch) {
        return Responder.respondWithSingleValidationError(
          req,
          res,
          "Invalid credentials",
        );
      }
      return Responder.respondWithSuccess(
        req,
        res,
        {
          id: user._id,
          name: user.name,
          email: user.email,
          token,
        },

        "Login successful",
      );
    } catch (error) {
      return Responder.respondWithError(req, res, error);
    }
  }

  static async refreshToken(req, res) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return Responder.respondWithSingleValidationError(
          req,
          res,
          "Access Denied. No refresh token found.",
        );
      }
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return Responder.respondWithSingleValidationError(
          req,
          res,
          "Invalid refresh token.",
        );
      }
      const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const newRefreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      user.refreshToken = newRefreshToken;
      await user.save();
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return Responder.respondWithSuccess(
        req,
        res,
        { token: newAccessToken },
        "Token refreshed",
      );
    } catch (error) {
      return Responder.respondWithError(req, res, error);
    }
  }
}
module.exports = LoginController;
