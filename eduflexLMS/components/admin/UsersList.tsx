"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

interface Props {
  role?: "teacher" | "student";
}

export default function UsersList({ role }: Props) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = role ? `?role=${role}` : "";
        const res = await api.get(`/admin/users${query}`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [role]);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
