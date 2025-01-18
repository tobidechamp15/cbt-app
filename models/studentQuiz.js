import mongoose from "mongoose";

const studentQuizSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  score: { type: Number },
  completedAt: { type: Date },
});

export default mongoose.models.StudentQuiz ||
  mongoose.model("StudentQuiz", studentQuizSchema);
