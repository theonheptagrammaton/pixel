"use client";

import { useState, useEffect, useCallback } from "react";

interface Submission {
  id: string;
  data: Record<string, string>;
  isRead: boolean;
  ipAddress: string;
  createdAt: string;
}

interface Props {
  siteId: string;
}

export function SubmissionsManager({ siteId }: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubmissions = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/sites/${siteId}/submissions?page=${p}&limit=20`
        );
        const json = await res.json();
        if (json.success && json.data) {
          setSubmissions(json.data.submissions);
          setTotalPages(json.data.totalPages);
          setTotal(json.data.total);
          setUnreadCount(json.data.unreadCount);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [siteId]
  );

  useEffect(() => {
    fetchSubmissions(page);
  }, [page, fetchSubmissions]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === submissions.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(submissions.map((s) => s.id)));
    }
  };

  const handleMarkRead = async () => {
    if (selected.size === 0) return;
    setActionLoading(true);
    try {
      await fetch(`/api/sites/${siteId}/submissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected), isRead: true }),
      });
      setSelected(new Set());
      await fetchSubmissions(page);
    } catch {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`${selected.size} mesaji silmek istediginize emin misiniz?`)) return;
    setActionLoading(true);
    try {
      await fetch(`/api/sites/${siteId}/submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      setSelected(new Set());
      // If we deleted all items on this page, go back one page
      if (submissions.length === selected.size && page > 1) {
        setPage(page - 1);
      } else {
        await fetchSubmissions(page);
      }
    } catch {
      // silently fail
    } finally {
      setActionLoading(false);
    }
  };

  const getSummary = (data: Record<string, string>) => {
    const values = Object.values(data).filter(Boolean);
    const joined = values.slice(0, 3).join(" - ");
    return joined.length > 80 ? joined.substring(0, 80) + "..." : joined;
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: "32px 0" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#18181b",
              margin: 0,
            }}
          >
            Mesajlar
          </h1>
          {unreadCount > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 22,
                height: 22,
                padding: "0 6px",
                borderRadius: 999,
                background: "#18181b",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <span style={{ fontSize: 13, color: "#71717a" }}>
          Toplam {total} mesaj
        </span>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            padding: "10px 14px",
            background: "#f4f4f5",
            borderRadius: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "#52525b", marginRight: 8 }}>
            {selected.size} secili
          </span>
          <button
            onClick={handleMarkRead}
            disabled={actionLoading}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              background: "#18181b",
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              cursor: actionLoading ? "not-allowed" : "pointer",
              opacity: actionLoading ? 0.6 : 1,
            }}
          >
            Okundu Isaretle
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              background: "#ffffff",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: 6,
              cursor: actionLoading ? "not-allowed" : "pointer",
              opacity: actionLoading ? 0.6 : 1,
            }}
          >
            Sil
          </button>
        </div>
      )}

      {/* Table */}
      {loading && submissions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: "#a1a1aa",
            fontSize: 14,
          }}
        >
          Yukleniyor...
        </div>
      ) : submissions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "64px 24px",
            color: "#a1a1aa",
            fontSize: 14,
            border: "1px solid #e4e4e7",
            borderRadius: 12,
          }}
        >
          Henuz mesaj yok.
        </div>
      ) : (
        <div
          style={{
            border: "1px solid #e4e4e7",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 140px 80px 1fr",
              gap: 0,
              padding: "10px 16px",
              background: "#f4f4f5",
              borderBottom: "1px solid #e4e4e7",
              fontSize: 11,
              fontWeight: 600,
              color: "#71717a",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={selected.size === submissions.length && submissions.length > 0}
                onChange={toggleSelectAll}
                style={{ cursor: "pointer", accentColor: "#18181b" }}
              />
            </div>
            <div>Tarih</div>
            <div>Durum</div>
            <div>Ozet</div>
          </div>

          {/* Rows */}
          {submissions.map((sub) => (
            <div key={sub.id}>
              <div
                onClick={() =>
                  setExpandedId(expandedId === sub.id ? null : sub.id)
                }
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 140px 80px 1fr",
                  gap: 0,
                  padding: "12px 16px",
                  borderBottom: "1px solid #f4f4f5",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background:
                    expandedId === sub.id
                      ? "#fafafa"
                      : !sub.isRead
                      ? "#fafafa"
                      : "#ffffff",
                  fontWeight: !sub.isRead ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    expandedId === sub.id
                      ? "#fafafa"
                      : !sub.isRead
                      ? "#fafafa"
                      : "#ffffff";
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(sub.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(sub.id)}
                    onChange={() => toggleSelect(sub.id)}
                    style={{ cursor: "pointer", accentColor: "#18181b" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#52525b",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {formatDate(sub.createdAt)}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: sub.isRead ? "#f4f4f5" : "#18181b",
                      color: sub.isRead ? "#71717a" : "#ffffff",
                    }}
                  >
                    {sub.isRead ? "Okundu" : "Yeni"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#3f3f46",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {getSummary(sub.data as Record<string, string>)}
                </div>
              </div>

              {/* Expanded detail */}
              {expandedId === sub.id && (
                <div
                  style={{
                    padding: "16px 16px 16px 56px",
                    background: "#fafafa",
                    borderBottom: "1px solid #e4e4e7",
                  }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e4e4e7",
                      borderRadius: 8,
                      padding: "16px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {Object.entries(
                      sub.data as Record<string, string>
                    ).map(([key, value]) => (
                      <div key={key}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#71717a",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {key}
                        </span>
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: 14,
                            color: "#18181b",
                            lineHeight: 1.5,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                    <div style={{ marginTop: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#a1a1aa",
                        }}
                      >
                        IP: {sub.ipAddress || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 24,
          }}
        >
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 500,
              background: "#ffffff",
              color: page <= 1 ? "#d4d4d8" : "#18181b",
              border: "1px solid #e4e4e7",
              borderRadius: 6,
              cursor: page <= 1 ? "not-allowed" : "pointer",
            }}
          >
            Onceki
          </button>
          <span style={{ fontSize: 13, color: "#71717a" }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 500,
              background: "#ffffff",
              color: page >= totalPages ? "#d4d4d8" : "#18181b",
              border: "1px solid #e4e4e7",
              borderRadius: 6,
              cursor: page >= totalPages ? "not-allowed" : "pointer",
            }}
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
}
