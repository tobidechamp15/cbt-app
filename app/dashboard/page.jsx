"use client";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role from sessionStorage only on the client side
    const role = sessionStorage.getItem("userRole");
    setUserRole(role); // Store the role in the state
  }, []);

  return <div>Page</div>;
};

export default Page;
