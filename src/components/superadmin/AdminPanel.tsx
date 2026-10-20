"use client";

import { useState } from "react";

interface UserItem {
  id: string;
  username: string;
  name: string | null;
  phone: string;
  createdAt: string;
  subdomain: string | null;
}

interface AdminPanelProps {
  users: UserItem[];
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
}

export function AdminPanel({ users: initialUsers }: AdminPanelProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<UserItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create form
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createName, setCreateName] = useState("");

  // Edit form
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.name?.toLowerCase().includes(q) ?? false)
    );
  });

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function handleCreate() {
    if (!createUsername.trim() || !createPassword.trim()) {
      setError("Kullanici adi ve sifre zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: createUsername.toLowerCase(),
          password: createPassword,
          name: createName || undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Olusturma basarisiz.");
        return;
      }
      // Add to list
      const newUser: UserItem = {
        id: json.data.user.id,
        username: json.data.user.username,
        name: json.data.user.name,
        phone: json.data.user.phone || "",
        createdAt: new Date().toISOString(),
        subdomain: null,
      };
      setUsers((prev) => [newUser, ...prev]);
      setShowCreateModal(false);
      setCreateUsername("");
      setCreatePassword("");
      setCreateName("");
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(user: UserItem) {
    setEditUsername(user.username);
    setEditPassword("");
    setEditName(user.name || "");
    setShowEditModal(user);
    setError("");
  }

  async function handleEdit() {
    if (!showEditModal) return;
    if (!editUsername.trim()) {
      setError("Kullanici adi zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body: Record<string, string> = {
        username: editUsername.toLowerCase(),
        name: editName,
      };
      if (editPassword.trim()) body.password = editPassword;

      const res = await fetch(`/api/users/${showEditModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Guncelleme basarisiz.");
        return;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === showEditModal.id
            ? { ...u, username: editUsername.toLowerCase(), name: editName || null }
            : u
        )
      );
      setShowEditModal(null);
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Silme basarisiz.");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setShowDeleteModal(null);
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-zinc-900">Kullanici Yonetimi</h2>
        <button
          onClick={() => { setShowCreateModal(true); setError(""); }}
          className="bg-zinc-900 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Yeni Kullanici Ekle
        </button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <input
          type="text"
          placeholder="Kullanici ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Kullanici Adi</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Ad Soyad</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Telefon</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Site</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Kayit Tarihi</th>
              <th className="text-right px-4 py-3 font-semibold text-zinc-600">Islemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-400">
                  {search ? "Sonuc bulunamadi." : "Kullanici yok."}
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{user.username}</td>
                  <td className="px-4 py-3 text-zinc-600">{user.name || "-"}</td>
                  <td className="px-4 py-3 text-zinc-500">{user.phone || "-"}</td>
                  <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{user.subdomain || "-"}</td>
                  <td className="px-4 py-3 text-zinc-500">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(user)}
                        title="Duzenle"
                        className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => { setShowDeleteModal(user.id); setError(""); }}
                        title="Sil"
                        className="p-1.5 rounded hover:bg-red-50 text-zinc-500 hover:text-red-600 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-zinc-200 text-xs text-zinc-500">
          {filtered.length} kullanici{search ? " bulundu" : ""}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center text-sm text-zinc-400">
            {search ? "Sonuc bulunamadi." : "Kullanici yok."}
          </div>
        ) : (
          filtered.map((user) => (
            <div key={user.id} className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-zinc-900">{user.username}</p>
                  {user.name && <p className="text-sm text-zinc-500">{user.name}</p>}
                  {user.phone && <p className="text-xs text-zinc-400">{user.phone}</p>}
                </div>
                {user.subdomain && (
                  <span className="text-xs font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                    {user.subdomain}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mb-3">{formatDate(user.createdAt)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="flex-1 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded px-3 py-2 transition-colors"
                >
                  Duzenle
                </button>
                <button
                  onClick={() => { setShowDeleteModal(user.id); setError(""); }}
                  className="flex-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded px-3 py-2 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
        <p className="text-xs text-zinc-500">
          {filtered.length} kullanici{search ? " bulundu" : ""}
        </p>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Yeni Kullanici Ekle</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Kullanici Adi *</label>
              <input
                type="text"
                value={createUsername}
                onChange={(e) => setCreateUsername(e.target.value.toLowerCase())}
                placeholder="kullaniciadi"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Sifre *</label>
              <input
                type="text"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="Sifre"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Ad Soyad (istege bagli)"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md px-4 py-2 transition-colors"
            >
              Iptal
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-md px-4 py-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Olusturuluyor..." : "Olustur"}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(null)}>
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Kullaniciyi Duzenle</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Kullanici Adi</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Yeni Sifre</label>
              <input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Degistirmek icin yeni sifre girin"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ad Soyad"
                className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm outline-none focus:border-zinc-400"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setShowEditModal(null)}
              className="flex-1 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md px-4 py-2 transition-colors"
            >
              Iptal
            </button>
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex-1 text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-md px-4 py-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(null)}>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Kullaniciyi Sil</h3>
          <p className="text-sm text-zinc-600 mb-4">
            Bu kullaniciyi silmek istediginizden emin misiniz?
          </p>
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(null)}
              className="flex-1 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-md px-4 py-2 transition-colors"
            >
              Iptal
            </button>
            <button
              onClick={() => handleDelete(showDeleteModal)}
              disabled={loading}
              className="flex-1 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md px-4 py-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Siliniyor..." : "Sil"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
