"use client";

import Loader from "@/components/Loader";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("userID");

    if (!id) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    const fetchUser = async (userId) => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        console.log(data);
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(id);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user ? (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="container mx-auto">
            {/* Header */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-gray-700">{user.name}</h1>
              <p className="text-gray-500">{user.role}</p>
              <p className="text-gray-400">{user.location}</p>
            </div>

            {/* Flexbox Layout */}
            <div className="flex flex-wrap justify-between gap-6">
              {/* Profile */}
              <div className="flex-1 min-w-[250px] max-w-sm bg-white p-6 shadow rounded-lg">
                {/* <Image
                  alt="Profile"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-pink-500"
                /> */}
                <h2 className="mt-4 text-xl font-semibold text-center">
                  {user.name}
                </h2>
                <p className="text-gray-500 text-center">{user.role}</p>
                <div className="mt-4">
                  <h3 className="text-pink-500 font-semibold">Overview</h3>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>Email: {user.email}</li>
                    <li>Subjects Taught: {user.subjectsTaught.join(", ")}</li>
                    <li>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="flex-1 min-w-[250px] max-w-sm bg-white p-6 shadow rounded-lg">
                <h3 className="text-pink-500 font-semibold text-center mb-4">
                  Stats
                </h3>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">1</p>
                    <p className="text-gray-500">Subject</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">1 Year</p>
                    <p className="text-gray-500">Experience</p>
                  </div>
                </div>
              </div>

              {/* Placeholder Graph */}
              <div className="flex-1 min-w-[250px] max-w-sm bg-white p-6 shadow rounded-lg">
                <h3 className="text-pink-500 font-semibold text-center mb-4">
                  Activity
                </h3>
                <div className="h-32 flex items-center justify-center text-gray-400">
                  Placeholder for Graph
                </div>
              </div>

              {/* Timeline */}
              <div className="flex-1 min-w-[250px] max-w-sm bg-white p-6 shadow rounded-lg">
                <h3 className="text-pink-500 font-semibold text-center mb-4">
                  Timeline
                </h3>
                <ul className="space-y-2">
                  <li>
                    <p className="text-gray-600">
                      Joined on: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                  <li>
                    <p className="text-gray-600">Teaching Physics</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No user information available</p>
      )}
    </div>
  );
}
