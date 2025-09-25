import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://KingFlex:Gugee7978@harry.n6mpekr.mongodb.net/Taskflow"
    )
    .then(() => console.log("DB Connected"));
};
