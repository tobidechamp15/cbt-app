"use client";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <header className="p-6 text-blue-500">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Triumph College</h1>
          <nav>
            <ul className="flex space-x-6">
              <li className="hover:underline">
                <a href="#about">About</a>
              </li>
              <li className="hover:underline">
                <a href="#features">Features</a>
              </li>
              <li className="hover:underline">
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="  shadow-lg p-20 bg-blue-500 text-white  relative">
        <div className="container mx-auto text-center  ">
          <h2 className="text-4xl font-bold animate-fadeIn">
            Welcome to Triumph Scholar
          </h2>
          <p className="mt-4 text-lg animate-slideUp">
            Your go-to CBT platform for academic excellence.
          </p>
          <Link
            href="/login"
            className="mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-light-blue mb-8">
            Why Choose Triumph Scholar?
          </h3>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
              <h4 className="text-xl font-bold text-light-blue">
                Interactive Tests
              </h4>
              <p className="mt-2 text-gray-600">
                Practice and evaluate yourself with engaging CBTs designed for
                academic success.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
              <h4 className="text-xl font-bold text-light-blue">
                Performance Analytics
              </h4>
              <p className="mt-2 text-gray-600">
                Track your progress with real-time reports and insights.
              </p>
            </div>
            <div className="p-6 bg-white shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
              <h4 className="text-xl font-bold text-light-blue">
                24/7 Accessibility
              </h4>
              <p className="mt-2 text-gray-600">
                Access your CBT tests anytime, anywhere with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-blue-400 py-16 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold">Contact Us</h3>
          <p className="mt-4">
            Have questions? Reach out to us at{" "}
            <strong>info@triumphcollege.com</strong>
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-blue-500 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Now
          </button>
        </div>
      </section>
    </div>
  );
}
