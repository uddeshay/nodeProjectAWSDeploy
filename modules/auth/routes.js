const express = require("express");
const router = express.Router();
const Responder = require("@service/ResponderService");
const LoginController = require("./LoginController");
const {defaultApiLimiter } = require("@validator/RateLimiter");
const BodyValidations = require("@validator/BodyValidators");

router.post("/signup", 
    defaultApiLimiter, 
    [
  BodyValidations.requiredString("email"),
  BodyValidations.requiredString("name"),
  BodyValidations.requiredString("password"),
],
  Responder.validate.bind(Responder),
  LoginController.signup.bind(LoginController)

);

router.post("/login",
  defaultApiLimiter,
  [
    BodyValidations.requiredString("email"),
    BodyValidations.requiredString("password"),
  ],
  Responder.validate.bind(Responder),
  LoginController.login.bind(LoginController)
)

router.post("/refresh-token",
  defaultApiLimiter,
  Responder.validate.bind(Responder),
  LoginController.refreshToken.bind(LoginController)

)


module.exports=router