import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { signIn } from "@/modules/auth/actions";

export function SignInButton() {
  return (
    <form action={signIn}>
      <Button type="submit" className="w-full">
        <HugeiconsIcon icon={GithubIcon} strokeWidth={2} data-icon="inline-start" />
        Continue with GitHub
      </Button>
    </form>
  );
}
