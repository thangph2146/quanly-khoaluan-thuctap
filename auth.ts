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
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours (same as Keycloak tokens)
  },
  secret: process.env.AUTH_SECRET,
  // Bỏ trang signin tùy chỉnh - để NextAuth tự động redirect đến Keycloak
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.id_token = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async redirect({ url, baseUrl }) {
      // Sau khi đăng nhập thành công -> về trang chủ
      if (url === baseUrl) {
        return baseUrl;
      }
      
      // Sau khi đăng xuất -> trang chủ  
      if (url.includes('/auth/signin')) {
        return baseUrl;
      }
      
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // Mặc định về trang chủ
      return baseUrl;
    },
  },
}) 