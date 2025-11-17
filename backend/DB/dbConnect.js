import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        // Check if MONGO is available
        if (!process.env.MONGO) {
          console.error("Mongo URI is not defined in environment variables.");
          return;
        }

        await mongoose.connect(process.env.MONGO);
        console.log("DB connected successfully");

    } catch (error) {
        console.error(error);
    }
}

export default dbConnect;
