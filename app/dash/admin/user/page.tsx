import { prisma } from "@/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  if (!session || !user || user.role !== "ADMIN") {
    redirect("/dash");
  }

  const users = await prisma.user.findMany();
  return <DataTable columns={columns} data={users} />;
}
