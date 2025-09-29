import NumberBlock from "@/components/number-block";
import { prisma } from "@/prisma";

export default async function Dash() {
  const users = await prisma.user.count();

  return (
    <div>
      <NumberBlock number={users} label={users === 1 ? "User" : "Users"} />
    </div>
  );
}
