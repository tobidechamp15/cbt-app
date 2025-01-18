"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useParams } from "next/navigation";

const AnswerQuiz = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the quiz ID from the URL
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0); // Timer in seconds
  const [timerStartTime, setTimerStartTime] = useState(null); // Store the time the timer started

  const userId = sessionStorage.getItem("userID");

  // Fetch the quiz details by ID
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await res.json();
        setQuiz(data);
        setAnswers(
          data.questions.map((question) => ({
            questionId: question._id,
            answer: "", // Initialize answer as empty for each question
          }))
        );

        // Check if time is already saved in localStorage
        const savedTime = localStorage.getItem(`quiz-${id}-time-left`);
        if (savedTime) {
          // Resume the timer if there's saved time in localStorage
          setTimeLeft(parseInt(savedTime, 10));
          const savedStartTime = localStorage.getItem(`quiz-${id}-timer-start`);
          setTimerStartTime(parseInt(savedStartTime, 10));
        } else {
          // Initialize timer if no saved time, start it from the full time limit
          setTimeLeft(data.timeLimit * 60); // Convert minutes to seconds
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userId) {
      router.push("/login"); // Redirect to login if no session
      return;
    }

    fetchQuiz();
  }, [userId, id]); // Fetch quiz on mount and if session changes

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Submit automatically when time lapses
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem(`quiz-${id}-time-left`, newTime); // Save time in localStorage
        return newTime;
      });
    }, 1000);

    // Store the time when the timer started (to calculate elapsed time in case of reload)
    if (!timerStartTime) {
      setTimerStartTime(Date.now());
      localStorage.setItem(`quiz-${id}-timer-start`, Date.now());
    }

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [timeLeft, id, timerStartTime]);

  // Format time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Handle answer submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent form submission if called manually

    const submission = {
      quizId: quiz._id,
      studentId: userId,
      answers,
    };
    console.log(submission);

    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      if (!res.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await res.json();
      console.log("Quiz submitted successfully!");
      router.push("/dashboard/quizzes"); // Redirect to quizzes list
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Answer Quiz: {quiz.title}</h1>
      <p className="text-lg text-red-600 mb-4">
        Time Left: {formatTime(timeLeft)}
      </p>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, index) => (
          <div key={question._id} className="mb-4">
            <p className="font-semibold">{question.question}</p>
            <div>
              {question.options.map((option, i) => (
                <div key={i} className="flex items-center mb-2">
                  <input
                    type="radio"
                    required
                    id={`question-${index}-option-${i}`}
                    name={`question-${index}`}
                    value={i}
                    checked={answers[index]?.answer === i}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = {
                        questionId: question._id,
                        answer: parseInt(e.target.value, 10),
                      };
                      setAnswers(newAnswers);
                    }}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`question-${index}-option-${i}`}
                    className="text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default AnswerQuiz;
