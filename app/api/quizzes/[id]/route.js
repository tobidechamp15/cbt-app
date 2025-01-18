import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export async function GET(req, { params }) {
  await dbConnect(); // Ensure the database connection

  try {
    const { id } = await params; // Extract the quiz ID from the URL parameters

    const quiz = await Quiz.findById(id); // Find the quiz by ID

    if (!quiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(quiz), { status: 200 }); // Respond with the quiz data
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch quiz." }), {
      status: 500,
    });
  }
}

// Handle DELETE request for deleting a quiz
export async function DELETE(req, { params }) {
  await dbConnect(); // Ensure the database connection

  try {
    const { id } = await params; // Extract the quiz ID from the URL parameters

    const deletedQuiz = await Quiz.findByIdAndDelete(id); // Delete the quiz by ID

    if (!deletedQuiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Quiz deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return new Response(JSON.stringify({ error: "Failed to delete quiz." }), {
      status: 500,
    });
  }
}

// Handle PUT request for updating a quiz
export async function PUT(req, { params }) {
  await dbConnect(); // Ensure the database connection

  try {
    const { id } = await params; // Extract the quiz ID from the URL parameters
    const data = await req.json(); // Parse the incoming request body

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, data, {
      new: true, // Return the updated quiz
    });

    if (!updatedQuiz) {
      return new Response(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedQuiz), { status: 200 }); // Respond with the updated quiz
  } catch (error) {
    console.error("Error updating quiz:", error);
    return new Response(JSON.stringify({ error: "Failed to update quiz." }), {
      status: 500,
    });
  }
}
