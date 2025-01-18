import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        await dbConnect(); // Ensure MongoDB connection

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid credentials"); // Avoid exposing specific reasons
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Return user details (used to create the session)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          userName: user.userName,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Refresh every 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
    error: "/login", // Redirect to the login page on errors
  },

  callbacks: {
    async jwt({ token, user }) {
      // Only attach user data on the initial login
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      // Populate session with token data
      session.user = {
        id: token.id,
        email: token.email,
        name: session.user?.name || "", // Preserve session user's name
      };
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
