"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role is 'student'
  const [subjectsTaught, setSubjectsTaught] = useState("");
  const [classEnrolled, setClassEnrolled] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      setError("");
      setSuccess("");

      // Create request payload
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "teacher" && {
          subjectsTaught: subjectsTaught.split(","),
        }),
        ...(role === "student" && { class: classEnrolled }),
      };
      console.log(payload);
      // Make API request
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setError("");
        setSuccess("Signup successful!");
        router.push("/login");
      } else {
        setError(data.error || "Signup failed! Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen bg-white text-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 items-center w-full max-w-lg mt-10"
      >
        {error && <div className="error-message text-red-500">{error}</div>}
        {success && (
          <div className="success-message text-green-500">{success}</div>
        )}

        <h1 className="text-2xl font-bold">Sign Up</h1>

        <div className="w-full">
          <label className="block text-sm font-medium">Your Name</label>
          <input
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input form-control"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input form-control"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input form-control"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input form-control"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="input form-control"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "teacher" && (
          <div className="w-full">
            <label className="block text-sm font-medium">
              Subjects Taught (comma-separated)
            </label>
            <input
              type="text"
              value={subjectsTaught}
              onChange={(e) => setSubjectsTaught(e.target.value)}
              required
              className="input form-control"
            />
          </div>
        )}

        {role === "student" && (
          <div className="w-full">
            <label
              htmlFor="classEnrolled"
              className="block text-sm font-medium"
            >
              Class Enrolled
            </label>
            <select
              id="classEnrolled"
              value={classEnrolled}
              onChange={(e) => setClassEnrolled(e.target.value)}
              required
              className="input form-control"
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
              <option value="ss2 art">SS2 Art</option>
              <option value="ss2 commercial">SS2 Commercial</option>
              <option value="ss3 science">SS3 Science</option>
              <option value="ss3 art">SS3 Art</option>
              <option value="ss3 commercial">SS3 Commercial</option>
            </select>
          </div>
        )}
        <section className=" w-full ">
          Already have an account? <Link href="/login">Login</Link>
        </section>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            required
          />
          <span className="text-sm">
            I agree to the{" "}
            <a href="#" className="text-blue-500">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500">
              Terms of Use
            </a>
            .
          </span>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
