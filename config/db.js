import mongoose from "mongoose";

export const connectDb = async () => {
  const data = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Database connected with server: ${data.connection.host}`);
};
