import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import Logo from "@/components/logo";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Logo />
        <LoginForm />
      </div>
    </div>
  );
}
