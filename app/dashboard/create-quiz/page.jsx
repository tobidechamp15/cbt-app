"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const CreateQuiz = () => {
  const [user, setUser] = useState({});
  const [quizData, setQuizData] = useState({
    title: "",
    subject: "",
    class: "",
    timeLimit: "", // Added timeLimit field
    startTime: "", // Added startTime field
    endTime: "", // Added endTime field
    createdBy: "",
    questions: [{ question: "", options: ["", "", "", ""], answer: 0 }],
  });
  const { data: session } = useSession();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  // Handle question change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    if (field === "options") {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  // Add a new question
  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { question: "", options: ["", ""], answer: 0 }, // Ensure there are at least two options
      ],
    });
  };

  // Remove an option if there are more than 2 options
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userID");

    if (!userId) {
      alert("User is not authenticated. Please log in to create a quiz.");
      return;
    }

    try {
      const quizWithCreator = {
        ...quizData,
        createdBy: userId, // Set the ID instead of a string
      };

      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizWithCreator),
      });
      console.log(quizWithCreator);

      if (res.ok) {
        alert("Quiz Created!");
        setQuizData({
          title: "",
          subject: "",
          class: "",
          timeLimit: "",
          startTime: "",
          endTime: "",
          questions: [{ question: "", options: ["", "", "", ""], answer: 0 }],
        });
      } else {
        console.error("Error creating quiz");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a New Quiz
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Quiz Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Quiz Title
            </label>
            <select
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled>
                Select quiz type
              </option>
              <option value="Exam">Examination</option>
              <option value="Mid Term Test">Mid Term Test</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>

          {/* Quiz Subject */}
          <div className="mb-6">
            <label
              htmlFor="subject"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={quizData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the quiz subject"
              required
            />
          </div>

          {/* Quiz Class */}
          <div className="mb-6">
            <label
              htmlFor="class"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Class
            </label>
            <select
              id="class"
              name="class"
              value={quizData.class}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="" disabled>
                Select a class
              </option>
              <option value="jss1">JSS1</option>
              <option value="jss2">JSS2</option>
              <option value="jss3">JSS3</option>
              <option value="ss1 science">SS1 Science</option>
              <option value="ss1 art">SS1 Art</option>
              <option value="ss1 commercial">SS1 Commercial</option>
              <option value="ss2 science">SS2 Science</option>
              <option value="ss2 art">SS2 Art</option>{" "}
              <option value="ss2 commercial">SS2 Commercial</option>
              <option value="ss3 science">SS3 Science</option>
              <option value="ss3 art">SS3 Art</option>
              <option value="ss3 commercial">SS3 Commercial</option>
            </select>
          </div>

          {/* Time Limit */}
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
              name="timeLimit"
              value={quizData.timeLimit}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the time limit in minutes"
              min="1"
              required
            />
          </div>

          {/* Start Time */}
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
              value={quizData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* End Time */}
          <div className="mb-6">
            <label
              htmlFor="endTime"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={quizData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Questions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Questions
            </h2>
            {quizData.questions.map((q, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50 shadow-sm"
              >
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  Question {index + 1}
                </label>
                <input
                  type="text"
                  placeholder="Enter the question"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
                  required
                />

                {/* Options */}
                <label className="block text-lg font-medium text-gray-800 mb-2">
                  Options
                </label>
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center mb-3">
                    <input
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const updatedOptions = [...q.options];
                        updatedOptions[optionIndex] = e.target.value;
                        handleQuestionChange(index, "options", updatedOptions);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updatedQuestions = [...quizData.questions];
                    if (updatedQuestions[index].options.length < 4) {
                      updatedQuestions[index].options.push("");
                      setQuizData({ ...quizData, questions: updatedQuestions });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Option
                </button>
                <br />

                <div className="mt-4">
                  <label
                    htmlFor="answer"
                    className="block text-lg font-medium text-gray-800 mb-2"
                  >
                    Correct Answer
                  </label>
                  <select
                    value={q.answer}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "answer",
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {q.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              Add Question
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
