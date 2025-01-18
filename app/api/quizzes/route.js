import Quiz from "@/models/Quiz"; // Import your Quiz model
import dbConnect from "@/lib/mongodb";

// Handle POST request for creating a quiz
export async function POST(req) {
  await dbConnect(); // Ensure the database connection

  try {
    const data = await req.json(); // Parse the incoming request body
    const newQuiz = await Quiz.create(data); // Create a new quiz in the database
    return new Response(JSON.stringify(newQuiz), { status: 201 }); // Respond with the created quiz
  } catch (error) {
    console.error("Error creating quiz:", error);
    return new Response(JSON.stringify({ error: "Failed to create quiz." }), {
      status: 500,
    });
  }
}

// Handle GET request for fetching all quizzes
export async function GET(req) {
  await dbConnect(); // Ensure the database connection

  try {
    const quizzes = await Quiz.find(); // Fetch all quizzes from the database
    return new Response(JSON.stringify(quizzes), { status: 200 }); // Respond with the quizzes
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch quizzes." }), {
      status: 500,
    });
  }
}
