import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: {
          type: [String],
          required: true,
        },
        answer: {
          type: mongoose.Schema.Types.Mixed, // Allow any data type for the answer field
          required: true,
          // a
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to User
    timeLimit: {
      type: Number,
      required: true,
      min: [1, "Time limit must be greater than 0 minutes."],
      message: "Time limit must be greater than 0 minutes.",
    }, // Time limit in minutes
    startTime: {
      type: Date,
      required: true,
      message: "Start time is required.",
    }, // Date and time when the quiz will be available
    endTime: {
      type: Date,
      required: true,
      message: "End time is required.",
    }, // Date and time when the quiz will expire
  },
  { timestamps: true }
);

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
