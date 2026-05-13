const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
            console.log("MongoDB connected successfully");
    
    }catch(error){
        console.error("MongoDB connection error:",error);
        process.exit(1);
    }
};  
module.exports=connectDB;











// mongoose.connect('mongodb://127.0.0.1:27017/logindatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ Connected to MongoDB"))
// .catch(err => console.error("❌ MongoDB Connection Error:", err));