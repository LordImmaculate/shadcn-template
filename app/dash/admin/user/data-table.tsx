"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userCount,
  userCountFiltered,
  currentPage,
  totalPages
}: DataTableProps<TData, TValue> & {
  userCount: number;
  userCountFiltered: number;
  currentPage: number;
  totalPages: number;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("filter") || "");

  useEffect(() => {
    if (Number(searchParams.get("page")) > totalPages && totalPages > 0) {
      router.push(`/dash/admin/user?page=${totalPages}&filter=${filter}`);
    }
  }, [searchParams, totalPages, router, filter]);

  function handleFilter(formData: FormData) {
    const name = formData.get("filter") || "";
    router.push(`/dash/admin/user?page=${currentPage}&filter=${name}`);
  }

  const backDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;
  const filteredOut = userCount - userCountFiltered;

  return (
    <div>
      <form
        action={handleFilter}
        className="flex items-center justify-between py-4"
      >
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          name="filter"
          placeholder="Filter by name or email..."
          className="max-w-[300px]"
        />
        <Button type="submit" className="ml-4" variant="outline">
          Apply Filter
        </Button>
        <span className="flex-1 text-center">
          Showing {data.length} of {userCountFiltered} users{" "}
          {filteredOut > 0 && `(${userCount} total)`} (Page {currentPage} of{" "}
          {totalPages})
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/dash/admin/user?page=${currentPage - 1}&filter=${filter}`}
            className={
              buttonVariants({
                variant: "outline",
                size: "sm"
              }) + (backDisabled && " pointer-events-none opacity-50")
            }
          >
            Previous
          </Link>
          <Link
            href={`/dash/admin/user?page=${currentPage + 1}&filter=${filter}`}
            className={
              buttonVariants({
                variant: "outline",
                size: "sm",
                ...(currentPage >= totalPages && { disabled: true })
              }) + (nextDisabled && " pointer-events-none opacity-50")
            }
          >
            Next
          </Link>
        </div>
      </form>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
