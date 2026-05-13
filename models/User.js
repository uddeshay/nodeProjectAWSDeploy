const mongoose=require("mongoose")
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  password: {
    type: String,
    select: false,
  },
  refreshToken: {
  type: String,
}
});

module.exports=mongoose.model("User",UserSchema)
