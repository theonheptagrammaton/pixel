"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").split(":")[0];

interface Site {
  id: string;
  subdomain: string;
  isPublished: boolean;
  createdAt: Date;
}

interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: UserRole;
  onboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserEditFormProps {
  user: User;
  sites: Site[];
  currentAdminId: string;
}

export function UserEditForm({ user, sites, currentAdminId }: UserEditFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
    name: user.name ?? "",
    role: user.role,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isSelf = user.id === currentAdminId;

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.username.trim()) errors.username = "Kullanici adi zorunludur.";
    else if (!/^[a-z0-9_-]+$/.test(form.username))
      errors.username = "Sadece kucuk harf, rakam, - ve _ kullanilabilir.";
    if (!form.email.trim()) errors.email = "Email zorunludur.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Gecerli bir email girin.";
    return errors;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setFormLoading(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          name: form.name || null,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Bir hata olustu.");
      } else {
        setFormSuccess(true);
        router.refresh();
      }
    } catch {
      setFormError("Bir hata olustu.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("Sifre en az 6 karakter olmalidir.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPasswordError(data.error || "Bir hata olustu.");
      } else {
        setPasswordSuccess(true);
        setNewPassword("");
      }
    } catch {
      setPasswordError("Bir hata olustu.");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDeleteOpen(false);
        setFormError(data.error || "Silme islemi basarisiz.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setFormError("Bir hata olustu.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* User Info Form */}
      <Card>
        <CardHeader
          title="Kullanici Bilgileri"
          description={`ID: ${user.id}`}
        />
        <form onSubmit={handleSave}>
          <CardContent className="space-y-4">
            {formError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}
            {formSuccess && (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">Bilgiler kaydedildi.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Kullanici Adi"
                value={form.username}
                onChange={(e) => {
                  setForm((p) => ({ ...p, username: e.target.value.toLowerCase() }));
                  setFormErrors((p) => ({ ...p, username: "" }));
                }}
                error={formErrors.username}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  setFormErrors((p) => ({ ...p, email: "" }));
                }}
                error={formErrors.email}
                required
              />
            </div>
            <Input
              label="Ad Soyad"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">Rol</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({ ...p, role: e.target.value as UserRole }))
                }
                disabled={isSelf}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed"
              >
                <option value={UserRole.USER}>Kullanici</option>
                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
              </select>
              {isSelf && (
                <p className="text-xs text-zinc-500">
                  Kendi rolunuzu degistiremezsiniz.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-0.5">
                  Kayit Tarihi
                </p>
                <p className="text-sm text-zinc-700">{formatDateTime(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-0.5">
                  Son Guncelleme
                </p>
                <p className="text-sm text-zinc-700">{formatDateTime(user.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div />
            <Button type="submit" loading={formLoading}>
              Degisiklikleri Kaydet
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader
          title="Sifre Degistir"
          description="Kullanici icin yeni bir sifre belirleyin."
        />
        <form onSubmit={handlePasswordChange}>
          <CardContent className="space-y-4">
            {passwordError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{passwordError}</p>
              </div>
            )}
            {passwordSuccess && (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">Sifre guncellendi.</p>
              </div>
            )}
            <div className="max-w-sm">
              <Input
                label="Yeni Sifre"
                type="password"
                placeholder="En az 6 karakter"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                error={passwordError}
                autoComplete="new-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" loading={passwordLoading}>
              Sifre Kaydet
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Sites */}
      {sites.length > 0 && (
        <Card>
          <CardHeader
            title="Siteler"
            description={`${sites.length} site bulundu.`}
          />
          <CardContent className="p-0">
            <ul className="divide-y divide-zinc-100">
              {sites.map((site) => (
                <li key={site.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {site.subdomain}.{ROOT_DOMAIN}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatDateTime(site.createdAt)}
                    </p>
                  </div>
                  <Badge variant={site.isPublished ? "success" : "default"} size="sm">
                    {site.isPublished ? "Yayinda" : "Taslak"}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      {!isSelf && (
        <Card>
          <CardHeader title="Tehlikeli Alan" />
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  Kullaniciy Sil
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Bu islem geri alinamaz. Kullaniciya ait tum siteler de silinir.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                Kullaniciy Sil
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Kullaniciy Sil"
        message={`"${user.username}" adli kullanici ve tum siteleri kalici olarak silinecek. Bu islem geri alinamaz.`}
        confirmLabel="Evet, Sil"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
