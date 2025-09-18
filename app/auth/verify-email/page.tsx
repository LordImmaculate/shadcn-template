import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/auth/sign-in");
  }

  if (!code || isNaN(Number(code)) || code.length !== 6) {
    redirect("/dash");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (
    !user ||
    user.emailVerificationCode !== Number(code) ||
    !user.emailPending
  ) {
    redirect("/auth/error?error=CodeExpired");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      emailVerified: null,
      emailVerificationCode: null,
      email: user.emailPending,
      emailPending: null
    }
  });

  redirect("/dash/account?success=1&text=Email%20verified%20successfully");
}
