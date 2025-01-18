"use client";

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

const ResultsPage = ({ params }) => {
  const { studentId } = params; // Student ID from URL
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/results/${studentId}`);
        const data = await res.json();
        setResults(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };
    fetchResults();
  }, [studentId]);

  if (loading) return <Loader />;
  if (results.length === 0) return <p>No results found for this student.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Results</h1>
      {results.map((result) => (
        <div key={result._id} className="border p-4 my-4 rounded">
          <h2 className="text-lg font-semibold">{result.quiz.title}</h2>
          <p>
            Score: {result.score}/{result.quiz.questions.length}
          </p>
          <p>Date Taken: {new Date(result.dateTaken).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
