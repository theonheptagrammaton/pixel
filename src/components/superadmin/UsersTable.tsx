"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import {
  Table,
  TableHead,
  TableBody,
  Th,
  Td,
  Tr,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { UserWithSiteCount } from "@/types";

interface UserWithSite extends UserWithSiteCount {
  sites?: Array<{ id: string; subdomain: string; isPublished: boolean }>;
}

interface UsersTableProps {
  users: UserWithSite[];
}

const PAGE_SIZE = 20;

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.name?.toLowerCase().includes(q) ?? false)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {/* Search */}
      <div className="px-5 py-4 border-b border-zinc-200">
        <div className="max-w-sm">
          <Input
            placeholder="Kullanıcı adı, email veya isim ara..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
      </div>

      <Table>
        <TableHead>
          <tr>
            <Th>Kullanıcı</Th>
            <Th>Email</Th>
            <Th>Rol</Th>
            <Th>Site</Th>
            <Th>Kayıt</Th>
            <Th className="text-right">İşlem</Th>
          </tr>
        </TableHead>
        <TableBody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-400">
                {search ? "Sonuç bulunamadı." : "Kullanıcı yok."}
              </td>
            </tr>
          ) : (
            paginated.map((user) => {
              const site = user.sites?.[0];
              return (
                <Tr key={user.id}>
                  <Td>
                    <div>
                      <span className="font-medium text-zinc-900">{user.username}</span>
                      {user.name && <p className="text-xs text-zinc-400">{user.name}</p>}
                    </div>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge variant="default" size="sm">
                      {user.role === UserRole.SUPER_ADMIN ? "Super Admin" : "Kullanıcı"}
                    </Badge>
                  </Td>
                  <Td>
                    {site ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-zinc-600 font-mono">{site.subdomain}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${site.isPublished ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {site.isPublished ? "Yayında" : "Taslak"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-400 text-xs">—</span>
                    )}
                  </Td>
                  <Td>{formatDate(user.createdAt)}</Td>
                  <Td className="text-right">
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="secondary" size="sm">Düzenle</Button>
                    </Link>
                  </Td>
                </Tr>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="px-5 py-3 border-t border-zinc-200 flex items-center justify-between">
        <span className="text-xs text-zinc-500">
          {filtered.length} kullanıcı{search ? " bulundu" : ""}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-xs px-2.5 py-1 border border-zinc-200 rounded-md text-zinc-600 disabled:opacity-40"
            >
              ← Önceki
            </button>
            <span className="text-xs text-zinc-500">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-xs px-2.5 py-1 border border-zinc-200 rounded-md text-zinc-600 disabled:opacity-40"
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
