const passport=require("passport")
// const localStrategy=require("passport-local").Strategy
const User=require("../../models/User")
// const bcrypt=require("bcrypt")
// const { Strategy } = require("passport-local")
const jwtStrategy=require("passport-jwt").Strategy
const ExtractJwt=require("passport-jwt").ExtractJwt

passport.use("jwt",new jwtStrategy({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.JWT_SECRET
},
async (payload,done)=>{
    try{
        const user=await User.findById(payload.id)
        if(!user){
            return done({message:"Invalid Token",status:401})
        }
        done(null,user)
    }catch(error){
        return done({ message: "Internal Server Error", status: 500 });
    }

}))