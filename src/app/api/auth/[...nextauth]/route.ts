import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { User } from "@/types";

// Hardcoded users for demo purposes
const users = [
  {
    id: "1",
    email: "admin@panthera.com",
    name: "Admin User",
    password: "password123",
    role: "admin",
    avatar: "",
  },
  {
    id: "2",
    email: "analyst@panthera.com",
    name: "Analyst User",
    password: "password123",
    role: "analyst",
    avatar: "",
  },
  {
    id: "3",
    email: "viewer@panthera.com",
    name: "Viewer User",
    password: "password123",
    role: "viewer",
    avatar: "",
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user with matching email
        const user = users.find((user) => user.email === credentials.email);

        // Check if user exists and password matches
        if (user && user.password === credentials.password) {
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword as any;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to token if available
      if (user) {
        token.role = (user as unknown as User).role;
        token.id = (user as unknown as User).id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session user
      if (session.user) {
        session.user.role = token.role as "admin" | "analyst" | "viewer";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
