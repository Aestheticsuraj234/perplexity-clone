import { SignInButton } from "@/modules/auth/components/sign-in-button";

export default function SignInPage() {
  return (
    <div className="space-y-6 rounded-xl border bg-card p-8">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Perplexity
        </p>
      </div>

      <SignInButton />
    </div>
  );
}
