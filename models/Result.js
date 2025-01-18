import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  score: Number,
  dateTaken: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
