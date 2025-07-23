import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/types";
import { sign } from "jsonwebtoken";

// Validation schema for login request
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Hardcoded users for demo purposes
const users = [
  {
    id: "1",
    email: "admin@panthera.com",
    name: "Admin User",
    password: "password123",
    role: "admin" as const,
    avatar: "",
  },
  {
    id: "2",
    email: "analyst@panthera.com",
    name: "Analyst User",
    password: "password123",
    role: "analyst" as const,
    avatar: "",
  },
  {
    id: "3",
    email: "viewer@panthera.com",
    name: "Viewer User",
    password: "password123",
    role: "viewer" as const,
    avatar: "",
  },
];

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password format" },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user with matching email
    const user = users.find((user) => user.email === email);

    // Check if user exists and password matches
    if (user && user.password === password) {
      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = user;

      // Create JWT token
      const token = sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key-change-in-production",
        { expiresIn: "7d" }
      );

      // Return success response with token and user data
      return NextResponse.json({
        success: true,
        data: {
          token,
          user: userWithoutPassword,
        },
      });
    }

    // Return error for invalid credentials
    return NextResponse.json(
      { success: false, error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
