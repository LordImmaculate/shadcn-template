"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Role, User } from "@prisma/client";
import { changeUserRole } from "./actions";
import { toast } from "sonner";

export default function RoleSelector({ user }: { user: User }) {
  async function handleChange(newRole: Role) {
    const result = await changeUserRole(user.id, newRole);
    if (result.type === "success") toast.success(result.message);
    else toast.error(`Error: ${result.message}`);
  }
  return (
    <Select defaultValue={user.role} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Role" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(Role).map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
