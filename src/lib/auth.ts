import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        login: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          // Your actual API call
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          if (!apiUrl) {
            return null;
          }

          const res = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              login: credentials.login,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          const decoded = jwtDecode<any>(data?.data?.token);

          if (res.ok && data?.data?.token) {
            return {
              id: data.data.user?.id || decoded.id_user,
              email: decoded?.email,
              name: decoded?.name,
              accessToken: data.data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
});
