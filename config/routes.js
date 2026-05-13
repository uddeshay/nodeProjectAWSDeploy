const express = require("express");
const router = express.Router();
const Responder = require("@service/ResponderService");
const loginRoute=require("../modules/auth/routes")  
const chatRoute=require("../modules/chat/routes")
const passport = require("passport");          // ← add karo
require("../modules/auth/passport");

router.use("/auth",loginRoute)

router.use((req,res,next)=>{
    passport.authenticate("jwt", {session:false}, (err, user)=>{
        if(err){
            return Responder.respondWithError(rew,res,error.message)
        }
        if(!user){
           return Responder.respondWithUnauthorized(req, res, "Invalid user")
        }
        req.user=user
        next()
    })(req,res,next)
})
router.use("/chat", chatRoute)


module.exports = router;