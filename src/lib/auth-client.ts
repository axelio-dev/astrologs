import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://4023.fr1.orionhost.xyz",
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession } = authClient;
