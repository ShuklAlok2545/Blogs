import mongoose from "mongoose";

const deletepSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    Type:{
      type:String,
    },
    timeOfDeletion: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("deletePosts",deletepSchema);