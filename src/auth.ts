import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    // 初回ログイン時、Googleから返る account.id_token を JWT に保存
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        // GoogleのIDトークン（バックエンド検証用）
        token.idToken = account.id_token;
        // ついでに email も入れておくと便利
        // token.email = token.email ?? (profile?.email ?? undefined);
      }
      return token;
    },

    // JWT に入れた idToken を session に載せる（クライアント側で取り出すため）
    async session({ session, token }) {
      (session as any).idToken = (token as any).idToken;
      return session;
    },
  },
});
