import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function VerifyRequest({
  searchParams
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  let title: string;
  let subtitle: string | undefined;

  switch (type) {
    case "email":
      title = "Verification email sent";
      subtitle = "Please check your inbox or spam for your sign-in link.";
      break;

    default:
      title = "Sign-in request processing";
  }

  return (
    <div className="flex flex-col mx-5 text-center mt-32 items-center gap-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p>{subtitle}</p>
      <p>You can safely close this tab.</p>
      <div className="flex flex-row gap-4">
        <a href="https://mail.google.com/" className={buttonVariants()}>
          Open Gmail
        </a>

        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go to Home
        </Link>
      </div>
    </div>
  );
}
