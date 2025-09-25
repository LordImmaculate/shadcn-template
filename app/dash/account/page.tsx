import { auth } from "@/auth";
import Form from "./form";

export default async function Dash() {
  const session = await auth();

  // This page is just to get the data of the user and then pass it to the client component, so the loading is way smoother.
  return (
    <Form
      name={session?.user?.name || ""}
      email={session?.user?.email || ""}
      pfpURLServer={
        session?.user?.image
          ? `/uploads/${session?.user?.image}`
          : "/default.jpg"
      }
    />
  );
}
