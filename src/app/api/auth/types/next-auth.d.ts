// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {

  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
    } & DefaultSession["user"];
  }

 
  interface User {
    id: number;
    name: string;
    email: string;
    // password: string;
    
  }
}

declare module "next-auth/jwt" {
 
  interface JWT extends DefaultJWT {
    sub: number;
  }
}
