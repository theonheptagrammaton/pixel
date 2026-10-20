"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Tum alanlari doldurun.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Kullanici adi veya sifre hatali.");
      } else {
        const session = await getSession();
        const dest = session?.user?.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
        router.push(dest);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.svg" alt="Pixel" className="h-8 w-8" />
          <span className="text-xl font-bold text-zinc-900">Pixel</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-zinc-900">Giris Yap</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Hesabiniza erisim saglayin
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Kullanici Adi"
              type="text"
              placeholder="Kullanici adinizi girin"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
            <Input
              label="Sifre"
              type="password"
              placeholder="Sifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Giris Yap
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
