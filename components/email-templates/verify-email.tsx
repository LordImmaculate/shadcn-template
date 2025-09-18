import { TypographyH1, TypographyInlineCode, TypographyP } from "../typography";
import { buttonVariants } from "../ui/button";

export function VerifyEmail({
  name,
  oldEmail,
  newEmail,
  code
}: {
  name: string;
  oldEmail: string;
  newEmail: string;
  code: number;
}) {
  return (
    <div>
      <TypographyH1>Change email for {name}</TypographyH1>
      <TypographyP>Old email: {oldEmail}</TypographyP>
      <TypographyP>New email: {newEmail}</TypographyP>
      <div className="my-4 p-4 bg-muted rounded">
        Click this button to confirm your new email address:
        <a
          href={`${process.env.DOMAIN}/auth/verify-email?code=${code}`}
          className={buttonVariants({})}
        >
          Confirm Email
        </a>
      </div>
      <TypographyP>
        If you did not request this change, please change your password
        immediately.
      </TypographyP>
    </div>
  );
}
