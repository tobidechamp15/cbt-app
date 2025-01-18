import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Ensure the correct schema file is imported
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();

  try {
    const {
      name,
      email,
      password,
      role,
      class: userClass,
      subjectsTaught,
    } = await req.json();

    // Check role-specific requirements
    if (role === "student" && !userClass) {
      return NextResponse.json(
        { error: "Class is required for students." },
        { status: 400 }
      );
    }

    if (
      role === "teacher" &&
      (!subjectsTaught || subjectsTaught.length === 0)
    ) {
      return NextResponse.json(
        { error: "Subjects taught are required for teachers." },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      role,
      ...(role === "student" && { class: userClass }),
      ...(role === "teacher" && { subjectsTaught }),
    });

    const result = await newUser.save();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log("Error during signup:", error);
    return NextResponse.json(
      { error: "Error during signup. Please check your inputs." },
      { status: 500 }
    );
  }
}
