const mongoose = require('mongoose');
const { env } = require('process');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is Connected")
    }catch (error) {
        console.error("MongoDB connection failed:", error.message);
}
}
module.exports = {connectDB}