"use client";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";

const FetchQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userClass, setUserClass] = useState("");

  const userId = sessionStorage.getItem("userID");
  // Function to fetch the user by ID
  const fetchCreatedByUserName = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      return data.name; // Assuming `name` is the field for the user's name
    } catch (error) {
      console.error("Error fetching user:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const userIs = sessionStorage.getItem("userRole");
    if (userIs === "student" || userIs === "teacher") {
      setUserRole(userIs);
    }

    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes"); // API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();

        // Fetch names for the createdBy field
        const quizzesWithNames = await Promise.all(
          data.map(async (quiz) => {
            const createdByName = await fetchCreatedByUserName(quiz.createdBy);
            return { ...quiz, createdByName };
          })
        );
        console.log(quizzesWithNames);

        setQuizzes(quizzesWithNames);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []); // Only run once when component mounts

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const userData = await response.json();
      console.log(userData);
      setUserClass(userData.class); // Assuming `class` is a field in the user object
    } catch (err) {
      setError(err.message);
    }
  };
  fetchUserDetails(userId);

  const filteredQuizzes =
    userRole === "student"
      ? quizzes.filter((quiz) => quiz.class === userClass)
      : quizzes;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      {filteredQuizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul className="space-y-4">
          {userRole === "teacher"
            ? filteredQuizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-semibold">
                    Exam title: {quiz.title}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Subject:</strong> {quiz.subject}
                  </p>
                  <p className="text-gray-600">
                    <strong>Class:</strong> {quiz.class}
                  </p>
                  <p className="text-gray-600">
                    <strong>Created By:</strong> {quiz.createdByName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Created At:</strong>{" "}
                    {new Date(quiz.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <Link
                      href={`/dashboard/quizzes/${quiz._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Quiz
                    </Link>
                  </div>
                </li>
              ))
            : filteredQuizzes.map((quiz) => (
                <li
                  key={quiz._id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-semibold">{quiz.title}</h2>
                  <p className="text-gray-600">
                    <strong>Subject:</strong> {quiz.subject}
                  </p>
                  <p className="text-gray-600">
                    <strong>Class:</strong> {quiz.class}
                  </p>
                  <p className="text-gray-600">
                    <strong>Created By:</strong> {quiz.createdByName}
                  </p>
                  <p className="text-gray-600">
                    <strong>Created At:</strong>{" "}
                    {new Date(quiz.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <Link
                      href={`/dashboard/quizzes/answer/${quiz._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Answer Quiz
                    </Link>
                  </div>
                </li>
              ))}
        </ul>
      )}
    </div>
  );
};

export default FetchQuizzes;
