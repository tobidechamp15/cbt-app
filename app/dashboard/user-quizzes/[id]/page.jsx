"use client"; // Mark this as a client component

import Loader from "@/components/Loader";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuizPage = ({ params }) => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null); // Track editing state

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { id } = await params; // Unwrap params with await
        const res = await fetch(`/api/quizzes/${id}`);
        if (!res.ok) throw new Error("Quiz not found");

        const data = await res.json();
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

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""],
      answer: 0, // Set the first option as the default correct answer
    };
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [...prevQuiz.questions, newQuestion],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter((_, i) => i !== index),
    }));
  };

  const handleEditQuestion = (index, newQuestion) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: newQuestion,
    };
    setQuiz((prevQuiz) => ({ ...prevQuiz, questions: updatedQuestions }));
  };

  const handleEditOption = (questionIndex, optionIndex, newOption) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = newOption;
    setQuiz((prevQuiz) => ({ ...prevQuiz, questions: updatedQuestions }));
  };

  const handleEditCorrectAnswer = (questionIndex, newAnswerIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].answer = newAnswerIndex;
    setQuiz((prevQuiz) => ({ ...prevQuiz, questions: updatedQuestions }));
  };

  const handleEditStartTime = (newStartTime) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, startTime: newStartTime }));
  };

  const handleEditEndTime = (newEndTime) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, endTime: newEndTime }));
  };

  const handleEditTimeLimit = (newTimeLimit) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, timeLimit: newTimeLimit }));
  };

  const handleEditClass = (newClass) => {
    setQuiz((prevQuiz) => ({ ...prevQuiz, class: newClass }));
  };

  const handleSaveChanges = async () => {
    setEditingQuiz(null);
    alert("Your changes have been saved");
    try {
      const response = await fetch(`/api/quizzes/${quiz._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quiz),
      });
      if (!response.ok) {
        throw new Error("Failed to update quiz");
      }
      const updatedData = await response.json();
      setQuiz(updatedData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) return <Loader />;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex justify-between me-4">
        <Link href="/dashboard/user-quizzes" className="btn btn-outline-danger">
          Back
        </Link>
        <button
          className="btn btn-primary fixed right-0"
          onClick={() => setEditingQuiz(!editingQuiz)}
        >
          Edit Quiz Details
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">{quiz.title}</h1>
        <p className="text-sm text-gray-500">
          <strong>Created by:</strong> {quiz.createdBy} |{" "}
          <strong>Created at:</strong>{" "}
          {new Date(quiz.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Editable Fields */}
      {editingQuiz && (
        <div>
          <div className="mt-4">
            <label htmlFor="title" className="block text-sm text-gray-700">
              Quiz Title:
            </label>
            <input
              id="title"
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          {/* Add other editable fields (e.g., class, time limit, etc.) */}
          <div className="mt-4">
            <label htmlFor="class" className="block text-sm text-gray-700">
              Class:
            </label>
            <input
              id="class"
              type="text"
              value={quiz.class}
              onChange={(e) => handleEditClass(e.target.value)}
              className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
          </div>
          {/* Add other editable fields here */}
          {/* Editing Time Limit */}

          <div className="mb-6">
            <label
              htmlFor="timeLimit"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Time Limit (in minutes)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={quiz.timeLimit}
              onChange={(e) => handleEditTimeLimit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the time limit in minutes"
              min="1"
            />
          </div>
          {/* Editing Start Time */}

          <div className="mb-6">
            <label
              htmlFor="startTime"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={quiz.startTime}
              onChange={(e) => handleEditStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Editing End Time */}
          <div className="mb-6">
            <label
              htmlFor="startTime"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={quiz.endTime}
              onChange={(e) => handleEditEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <strong>Start Time:</strong>{" "}
          {new Date(quiz.startTime).toLocaleString()}
        </p>
        <p>
          <strong>End Time:</strong> {new Date(quiz.endTime).toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
        <h2 className="text-lg font-bold text-gray-700">Questions</h2>
        {quiz.questions && quiz.questions.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {quiz.questions.map((question, index) => (
              <li key={question._id} className="p-4 bg-white shadow rounded-lg">
                <p className="font-medium text-gray-800">
                  <strong>Question {index + 1}:</strong>{" "}
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleEditQuestion(index, e.target.value)}
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                </p>
                <div className="mt-2">
                  <p className="font-medium text-gray-600">Options:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex} className="text-gray-700 pl-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleEditOption(index, optionIndex, e.target.value)
                          }
                          className="mt-1 p-2 border border-gray-300 rounded-lg w-full"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  <strong>Correct Answer:</strong>{" "}
                  <select
                    value={question.answer}
                    onChange={(e) =>
                      handleEditCorrectAnswer(index, parseInt(e.target.value))
                    }
                    className="mt-2 p-2 border border-gray-300 rounded-lg"
                  >
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                </p>
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="mt-2 p-2 bg-red-500 text-white rounded-lg"
                >
                  Remove Question
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No questions available.</p>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddQuestion}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          Add Question
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSaveChanges}
          className="p-2 bg-green-500 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
