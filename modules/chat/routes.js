const express = require("express");
const router = express.Router();
const Responder = require("@service/ResponderService");
const ChatController = require("./ChatController");
const {defaultApiLimiter } = require("@validator/RateLimiter");
const BodyValidations = require("@validator/BodyValidators");

router.get("/protected",
  defaultApiLimiter,
  Responder.validate.bind(Responder),
  ChatController.refreshToken.bind(ChatController)
)
module.exports=router