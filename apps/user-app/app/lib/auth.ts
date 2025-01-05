import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
const bcrypt = require("bcryptjs")

export const authOptions: NextAuthOptions = {
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

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
              number: existingUser.number,
              email: existingUser.email,
              verified: existingUser.verified,
            }
          }
          throw new Error("InvalidCreadentials");
        }
        throw new Error("InvalidCreadentials");
      },
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        let existingUser = await db.user.findFirst({
          where: { email: profile.email },
        });

        if (!existingUser) {
          // Create a new user if not found
          existingUser = await db.user.create({
            data: {
              email: profile.email,
              name: profile.name || "Google User",
              number: "",
              password: "",
              verified: true,
            },
          });
        }

        user.id = existingUser.id;
        user.verified = existingUser.verified;
        user.number = existingUser.number;
      }

      return true;
    },
    async jwt({ token, trigger, user, session }: any) {
      // Handle token update when session is triggered with "update"
      if (trigger === "update" && session?.verified !== undefined) {
        token.verified = session.verified;
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.number = user.number;
        token.email = user.email;
        token.verified = user.verified;
      }

      return token;
    },
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: Number(token.id),
          name: token.name,
          number: token.number,
          email: token.email,
          verified: token.verified,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl, token }: any) {

      if (token?.verified === false) {
        return `${baseUrl}/signup/signupverify`;
      }
      return url;
    },

  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};
