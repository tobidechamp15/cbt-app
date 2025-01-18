"use client";
import { useState } from "react";
import Image from "next/image";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        setLoader(false);
        return;
      }

      setSuccess("Login Successful");
      const session = await getSession();
      console.log("Logged-in User Details:", session.user);
      sessionStorage.setItem("userID", session.user.id);
      fetchUser(session.user.id);
      router.push("/dashboard/quizzes");
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoader(false);
      router.push("/login");
    }
  };
  const fetchUser = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await res.json();
      console.log(data);
      sessionStorage.setItem("userRole", data.role);
      // setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-r from-[#c7e0e5] to-[#e1f5f8]">
      <div className="hidden md:flex w-1/2 justify-center items-center"></div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 space-y-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
        <p className="text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            Sign Up
          </Link>
        </p>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded-md text-center">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-2 rounded-md text-center">
            <p>{success}</p>
          </div>
        )}

        <div className="w-full space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-300"
          disabled={loader}
        >
          {loader ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
