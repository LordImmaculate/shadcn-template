import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function AuthError({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  let errorMessage;
  switch (error) {
    case "OAuthSignin":
      errorMessage = "There was an issue with your provider. Please try again.";
      break;
    case "OAuthAccountNotLinked":
      errorMessage = "This email is already associated with another account.";
      break;
    case "CredentialsSignin":
      errorMessage =
        "Invalid credentials. Please check your username and password.";
      break;
    case "EmailSignin":
      errorMessage =
        "The email address is not recognized. Please try a different one.";
      break;
    case "Verification":
      errorMessage =
        "The magic link has expired or is invalid. Please request a new one.";
      break;
    case "CodeExpired":
      errorMessage =
        "This verification code has expired or does not exist. Please request a new one.";
      break;
    case "AccessDenied":
      errorMessage = "Access denied. You do not have permission to sign in.";
      break;
    default:
      errorMessage = "An unexpected error occurred. Please try again later.";
  }

  return (
    <div className="flex flex-col mx-5 text-center mt-32 items-center gap-4">
      <h1 className="text-3xl font-bold">{errorMessage}</h1>
      <p className="text-center">
        There was an error during the authentication process. Please try again.
      </p>
      <div className="flex flex-row gap-4">
        <Link href="/auth/sign-in" className={buttonVariants()}>
          Go to Sign In
        </Link>

        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}
