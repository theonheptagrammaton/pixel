"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP ?? "";

interface SiteData {
  id: string;
  subdomain: string;
  customDomain: string | null;
  domainVerified: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  templateId: string;
}

interface Props {
  site: SiteData | null;
  templateName: string | null;
}

type Tab = "info" | "domain" | "danger";

export function SettingsTabs({ site, templateName }: Props) {
  const [tab, setTab] = useState<Tab>("info");

  const tabs: { key: Tab; label: string }[] = [
    { key: "info", label: "Site Bilgileri" },
    { key: "domain", label: "Domain" },
    { key: "danger", label: "Tehlikeli Bölge" },
  ];

  if (!site) {
    return (
      <div className="bg-white border border-zinc-200 border-dashed rounded-lg p-12 text-center">
        <p className="text-sm text-zinc-500 mb-4">Henüz bir siteniz yok.</p>
        <Link
          href="/templates"
          className="inline-flex items-center justify-center bg-black text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Şablon Seç
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-zinc-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-black text-zinc-900"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && <InfoTab site={site} templateName={templateName} />}
      {tab === "domain" && <DomainTab site={site} />}
      {tab === "danger" && <DangerTab site={site} />}
    </div>
  );
}

/* ── Info Tab ──────────────────────────────────────── */
function InfoTab({ site, templateName }: { site: SiteData; templateName: string | null }) {
  const fmt = (d: Date) =>
    new Date(d).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
      {[
        { label: "Domain", value: site.customDomain ?? "Baglanmamis" },
        { label: "Durum", value: site.isPublished ? "Yayinda" : "Taslak" },
        { label: "Sablon", value: templateName ?? site.templateId },
        { label: "Olusturulma", value: fmt(site.createdAt) },
        { label: "Son Guncelleme", value: fmt(site.updatedAt) },
      ].map((row) => (
        <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm text-zinc-500">{row.label}</span>
          <span className={`text-sm font-medium ${row.label === "Durum" ? (site.isPublished ? "text-green-600" : "text-yellow-600") : "text-zinc-900"}`}>
            {row.value}
          </span>
        </div>
      ))}
      <div className="px-5 py-4">
        <Link
          href="/editor"
          className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors"
        >
          Editörü Aç
        </Link>
      </div>
    </div>
  );
}

/* ── Domain Tab ──────────────────────────────────────── */
function DomainTab({ site }: { site: SiteData }) {
  const router = useRouter();
  const [domain, setDomain] = useState(site.customDomain ?? "");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dnsResult, setDnsResult] = useState<{
    dnsVerified: boolean;
    domainActive: boolean;
  } | null>(null);

  async function handleSetDomain() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/sites/${site.id}/domain`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim().toLowerCase() }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Hata");
        return;
      }
      setSuccess("Domain kaydedildi. Simdi DNS ayarlarinizi yapin ve dogrulayin.");
      router.refresh();
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    setError("");
    setSuccess("");
    setDnsResult(null);
    try {
      const res = await fetch(`/api/sites/${site.id}/domain`);
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Hata");
        return;
      }
      setDnsResult(json.data);
      if (json.data.domainActive) {
        setSuccess("DNS dogrulandi! Domainiz artik aktif.");
        router.refresh();
      }
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/sites/${site.id}/domain`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error ?? "Hata");
        return;
      }
      setDomain("");
      setDnsResult(null);
      router.refresh();
    } catch {
      setError("Sunucu hatasi.");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
          {success}
        </p>
      )}

      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <p className="text-sm font-semibold text-zinc-900 mb-1">
          Domain
        </p>

        {site.customDomain ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-zinc-700">
                {site.customDomain}
              </span>
              {site.domainVerified ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  Aktif
                </span>
              ) : (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  DNS Bekleniyor
                </span>
              )}
            </div>

            {/* DNS Instructions — show when not yet verified */}
            {!site.domainVerified && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800 space-y-3">
                <p className="font-medium">DNS Ayarlari</p>
                <p>
                  Domain saglayicinizin DNS yonetim paneline gidin ve asagidaki kaydi ekleyin:
                </p>
                <div className="font-mono text-xs bg-white border border-blue-200 rounded p-3 space-y-2">
                  {SERVER_IP ? (
                    <div>
                      <p className="text-blue-600 mb-1">A Kaydi:</p>
                      <p>
                        <strong>Ad:</strong> @ (veya {site.customDomain})
                      </p>
                      <p>
                        <strong>Deger:</strong> {SERVER_IP}
                      </p>
                    </div>
                  ) : (
                    <p className="text-yellow-700">
                      Sunucu IP adresi yapilandirilmamis. Yoneticinizle iletisime gecin.
                    </p>
                  )}
                </div>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>1. Domain saglayicinizda (Cloudflare, GoDaddy vb.) DNS ayarlarina gidin</p>
                  <p>2. Yukaridaki A kaydini ekleyin</p>
                  <p>3. DNS degisiklikleri yayilmasi birkaç dakika ile 24 saat arasinda surebilir</p>
                  <p>4. DNS yayildiktan sonra asagidaki &quot;DNS Dogrula&quot; butonuna tiklayin</p>
                </div>
              </div>
            )}

            {/* DNS check result message */}
            {dnsResult && !dnsResult.domainActive && (
              <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-md px-4 py-3">
                DNS kaydi henuz bulunmadi. DNS ayarlarinizin dogru yapildigindan
                emin olun ve birkaç dakika bekleyip tekrar deneyin.
              </p>
            )}

            <div className="flex gap-2">
              {!site.domainVerified && (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {verifying ? "Kontrol Ediliyor..." : "DNS Dogrula"}
                </button>
              )}
              <button
                onClick={handleRemove}
                disabled={removing}
                className="text-sm font-medium px-4 py-2 border border-red-300 text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
              >
                {removing ? "Kaldiriliyor..." : "Domaini Kaldir"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <p className="text-sm text-zinc-500">
              Kendi alan adinizi sitenize baglayabilirsiniz. Ornegin: <span className="font-mono">mycafe.com</span>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="ornek.com"
                className="flex-1 border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleSetDomain}
                disabled={loading || !domain.trim()}
                className="text-sm font-medium px-4 py-2 bg-black text-white rounded-md hover:bg-zinc-800 disabled:opacity-50 transition-colors"
              >
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Danger Tab ──────────────────────────────────────── */
function DangerTab({ site }: { site: SiteData }) {
  const router = useRouter();
  const [showReset, setShowReset] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    setLoadingReset(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${site.id}/reset`, { method: "PUT" });
      const json = await res.json();
      if (!json.success) { setError(json.error ?? "Hata"); return; }
      setShowReset(false);
      router.refresh();
    } catch { setError("Sunucu hatası."); }
    finally { setLoadingReset(false); }
  }

  async function handleDelete() {
    if (deleteConfirm !== "SİL") return;
    setLoadingDelete(true);
    setError("");
    try {
      const res = await fetch(`/api/sites/${site.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) { setError(json.error ?? "Hata"); return; }
      router.push("/templates");
    } catch { setError("Sunucu hatası."); }
    finally { setLoadingDelete(false); }
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">{error}</p>
      )}

      {/* Reset */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-zinc-900 mb-1">Siteyi Sıfırla</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Site içeriği şablonun varsayılan değerlerine döner. Bu işlem geri alınamaz.
        </p>
        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="text-sm font-medium text-orange-600 border border-orange-300 bg-orange-50 px-4 py-2 rounded-md hover:bg-orange-100 transition-colors"
          >
            Siteyi Sıfırla
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setShowReset(false)} className="text-sm px-4 py-2 border border-zinc-200 rounded-md text-zinc-600">İptal</button>
            <button
              onClick={handleReset}
              disabled={loadingReset}
              className="text-sm font-semibold px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {loadingReset ? "Sıfırlanıyor…" : "Evet, Sıfırla"}
            </button>
          </div>
        )}
      </div>

      {/* Delete */}
      <div className="bg-white border border-red-200 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-red-700 mb-1">Siteyi Sil</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Site kalıcı olarak silinir. Bu işlem geri alınamaz.
        </p>
        {!showDelete ? (
          <button
            onClick={() => setShowDelete(true)}
            className="text-sm font-medium text-red-600 border border-red-300 bg-red-50 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
          >
            Siteyi Sil
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-zinc-700">
              Devam etmek için aşağıya <strong>SİL</strong> yazın:
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SİL"
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-2">
              <button onClick={() => { setShowDelete(false); setDeleteConfirm(""); }} className="text-sm px-4 py-2 border border-zinc-200 rounded-md text-zinc-600">İptal</button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "SİL" || loadingDelete}
                className="text-sm font-semibold px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loadingDelete ? "Siliniyor…" : "Kalıcı Olarak Sil"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
