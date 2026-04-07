import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import type { UserRole } from "@/types/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, account, profile }) {
      const email =
        (profile && "email" in profile && profile.email) ||
        (typeof token.email === "string" ? token.email : null);
      if (account && email) {
        await connectDB();
        const picture =
          profile && "picture" in profile
            ? (profile.picture as string | undefined)
            : undefined;
        const name =
          profile && "name" in profile
            ? (profile.name as string | undefined)
            : undefined;
        const sub =
          profile && "sub" in profile
            ? (profile.sub as string)
            : account.providerAccountId;
        const dbUser = await User.findOneAndUpdate(
          { email },
          {
            $set: {
              name: name ?? token.name,
              image: picture ?? undefined,
              googleId: sub,
            },
          },
          { upsert: true, new: true }
        );
        token.role = dbUser.role;
        token.sub = dbUser._id.toString();
        token.email = email;
      } else if (email) {
        await connectDB();
        const dbUser = await User.findOne({ email });
        if (dbUser) {
          token.role = dbUser.role;
          token.sub = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? "";
        const role: UserRole =
          token.role === "admin" ? "admin" : "user";
        session.user.role = role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return;
      await connectDB();
      await User.findOneAndUpdate(
        { email: user.email },
        {
          $setOnInsert: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: "user",
          },
        },
        { upsert: true }
      );
    },
  },
});
