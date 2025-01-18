import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Ensure the correct schema file is imported
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params; // Get the ID from the URL params

  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
    }

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json(
      { error: "Error fetching user. Please try again later." },
      { status: 500 }
    );
  }
}
