import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    fileType:{
      type:String,
    },
    timeOfCreation: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
