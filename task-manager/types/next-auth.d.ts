import NextAuth, { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User {
    rolId: number; 
  }

  interface Session {
    user: User;
  }
}
