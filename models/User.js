import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"], // Add more roles if needed
      required: true,
    },
    class: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    }, // Required for students only
    subjectsTaught: {
      type: [String],
      required: function () {
        return this.role === "teacher";
      }, // Required for teachers only
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
