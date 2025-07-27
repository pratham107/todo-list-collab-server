import mongoose from "mongoose"
export const connectDb = async()=>{
   try {
     await mongoose.connect(process.env.MONGO_URI)
     console.log("Connected to MongoDB")    
   } catch (error) {
      console.log(`something went wrong while connecting a Db ${error?.message}`);
      process.exit(1);
   }
}