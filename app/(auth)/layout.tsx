import { requireUnauth } from "@/modules/auth/actions";

export default async function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    await requireUnauth();
  
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    );
  }
  