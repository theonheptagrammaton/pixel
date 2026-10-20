"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000").split(":")[0];
import { Badge } from "@/components/ui/Badge";
import { SECTION_ICON_PATHS, SECTION_LABELS } from "@/lib/section-icons";
import { SectionType } from "@/types/template";

type TabKey = "baslangic" | "editor" | "bolumler" | "yayimlama" | "ayarlar";

const TABS = [
  { key: "baslangic", label: "Hizli Baslangic" },
  { key: "editor",    label: "Editor"           },
  { key: "bolumler",  label: "Bolumler"         },
  { key: "yayimlama", label: "Yayimlama"        },
  { key: "ayarlar",   label: "Ayarlar"          },
];

// ── Hızlı Başlangıç ──────────────────────────────────────────────────────────

const BASLANGIC_STEPS = [
  {
    number: 1,
    title: "Kayit Olun",
    description:
      "Pixel'a ucretsiz kayit olun. Ad, kullanici adi ve sifre bilgilerinizi girerek hesap olusturun. Ilk giriste kisa bir karsilama sihirbazi isletme adinizi sorar ve sizi dashboarda yonlendirir.",
  },
  {
    number: 2,
    title: "Sablon Secin",
    description:
      "Sablonlar sayfasindan isletme turune uygun bir sablon secin. 8 hazir sablon mevcuttur: Flavor (restoran), Vertex (kurumsal ajans), Showcase (portfolyo), Bloom (guzellik/spa), Pulse (spor/fitness), Craft (blog), Zenith (otel), Forge (teknoloji). Sablon secimiyle site otomatik olusturulur ve editore yonlendirilirsiniz.",
  },
  {
    number: 3,
    title: "Icerik Duzenleyin",
    description:
      "Editorde sol panelden bir bolum secin. Ortadaki form alanlarina metin, gorsel ve link bilgilerinizi girin. Sag panelde canli onizleme aninda guncellenir. Ctrl + S ile tum degisikliklerinizi kaydedin.",
  },
  {
    number: 4,
    title: "Genel Ayarlari Yapin",
    description:
      "Sol panelin altindaki Genel Ayarlar dugmesine tiklayin. Isletme adi, logo, iletisim bilgileri, sosyal medya linkleri, marka renkleri, font secimi ve SEO bilgilerini buradan ayarlayin. Bu ayarlar tum sayfalar ve bolumler icin gecerlidir.",
  },
  {
    number: 5,
    title: "Yayina Alin",
    description:
      `Editorde ust cubukta Yayina Al dugmesine tiklayin. Subdomaininizi belirleyin, on kontrol listesini tamamlayin ve sitenizi canli hale getirin. Siteniz {subdomain}.${ROOT_DOMAIN} adresinden erisebilir olur.`,
  },
];

function HizliBaslangicTab() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Pixel ile ilk sitenizi yayina almak icin asagidaki 5 adimi izleyin.
      </p>
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4 top-9 bottom-9 w-px bg-zinc-200 -z-10" />
        <div className="space-y-4">
          {BASLANGIC_STEPS.map((step) => (
            <div key={step.number} className="flex gap-4 items-start">
              <div className="shrink-0 h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold z-10">
                {step.number}
              </div>
              <Card className="flex-1">
                <CardContent>
                  <p className="text-sm font-semibold text-zinc-900 mb-1">{step.title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Editör ────────────────────────────────────────────────────────────────────

const EDITOR_PANELS = [
  {
    title: "Sol Panel — Bolumler",
    items: [
      "Sayfalar cubugu: birden fazla sayfa ekleyip yonetebilirsiniz.",
      "Bolum listesi: aktif sayfanin bolumlerini siralar.",
      "Yukari/asagi oklari ile bolum sirasini degistirin.",
      "Goz ikonu ile bolumu gizleyin veya gosterin.",
      "Cop ikonu ile bolumu silin (onay gerektirir).",
      "Ust Menu ve Alt Bilgi tum sayfalarda ortaktir.",
      "Genel Ayarlar tum site geneli renk, font, SEO ayarlarini icerir.",
    ],
  },
  {
    title: "Orta Panel — Duzenle",
    items: [
      "Secili bolumun tum form alanlarini icerir.",
      "Metin, gorsel yukleme, renk, link ve sayisal alanlar.",
      "Dizi alanlari: hizmetler, soru-cevap, ekip uyeleri, fiyat planlari.",
      "Degisiklikler aninda sag panele yansir.",
    ],
  },
  {
    title: "Sag Panel — Onizleme",
    items: [
      "Sitenizin canli React renderini gosterir.",
      "Masaustu, Tablet ve Mobil cihaz simulasyonu.",
      "Birden fazla sayfa varsa sekme cubugu gosterilir.",
      "Tam ekran acmak icin ust saga tiklayin.",
    ],
  },
];

const GLOBAL_TABS = [
  {
    label: "Isletme Bilgileri",
    desc: "Isletme adi, logo, telefon, e-posta, adres ve sosyal medya linkleri (Instagram, Facebook, Twitter, LinkedIn, YouTube, TikTok). Bazi bolum sablonlari bu bilgileri otomatik kullanir.",
  },
  {
    label: "Renkler",
    desc: "7 renk ozelligi: Birincil, Ikincil, Vurgu, Arkaplan, Yuzeyi, Metin ve Acik Metin. Tum bolumler bu renk paletinden renk alir.",
  },
  {
    label: "Fontlar",
    desc: "Baslik ve govde metin fontu ayri ayri secilir. 25'ten fazla Google Font secenegi mevcuttur. Fontlar dinamik olarak yuklenir.",
  },
  {
    label: "SEO",
    desc: "Site basligi, meta aciklamasi, anahtar kelimeler, Open Graph gorseli (1200x630px) ve favicon (32x32px PNG/ICO).",
  },
];

function EditorTab() {
  return (
    <div className="space-y-6">
      {/* ASCII diagram */}
      <Card>
        <CardHeader title="Editor Panelleri" description="Editör 3 dikey panelden olusur" />
        <CardContent>
          <pre className="font-mono text-xs text-zinc-500 bg-zinc-50 rounded-md p-4 overflow-x-auto leading-relaxed">
{`+--------------------+---------------------------+--------------------+
|   SOL PANEL        |   ORTA PANEL              |   SAG PANEL        |
|   Bolumler         |   Duzenle                 |   Canli Onizleme   |
|--------------------|---------------------------|---------------------
|  [ Sayfalar  ▼ ]   |  Secili bolumun           |  Cihaz: [ M T D ]  |
|                    |  form alanlari burada      |                    |
|  > Ana Gorsel      |  gorunur:                  |  Degisiklikler     |
|    Hakkimizda      |                            |  aninda            |
|    Hizmetler       |  - Metin alanlari          |  yansir.           |
|    Yorumlar        |  - Gorsel yukleme          |                    |
|    Iletisim        |  - Renk secici             |  [ Tam Ekran ]     |
|                    |  - Link ve sayi            |                    |
|  [ Ust Menu ]      |  - Dizi alanlari           |                    |
|  [ Alt Bilgi ]     |                            |                    |
|  [ Genel Ayarlar ] |                            |                    |
+--------------------+---------------------------+--------------------+`}
          </pre>
        </CardContent>
      </Card>

      {/* 3 panel cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EDITOR_PANELS.map((panel) => (
          <Card key={panel.title}>
            <CardContent>
              <p className="text-sm font-semibold text-zinc-900 mb-3">{panel.title}</p>
              <ul className="space-y-1.5">
                {panel.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keyboard shortcuts */}
      <Card>
        <CardHeader title="Klavye Kisayollari" />
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-zinc-600">Degisiklikleri kaydet</span>
            <div className="flex items-center gap-1">
              <kbd className="bg-zinc-100 border border-zinc-300 rounded px-2 py-0.5 text-xs font-mono text-zinc-700">Ctrl</kbd>
              <span className="text-xs text-zinc-400">+</span>
              <kbd className="bg-zinc-100 border border-zinc-300 rounded px-2 py-0.5 text-xs font-mono text-zinc-700">S</kbd>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Sayfa kapatirken kaydedilmemis degisiklikler varsa tarayici uyari gosterir.
          </p>
        </CardContent>
      </Card>

      {/* Global settings tabs */}
      <Card>
        <CardHeader
          title="Genel Ayarlar"
          description="Sol panelin altindaki dugmeyle acilir, 4 sekmeden olusur"
        />
        <CardContent>
          <div className="space-y-4">
            {GLOBAL_TABS.map((tab) => (
              <div key={tab.label} className="flex items-start gap-3">
                <Badge variant="default">{tab.label}</Badge>
                <p className="text-sm text-zinc-500 leading-relaxed">{tab.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Multi-page info */}
      <Card>
        <CardHeader title="Cok Sayfalı Site" description="Her siteniz birden fazla sayfa icerebilir" />
        <CardContent>
          <ul className="space-y-2">
            {[
              "Sol panelin ustundeki + dugmesiyle yeni sayfa ekleyin.",
              "Sayfa sekmesine cift tikklayarak sayfayi yeniden adlandirin.",
              "Her sayfanin kendi bolum listesi ve SEO ayarlari vardir.",
              "Ust Menu ve Alt Bilgi tum sayfalarda paylasilan global bolumlerdir.",
              "Ana sayfa slug'i bos birakilir; diger sayfalar otomatik URL alir (ornegin /hizmetler).",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Bölümler ──────────────────────────────────────────────────────────────────

const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero:         "Sayfanin en ustunde tam ekran gorsel, ana baslik ve aksiyon dugmesi.",
  about:        "Isletmenizin hikayesini, degerlerini ve ozelliklerini anlatir.",
  services:     "Sundugunuz hizmet veya urunleri kart, liste ya da grid olarak sergiler.",
  gallery:      "Fotograflari grid, masoni veya slider olarak gosterir; lightbox destekler.",
  menu:         "Restoran ve kafe isletmeleri icin kategori bazli urun ve fiyat listesi.",
  testimonials: "Musterilerin yorum ve degerlendirmelerini one cikarin.",
  team:         "Calisanlarinizi veya kuruculari profil kart olarak tanitir.",
  pricing:      "Fiyat planlarini karsilastirmali kart duzeninde sunar.",
  contact:      "Iletisim formu, harita embed ve isletme bilgilerini gosterir.",
  faq:          "Sikca sorulan sorulari acilir-kapanir liste seklinde ekler.",
  cta:          "Ziyaretciyi harekete gecirmek icin vurgulu bir cagriya alani.",
  stats:        "Etkileyici istatistikleri ve rakamlari one cikarin.",
  blog:         "Blog yazilarinizi kart veya liste olarak sayfada gosterir.",
  partners:     "Partnerlerinizi ve is birliklerinizi logo grid veya kaydirma ile sergiler.",
  video:        "YouTube veya Vimeo videolarini thumbnail onizleme ile gosterir.",
};

const ORDERED_SECTIONS: SectionType[] = [
  "hero", "about", "services", "gallery", "menu",
  "testimonials", "team", "pricing", "contact", "faq",
  "cta", "stats", "blog", "partners", "video",
];

function BolumlerTab() {
  return (
    <div className="space-y-6">
      {/* Global sections note */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-5 py-4 flex items-start gap-3">
        <svg className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-zinc-600">
          <span className="font-semibold">Ust Menu</span> ve <span className="font-semibold">Alt Bilgi</span> global bölümlerdir — tum sayfalarda ortaktir ve editorde sol paneldeki amber renkli dugmelerden duzenlenebilir.
        </p>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORDERED_SECTIONS.map((type) => (
          <Card key={type}>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="shrink-0 h-9 w-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={SECTION_ICON_PATHS[type]} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900">{SECTION_LABELS[type]}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{SECTION_DESCRIPTIONS[type]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section management */}
      <Card>
        <CardHeader title="Bolum Yonetimi" description="Her sayfada bolumler asagidaki sekilde yonetilebilir" />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { action: "Bolum Ekle", desc: "Sol panelin altindaki + dugmesi ile sayfaya yeni bolum ekleyin." },
              { action: "Siralama", desc: "Yukari/asagi oklari ile bolumun sira pozisyonunu degistirin." },
              { action: "Gizle/Goster", desc: "Goz ikonu ile bolumu gizleyin; gizli bolumler yayinlanan sitede gorunmez." },
              { action: "Sil", desc: "Cop ikonu ile bolumu silin. Onay penceresi acilir, geri alinamaz." },
            ].map((item) => (
              <div key={item.action} className="flex items-start gap-2">
                <Badge variant="default" size="sm">{item.action}</Badge>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Yayımlama ─────────────────────────────────────────────────────────────────

const PRE_PUBLISH_CHECKS = [
  { label: "Isletme adi girildi", where: "Genel Ayarlar > Isletme Bilgileri" },
  { label: "SEO basligi girildi", where: "Genel Ayarlar > SEO" },
  { label: "En az 1 gorunen bolum var", where: "Bolum listesinde gorunurluk acik olmali" },
  { label: "Subdomain musait", where: "Yayina Al penceresinde kontrol edilir" },
];

function YayimlamaTab() {
  return (
    <div className="space-y-6">
      {/* Pre-publish checklist */}
      <Card>
        <CardHeader
          title="Yayim Oncesi Kontrol Listesi"
          description="Yayina almadan once sistem su 4 kosulu otomatik kontrol eder"
        />
        <CardContent>
          <div className="space-y-3">
            {PRE_PUBLISH_CHECKS.map((check, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 border-zinc-300 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-zinc-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800">{check.label}</p>
                  <p className="text-xs text-zinc-400">{check.where}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-zinc-400 border-t border-zinc-100 pt-3">
            Tum kosullar saglandi mi kontrolunu Yayina Al penceresi otomatik yapar ve eksik adimlar icin uyari gosterir.
          </p>
        </CardContent>
      </Card>

      {/* Subdomain */}
      <Card>
        <CardHeader title="Subdomain Secimi" description="Sitenizin internet adresi" />
        <CardContent>
          <div className="bg-zinc-50 rounded-md px-4 py-3 mb-4 font-mono text-sm text-zinc-700">
            {"{subdomain}"}<span className="text-zinc-400">.{ROOT_DOMAIN}</span>
          </div>
          <ul className="space-y-1.5 mb-4">
            {[
              "Sadece kucuk harf (a-z), rakam (0-9) ve tire (-) kullanilabilir.",
              "Bosluk ve ozel karakter kullanilamaz.",
              "Bazi kelimeler rezervedir (www, api, admin, dashboard vb.).",
              "Subdomain degistirildiginde site yayindan kalkar, tekrar yayinlamaniz gerekir.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-zinc-400">
            Editorde ust cubukta subdomain adinin yanindaki kalem ikonuna tikklayarak istediginiz zaman degistirebilirsiniz.
          </p>
        </CardContent>
      </Card>

      {/* After publish */}
      <Card>
        <CardHeader title="Yayim Sonrasi" />
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-zinc-800 mb-2">Yayina aldiginizda:</p>
              <ul className="space-y-1.5">
                {[
                  `Siteniz https://{subdomain}.${ROOT_DOMAIN} adresinden erisebilir olur.`,
                  "Editorde ust cubukta yesil Yayinda rozeti gosterilir.",
                  "Goruntule linki aktif hale gelir.",
                  "Dashboard'daki site kartinda Yayinda durum etiketi gosterilir.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <p className="text-sm font-semibold text-zinc-800 mb-2">Yayindan kaldirmak icin:</p>
              <p className="text-sm text-zinc-500">
                Editorde ust cubukta Yayindan Kaldir dugmesine tiklayin. Site adresi deaktif olur ancak tum icerik korunur; istediginizde tekrar yayinlayabilirsiniz.
              </p>
            </div>
            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs text-zinc-400">
                Hiz siniri: yayimlama islemi dakikada en fazla 10 kez yapilabilir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom domain */}
      <Card>
        <CardHeader title="Ozel Domain" description="Kendi alan adinizi baglayin" />
        <CardContent>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Varsayilan subdomain yerine kendi alan adinizi (ornegin <span className="font-mono text-zinc-700">siteniz.com</span>) kullanabilirsiniz.
            Bunun icin <span className="font-semibold text-zinc-700">Ayarlar &rsaquo; Domain</span> sekmesine gidin ve iletisim dugmesini kullanarak talep gonderin.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Ayarlar ───────────────────────────────────────────────────────────────────

function AyarlarTab() {
  return (
    <div className="space-y-6">
      {/* Site Bilgileri */}
      <Card>
        <CardHeader title="Site Bilgileri" description="Ayarlar sayfasindaki ilk sekme" />
        <CardContent>
          <ul className="space-y-2">
            {[
              "Subdomain adresi (salt okunur)",
              "Yayim durumu: Yayinda veya Taslak",
              "Kullanilan sablon adi",
              "Olusturulma tarihi ve son guncelleme tarihi",
              "Editoru Ac hizli erisim dugmesi",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Domain */}
      <Card>
        <CardHeader title="Domain" description="Subdomain yonetimi ve ozel domain" />
        <CardContent>
          <ul className="space-y-2">
            {[
              "Mevcut subdomain adresinizi tek tikla kopyalayin.",
              "Aktif ozel domain varsa burada goruntulenir.",
              "Kendi alan adinizi baglamak icin iletisim dugmesi araciligiyla talep gonderin.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-500">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card>
        <CardHeader title="Tehlikeli Bolge" description="Geri donus olmayan islemler icin onay gerektiren alan" />
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Badge variant="warning">Siteyi Sifirla</Badge>
              <p className="text-sm text-zinc-500">
                Tum bolum icerigini ve gorsellerini silin, sablonun varsayilan degerlerine dondurur. Subdomain ve yayim durumu degismez.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="danger">Siteyi Sil</Badge>
              <p className="text-sm text-zinc-500">
                Site tamamen ve kalici olarak silinir. Onay icin metin kutusuna <span className="font-mono font-semibold text-zinc-700">SIL</span> yazmaniz gerekir. Bu islem geri alinamaz.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function HelpPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("baslangic");

  return (
    <div>
      <Tabs
        tabs={TABS}
        active={activeTab}
        onChange={(key) => setActiveTab(key as TabKey)}
      />
      <div className="mt-6">
        {activeTab === "baslangic"  && <HizliBaslangicTab />}
        {activeTab === "editor"     && <EditorTab />}
        {activeTab === "bolumler"   && <BolumlerTab />}
        {activeTab === "yayimlama"  && <YayimlamaTab />}
        {activeTab === "ayarlar"    && <AyarlarTab />}
      </div>
    </div>
  );
}
