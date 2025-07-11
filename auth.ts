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
}) 