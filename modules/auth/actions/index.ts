"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    return session?.user ?? null;
  }

  export async function requireAuth() {
    const user = await getCurrentUser();
  
    if (!user) {
      redirect("/sign-in");
    }
  
    return user;
  }

  export async function requireUnauth() {
    const user = await getCurrentUser();
  
    if (user) {
      redirect("/");
    }
  }
  
  export async function signIn() {
    const result = await auth.api.signInSocial({
      body: {
        provider: "github",
        callbackURL: "/",
      },
      headers: await headers(),
    });
  
    if (result.url) {
      redirect(result.url);
    }
  }

  export async function signOut() {
    await auth.api.signOut({
      headers: await headers(),
    });
  
    redirect("/sign-in");
  }
  