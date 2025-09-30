import { prisma } from "@/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function Admin() {
  const users = await prisma.user.findMany();
  return <DataTable columns={columns} data={users} />;
}
