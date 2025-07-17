import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.AUTH_KEYCLOAK_ID as string,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET as string,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Lưu access token vào JWT token khi đăng nhập lần đầu
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Thêm access token vào session để có thể sử dụng ở client
      session.accessToken = token.accessToken as string
      return session
    },
  },
}) 