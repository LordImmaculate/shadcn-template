import { GitHubIcon, GoogleIcon } from "@/components/icons";

export type OAuthProvider = {
  name: "google" | "github";
  formattedName: string;
  icon: React.ReactNode;
};

export const OAuthProviders: OAuthProvider[] = [
  { name: "google", formattedName: "Google", icon: <GoogleIcon /> },
  { name: "github", formattedName: "GitHub", icon: <GitHubIcon /> }
];
