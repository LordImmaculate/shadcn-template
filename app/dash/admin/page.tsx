import { auth } from "@/auth";
import NumberBlock from "@/components/number-block";
import { prisma } from "@/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await auth();
  const users = await prisma.user.count();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  if (!session || !user || user.role !== "ADMIN") {
    redirect("/dash");
  }

  return (
    <div className="p-4">
      <Link href="/dash/admin/user" className="text-lg font-medium mb-4 block">
        <NumberBlock
          className="cursor-pointer hover:bg-accent transition"
          number={users}
          label={users === 1 ? "User" : "Users"}
        />
      </Link>
    </div>
  );
}
