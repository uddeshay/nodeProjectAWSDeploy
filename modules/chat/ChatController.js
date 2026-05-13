const User = require("@model/User");
const bcrypt = require("bcrypt");
const Responder = require("@service/ResponderService");
const jwt = require("jsonwebtoken");

class ChatController{
     static async refreshToken(req,res){
       return Responder.respondWithSuccess(req, res,'Namaste protected route accessed')
    
      }
}
module.exports = ChatController;