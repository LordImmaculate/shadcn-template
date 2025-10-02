import { prisma } from "@/prisma";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { checkAuthAdmin } from "@/lib/check-auth";

const USERS_PER_PAGE = 20;

export default async function Admin({
  searchParams
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const session = await auth();
  if (!checkAuthAdmin(session)) redirect("/dash");

  const currentPage = parseInt((await searchParams).page || "1");
  const filter = (await searchParams).filter || "";
  if (isNaN(currentPage) || currentPage < 1)
    redirect("/dash/admin/user?page=1");

  const offset = (currentPage - 1) * USERS_PER_PAGE;

  const userCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    take: USERS_PER_PAGE,
    skip: offset,
    where: { email: { contains: filter } },
    orderBy: { createdAt: "desc" }
  });

  const totalPages = Math.ceil(userCount / USERS_PER_PAGE);

  return (
    <DataTable
      columns={columns}
      data={users}
      userCount={userCount}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
