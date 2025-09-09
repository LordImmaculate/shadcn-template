import { auth } from "@/auth";
import { TypographyH1, TypographyH2 } from "@/components/typography";

export default async function Dash() {
  const session = await auth();
  if (!session || !session.user) return null;

  return (
    <div>
      <TypographyH1 className="mb-4">Account Management</TypographyH1>
      <TypographyH2 className="mb-2">User Information</TypographyH2>
      <span>
        Email: <code>{session.user.email}</code>
      </span>
    </div>
  );
}
