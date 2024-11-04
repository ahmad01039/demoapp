
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../../lib/dbClient"; 
import bcrypt from "bcrypt";
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
      
        const { email, password } = credentials as { email: string; password: string };
        const res = await client.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  secret: "secret-key", 
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
    updateAge: 24 * 60 * 60, 
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, 
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub as number,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = Number(user.id);
      }
      return token;
    },
  },
};
const handler = async (req:NextApiRequest, res:NextApiResponse) => {
  return await NextAuth(req, res, authOptions);
};
export default handler;

export { handler as GET, handler as POST };