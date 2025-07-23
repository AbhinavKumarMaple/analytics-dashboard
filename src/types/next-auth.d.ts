import "next-auth";
import { User as AppUser } from "@/types";

declare module "next-auth" {
  interface User extends Omit<AppUser, "avatar"> {
    avatar?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: "admin" | "analyst" | "viewer";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "analyst" | "viewer";
  }
}
