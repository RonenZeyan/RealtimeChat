
import mongoose from "mongoose";

//FUNCTION to connect to mongodb db

export const connectDB = async () =>{
    try {
        mongoose.connection.on('connected',()=>{console.log("database connected")})
        await mongoose.connect(`${process.env.MONGODB_URI}`)
    } catch (error) {
        console.log(error);
    }
}