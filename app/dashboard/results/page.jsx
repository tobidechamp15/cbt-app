// // app/interviews/page.js
// "use client"; // To manage tabs using state

// import { useState } from "react";

// export default function Interviews() {
//   const [activeTab, setActiveTab] = useState("Pending");

//   const tabs = ["Pending", "Active", "Completed"];
//   const interviews = [
//     {
//       id: 1,
//       role: "UI/UX Intern",
//       name: "Oluwaseun Awosola",
//       date: "21-11-2024",
//       time: "13:30",
//     },
//     {
//       id: 2,
//       role: "UI/UX Intern",
//       name: "Oluwatobi Kester",
//       date: "21-11-2024",
//       time: "13:30",
//     },
//   ];

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-4">Interviews</h1>
//       {/* Tabs */}
//       <div className="flex space-x-4 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded ${
//               activeTab === tab
//                 ? "bg-green-600 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* Interview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {interviews.map((interview) => (
//           <div
//             key={interview.id}
//             className="bg-white p-4 rounded shadow-sm border border-gray-200"
//           >
//             <h2 className="text-lg font-semibold">{interview.role}</h2>
//             <p className="text-gray-600">{interview.name}</p>
//             <p className="text-gray-600">{interview.date}</p>
//             <p className="text-gray-600">{interview.time}</p>
//             <button className="mt-4 flex items-center bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
//               <span className="material-icons mr-2">video_call</span> Google
//               Meet
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    setUserRole(userRole);
    const userId = sessionStorage.getItem("userID");
    setUserId(userId);

    const fetchResults = async () => {
      try {
        const res = await fetch("/api/submit-quiz");
        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await res.json();
        console.log(data);
        setResults(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchResults();
  }, []); // The empty array ensures the effect runs only once when the component mounts

  const filteredQuizzes =
    userRole === "student"
      ? results.filter((result) => result.studentId === userId)
      : results;

  return (
    <div>
      {filteredQuizzes.map((result) => (
        <div key={result.resultId}>Your score is: {result.score}</div>
      ))}
    </div>
  );
};

export default Page;
