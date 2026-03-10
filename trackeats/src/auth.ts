import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import User from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        await connectDb();
        const email = credentials.email;
        const password = credentials.password as string;

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("No user found with this email");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // token ke ander user ka data dalta hai
    async signIn({ user, account }) {
      console.log(user);
      if (account?.provider == "google") {
        await connectDb();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        ((token.id = user.id),
          (token.name = user.name),
          (token.email = user.email),
          (token.role = user.role));
      }
      if (trigger == "update") {
        token.role = session.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        ((session.user.id = token.id as string),
          (session.user.name = token.name as string),
          (session.user.email = token.email as string));
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Keep redirects on the same origin and allow relative callback URLs.
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const targetUrl = new URL(url);
        if (targetUrl.origin === baseUrl) {
          return url;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: AUTH_SECRET,
  trustHost: true,
});
