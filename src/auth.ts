import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from "./lib/db"
import User from "./models/usermodel"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "Email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password",placeholder: "Your password" },
      },
      authorize: async (credentials,request) => {
        if(!credentials.email || !credentials.password) {
            throw new Error("Email and password are required")
        }
        const email=credentials.email;
        const password=credentials.password as string;
        await connectDB() // Ensure DB connection is established before authorization logic
        const user=await User.findOne({email})
        if(!user) {
            throw new Error("No user found with this email")
        }
        const isPasswordValid=await bcrypt.compare(password,user.password)
        if(!isPasswordValid) {
            throw new Error("Invalid password")
        }
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account}){
        if (account?.provider === "google") {
            await connectDB();
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
              await User.create({
                name: user.name as string,
                email: user.email as string,
              });
            }
            user.id=existingUser?._id.toString() || user.id;
            user.role=existingUser?.role || "user";
        }
        
        return true;
    },

    jwt: async ({ token, user }) => {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      
      return token;
    
  },
  async session({ session, token }) {
    if(session.user){
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
    }
      return session;

   }
  },
  pages: {
    signIn: "/sigin",
    error: "/sigin",
    },
    session: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    

});