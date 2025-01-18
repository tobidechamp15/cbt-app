import Result from "@/models/Result";
import connectDB from "@/lib/mongodb";

export async function GET(req, { params }) {
  await connectDB();
  const { studentId } = params;

  try {
    const results = await Result.find({ student: studentId }).populate("quiz");
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
