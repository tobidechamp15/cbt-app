import Result from "@/models/Result";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const newResult = await Result.create(data);
  return new Response(JSON.stringify(newResult), { status: 201 });
}
