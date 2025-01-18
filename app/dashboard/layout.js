"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import logo from "/public/assets/logo.jpeg";
import menu from "/public/assets/menu.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../Providers";
import { useEffect, useRef, useState } from "react";

const navItems = [
  {
    title: "Quizzes",
    path: "/dashboard/quizzes",
    roles: ["student", "teacher"], // Both roles have access
  },
  { title: "My Quiz", path: "/dashboard/user-quizzes", roles: "teacher" },
  { title: "Create Quiz", path: "/dashboard/create-quiz", roles: "teacher" },
  { title: "Results", path: "/dashboard/results", roles: "student" },
  // { title: "Notifications", path: "/notifications", roles: "teacher" },
  { title: "Profile", path: "/dashboard/profile", roles: "teacher" },
];

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // Initially set to null
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch user role from sessionStorage
  useEffect(() => {
    // Ensure this runs only on the client side (browser)
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("userRole");
      setUserRole(role); // Set the userRole from sessionStorage
    }
  }, [userRole]);

  // Filter navItems based on user role, only after userRole is set
  const filteredNavItems = userRole
    ? navItems.filter((item) => {
        if (item.roles) {
          return item.roles.includes(userRole); // Check if the role is allowed for the item
        } else {
          return true; // If no specific role, show the item
        }
      })
    : []; // Empty array if userRole is not set

  useEffect(() => {
    console.log("User Role:", userRole); // This should log the user role once it's set
  }, [userRole]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "http://localhost:3001/login" });
  };
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed flex flex-col justify-between z-50 bg-white shadow-md transition-all duration-700 ease-in-out ${
            sidebarOpen ? "left-0" : "xsm:-left-[255px]"
          } w-[255px] h-full p-4 flex flex-col`}
          // aria-hidden={!sidebarOpen}
          ref={sidebarRef}
        >
          <Image src={logo} alt="Logo" className="w-full h-auto" />
          <nav className="space-y-4 mt-6">
            {userRole && filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-2 rounded ${
                    pathname === item.path
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {item.title}
                </Link>
              ))
            ) : (
              <p>Loading...</p> // Show loading text if userRole is not set yet
            )}
          </nav>
          <button
            className="mt-10 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:ms-64">
          {/* Top Bar */}
          <Image
            src={menu}
            className="md:hidden w-[2rem] cursor-pointer"
            alt="Menu"
            onClick={toggleSidebar}
          />
          {/* Conditional User Greeting */}
          {/* <div className="mt-4">
            {status === "authenticated" ? (
              <p>Welcome, {session.user?.name || "User"}!</p>
            ) : (
              <p>Welcome, Guest!</p>
            )}
          </div> */}

          {/* Render Children */}
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
