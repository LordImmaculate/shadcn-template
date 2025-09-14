import { TypographyH1, TypographyInlineCode, TypographyP } from "../typography";

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
      <TypographyP>
        Verification code: <TypographyInlineCode>{code}</TypographyInlineCode>
      </TypographyP>
      <TypographyP>
        If you did not request this change, please change your password
        immediately.
      </TypographyP>
    </div>
  );
}
