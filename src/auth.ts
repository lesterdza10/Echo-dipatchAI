import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"
import { connectDB } from "./lib/db"
import User from "./models/usermodel"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password", placeholder: "Your password" },
      },
      authorize: async (credentials, request) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }
          const email = credentials.email;
          const password = credentials.password as string;
          await connectDB()
          const user = await User.findOne({ email })
          if (!user) {
            throw new Error("No user found with this email")
          }
          if (!user.password) {
            throw new Error("This account uses Google Sign-In. Please sign in with Google.")
          }
          const isPasswordValid = await bcrypt.compare(password, user.password || "")
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          }
        } catch (error: any) {
          console.error("Authorization error:", error.message);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      console.log("User authenticated: true", { user, provider: account?.provider });
      if (account?.provider === "google") {
        await connectDB();
        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: user.name as string,
            email: user.email as string,
            password: "",
          });
          existingUser = newUser;
        }
        user.id = existingUser._id.toString();
        user.name = existingUser.name;
        user.email = existingUser.email;
        (user as any).role = existingUser.role || "user";
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        console.log("JWT token created/updated for user:", user.email);
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role || "user";
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = (token.role as string) || "user";
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};