import mongoose from "mongoose";

// defining the schema

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }, { timestamps: true })
  
export default mongoose.model('User', userSchema)
  