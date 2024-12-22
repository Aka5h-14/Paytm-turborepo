import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
const bcrypt = require("bcryptjs")
import { NextAuthOptions } from "next-auth";

export const authOptions:  NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        password: { label: "Password", type: "password", required: true }
      },
      // TODO: User credentials type from next-aut
      async authorize(credentials: any) {
        const existingUser = await db.user.findFirst({
          where: {
            number: credentials.phone
          }
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.email,
                verified: existingUser.verified,
              }
          }
          return null;
        }

        return null
      },
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.verified = user.verified;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        if (token.verified) {
          session.user = {
            id: Number(token.id),
            name: token.name,
            email: token.email,
            verified: token.verified,
          };
        }
      }
      return session;
    },
  },  
  pages: {
    signIn: "/auth/signin", // Optional: Custom sign-in page if needed
    error: "/auth/error"
  },
};
