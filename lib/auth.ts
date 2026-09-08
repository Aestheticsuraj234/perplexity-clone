import db from "@/drizzle";
import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "@/drizzle/schemas/auth-schema";
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", 
        schema: {
          user: user,
          session: session,
          account: account,
          verification: verification,
        },
    }),

    socialProviders: { 
        github: { 
          clientId: process.env.GITHUB_CLIENT_ID as string, 
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
      }, 

      plugins:[nextCookies()]
});