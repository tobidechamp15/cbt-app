import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Ensure the correct schema file is imported
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const { role } = req.nextUrl.searchParams;

    // If a specific role is requested (either "student" or "teacher")
    let users;
    if (role) {
      users = await User.find({ role });
    } else {
      // If no role is specified, return all users
      users = await User.find();
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users. Please try again later." },
      { status: 500 }
    );
  }
}
