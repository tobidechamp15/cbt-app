import mongoose from "mongoose";
import studentQuiz from "@/models/studentQuiz";
import dbConnect from "@/lib/mongodb";

// Connect to the database
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await dbConnect();
};

// POST request to create a new StudentQuiz record
export const POST = async (req) => {
  try {
    await connectDB(); // Ensure the DB is connected

    const { studentId, quizId, score, completedAt } = await req.json();

    // Create a new StudentQuiz entry
    const newStudentQuiz = new studentQuiz({
      studentId,
      quizId,
      score,
      completedAt,
    });

    await newStudentQuiz.save(); // Save to DB

    return new Response(
      JSON.stringify({ message: "Student quiz data saved successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving student quiz:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save student quiz data" }),
      { status: 500 }
    );
  }
};

// GET request to fetch quizzes taken by a specific student
export const GET = async (req) => {
  try {
    await connectDB(); // Ensure DB connection

    const { studentId } = req.url.searchParams; // Get studentId from query params
    if (!studentId) {
      return new Response(JSON.stringify({ error: "Student ID is required" }), {
        status: 400,
      });
    }

    // Fetch quizzes taken by the student
    const quizzes = await studentQuiz
      .find({ studentId })
      .populate("quizId", "title subject") // Populate quiz details like title and subject
      .exec();

    return new Response(JSON.stringify(quizzes), { status: 200 });
  } catch (error) {
    console.error("Error fetching student quizzes:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch student quizzes" }),
      { status: 500 }
    );
  }
};
