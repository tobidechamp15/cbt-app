import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizSubmission from "@/models/QuizSubmission";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect(); // Ensure the database is connected

  try {
    const { quizId, studentId, answers } = await req.json();

    // Validate that the quiz exists in the database
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
    }
    console.log(answers);
    // Validate that the student exists in the database
    const user = await User.findById(studentId);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid student ID" },
        { status: 400 }
      );
    }

    // Ensure answers are submitted for all questions in the quiz
    const totalQuestions = quiz.questions.length;
    if (answers.length !== totalQuestions) {
      return NextResponse.json(
        { error: "Answers for all questions are required" },
        { status: 400 }
      );
    }

    // Initialize score variable
    let score = 0;

    // Validate and compare answers with the correct answers for each question
    const validatedAnswers = quiz.questions.map((question) => {
      // Find the corresponding answer for the current question by matching questionId
      const submittedAnswer = answers.find(
        (answer) => answer.questionId.toString() === question._id.toString()
      );

      // If no answer is found, assume the answer is incorrect
      if (!submittedAnswer) {
        return {
          questionId: question._id,
          answer: null, // or undefined, depending on how you want to handle this case
          isCorrect: false,
        };
      }

      // Compare the correct answer from the question with the submitted answer
      const isCorrect =
        question.answer.toString().trim() ===
        submittedAnswer.answer.toString().trim();

      console.log("Is Correct:", isCorrect);
      if (isCorrect) score++;

      return {
        questionId: question._id,
        answer: submittedAnswer.answer, // The submitted answer
        isCorrect,
      };
    });

    // Save the submission to the database
    const newSubmission = new QuizSubmission({
      quizId,
      studentId,
      answers: validatedAnswers, // Save all validated answers
      score, // Store the total score
      submittedAt: new Date(), // Store the submission time
    });
    await newSubmission.save();

    // Return the result to the client with score and success message
    return NextResponse.json(
      {
        message: "Quiz submitted successfully!",
        score, // Return the total score
        totalQuestions, // Return the total number of questions
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
export async function GET(req) {
  await dbConnect(); // Ensure the database is connected

  try {
    const submissions = await QuizSubmission.find()
      .populate("quizId", "title") // Populate quiz title from the Quiz model
      .populate("studentId", "name"); // Populate student name from the User model

    // Transform the data to the desired format for the client
    const response = submissions.map((submission) => ({
      resultId: submission._id, // Return the resultId (submission's _id)
      studentId: submission.studentId, // Return studentId (from User model)
      quizId: submission.quizId._id, // Return quizId (from Quiz model)
      score: submission.score, // Return the score
      totalQuestions: submission.answers.length, // Return the total number of questions answered
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
