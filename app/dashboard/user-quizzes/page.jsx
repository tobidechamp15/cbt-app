"use client";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";

const FetchUserQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [updatedQuiz, setUpdatedQuiz] = useState({
    title: "",
    subject: "",
    questions: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Quizzes per page
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userID");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID is not available. Please log in.");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/quizzes`);
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        const userQuizzes = data.filter((quiz) => quiz.createdBy === userId);
        setQuizzes(userQuizzes);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setUpdatedQuiz({
      title: quiz.title,
      subject: quiz.subject,
      questions: quiz.questions || [],
    });
  };

  const handleDeleteConfirmation = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/quizzes/${quizToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete._id));
      setShowDeleteModal(false);
      setQuizToDelete(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...updatedQuiz.questions];
    updatedQuestions[index][field] = value;
    setUpdatedQuiz({ ...updatedQuiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setUpdatedQuiz({
      ...updatedQuiz,
      questions: [...updatedQuiz.questions, { question: "", answer: "" }],
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = updatedQuiz.questions.filter(
      (_, i) => i !== index
    );
    setUpdatedQuiz({ ...updatedQuiz, questions: updatedQuestions });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/quizzes/${editingQuiz._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuiz),
      });
      if (!response.ok) {
        throw new Error("Failed to update quiz");
      }
      const updatedData = await response.json();
      setQuizzes(
        quizzes.map((quiz) =>
          quiz._id === updatedData._id ? updatedData : quiz
        )
      );
      setEditingQuiz(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Quizzes</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {paginatedQuizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {paginatedQuizzes.map((quiz) => (
            <li key={quiz._id} className="border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold">{quiz.title}</h2>
              <p className="text-sm text-gray-500">{quiz.subject}</p>

              <div className="mt-4 flex space-x-4">
                <Link
                  href={`/dashboard/user-quizzes/${quiz._id}`}
                  // onClick={() => handleEdit(quiz)}
                  className="btn btn-outline-primary text-black hover:text-white py-2 px-4 rounded"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteConfirmation(quiz)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>

      {editingQuiz && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Quiz</h2>
            <div>
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={updatedQuiz.title}
                onChange={(e) =>
                  setUpdatedQuiz({ ...updatedQuiz, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Subject</label>
              <input
                type="text"
                value={updatedQuiz.subject}
                onChange={(e) =>
                  setUpdatedQuiz({ ...updatedQuiz, subject: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {updatedQuiz.questions.map((question, index) => (
                <div key={index} className="mb-4">
                  <label className="block mb-2">Question</label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <label className="block mt-2">Answer</label>
                  <input
                    type="text"
                    value={question.answer}
                    onChange={(e) =>
                      handleQuestionChange(index, "answer", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-4"
              >
                Add Question
              </button>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setEditingQuiz(null)}
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this quiz?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchUserQuizzes;
