"use client";
import PropTypes from "prop-types";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
