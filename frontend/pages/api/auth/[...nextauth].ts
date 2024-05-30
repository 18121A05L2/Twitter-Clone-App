import NextAuth from "next-auth";
import { OAuthUserConfig } from "next-auth/providers";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as OAuthUserConfig<GoogleProfile>),
    // ...add more providers here
  ],
  pages: {
    signIn: "/auth/signin",
  },

  // callbacks: {
  //   async session({ session, token, user }) {

  //     session.user.userid = token.sub

  //     return session

  //     }
  //   }
};

export default NextAuth(authOptions);
