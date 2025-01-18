// models/QuizSubmission.js
import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    studentId: { type: String, required: true },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answer: { type: mongoose.Schema.Types.Mixed, required: true }, // Using Mixed type for flexibility
        isCorrect: { type: Boolean, required: true },
      },
    ],
    score: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.QuizSubmission ||
  mongoose.model("QuizSubmission", quizSubmissionSchema);
