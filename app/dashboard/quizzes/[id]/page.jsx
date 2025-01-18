"use client"; // Mark this as a client component

import Loader from "@/components/Loader";
import React, { useEffect, useState } from "react";

const QuizPage = ({ params }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Await params to get the resolved object
        const { id } = await params; // Unwrap params with await

        // Fetch the quiz data using the ID from `params`
        const res = await fetch(`/api/quizzes/${id}`);
        if (!res.ok) throw new Error("Quiz not found");

        const data = await res.json();
        console.log(data); // Log the fetched quiz data for debugging
        setQuiz(data);
      } catch (error) {
        console.error(error.message);
        setQuiz(null); // Clear state on error
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [params]); // Re-run when `params` changes

  if (loading) return <Loader />;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>
        <strong>Class:</strong> {quiz.class}
      </p>
      <p>
        <strong>Subject:</strong> {quiz.subject}
      </p>
      <p>
        <strong>Time Limit:</strong> {quiz.timeLimit} minutes
      </p>
      <p>
        <strong>Start Time:</strong> {new Date(quiz.startTime).toLocaleString()}
      </p>
      <p>
        <strong>End Time:</strong> {new Date(quiz.endTime).toLocaleString()}
      </p>
      <p>
        <strong>Created By:</strong> {quiz.createdBy}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(quiz.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong> {new Date(quiz.updatedAt).toLocaleString()}
      </p>

      {/* Render Questions */}
      <div>
        <h2>Questions:</h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          <ul>
            {quiz.questions.map((question, index) => (
              <li key={question._id}>
                <p>
                  <strong>Question:</strong> {question.question}
                </p>
                <p>
                  <strong>Options:</strong>
                </p>
                <ul>
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex}>{option}</li>
                  ))}
                </ul>
                <p>
                  <strong>Selected Answer:</strong>{" "}
                  {question.options[question.answer]}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
