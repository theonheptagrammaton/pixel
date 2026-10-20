import type {
  SiteConfig,
  HeroData,
  AboutData,
  ServicesData,
  ContactData,
  FaqData,
  CtaData,
  HeaderData,
  FooterData,
  TestimonialsData,
  GalleryData,
  TeamData,
  PricingData,
  MenuData,
  SiteSection,
  SitePage,
  HeroVariant,
  CardStyle,
  SectionStyle,
} from "@/types/template";

// ─── Generation Options ──────────────────────────────────────────────────────

export interface SiteGenerationOptions {
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
  };
  fonts?: { heading: string; body: string };
  heroVariant?: HeroVariant;
  cardStyle?: CardStyle;
  spacing?: "compact" | "normal" | "spacious";
  pageOverrides?: Array<{ slug: string; sectionTypes: string[] }>;
}

// ─── Sector Info ──────────────────────────────────────────────────────────────

export interface SectorInfo {
  id: string;
  label: string;
  templateSlug: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
  };
  fonts: { heading: string; body: string };
  sampleContent: {
    businessDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    aboutDescription: string;
    services: Array<{ title: string; description: string }>;
    ctaTitle: string;
    ctaDescription: string;
    testimonials: Array<{ name: string; role: string; content: string; rating: number }>;
    faqItems: Array<{ question: string; answer: string }>;
  };
  pages: Array<{ name: string; slug: string; sectionTypes: Array<string> }>;
}

export const SECTORS: SectorInfo[] = [
  {
    id: "restoran",
    label: "Restoran",
    templateSlug: "flavor",
    colorPalette: {
      primary: "#c2410c",
      secondary: "#9a3412",
      accent: "#ea580c",
      background: "#fffbf7",
      surface: "#ffffff",
      text: "#1c1917",
      textLight: "#78716c",
    },
    fonts: { heading: "Playfair Display", body: "Inter" },
    sampleContent: {
      businessDescription: "Taze ve yerel malzemelerle hazirlanan benzersiz lezzetler sunan restoraninizdayiz.",
      heroTitle: "Damak Zevkinize Hitap Eden Lezzetler",
      heroSubtitle: "Geleneksel Tatlar, Modern Sunum",
      heroDescription: "Ustalarimizin elinden cikan, taze malzemelerle hazirlanan yemeklerimizle unutulmaz bir gastronomi deneyimi yasayin.",
      aboutDescription: "Yillardir surdurdugumuz mutfak gelenegimizle, her tabakta sevgi ve ozen sunuyoruz. Taze, mevsimlik malzemeler kullanarak geleneksel tarifleri modern dokunuslarla yeniden yorumluyoruz.",
      services: [
        { title: "Ogle Menusu", description: "Her gun degisen, taze malzemelerle hazirlanan ogle menulerimiz" },
        { title: "Aksam Yemegi", description: "Ozel tariflerimizle hazirlanmis gurme aksam yemekleri" },
        { title: "Catering Hizmeti", description: "Ozel gunleriniz icin profesyonel catering ve organizasyon" },
        { title: "Canli Muzik", description: "Haftasonlari canli muzik esliginde keyifli bir yemek deneyimi" },
      ],
      ctaTitle: "Rezervasyon Yapin",
      ctaDescription: "Ozel bir aksam yemegi icin yerinizi ayirtin. Sizi agirlamaktan mutluluk duyariz.",
      testimonials: [
        { name: "Ayse Yilmaz", role: "Duzenli Musteri", content: "Her gelisimde ayni kaliteli lezzeti buluyorum. Personel son derece ilgili ve guler yuzlu.", rating: 5 },
        { name: "Mehmet Kaya", role: "Gastronomi Yazari", content: "Sehrin en iyi gizli lezzetlerinden biri. Ozellikle kuzu tandir enfes.", rating: 5 },
      ],
      faqItems: [
        { question: "Rezervasyon zorunlu mu?", answer: "Haftasonu aksam yemekleri icin rezervasyon oneririz. Haftaici genellikle musaitiz." },
        { question: "Vejetaryen secenekleriniz var mi?", answer: "Evet, menumuuzde cok cesitli vejetaryen ve vegan secenekler bulunmaktadir." },
        { question: "Ozel gunler icin organizasyon yapiyor musunuz?", answer: "Evet, dogum gunu, nisan ve kurumsal yemekler icin ozel organizasyonlar duzenliyoruz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Menu", slug: "menu", sectionTypes: ["hero", "menu"] },
      { name: "Galeri", slug: "galeri", sectionTypes: ["hero", "gallery"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "kafe",
    label: "Kafe",
    templateSlug: "flavor",
    colorPalette: {
      primary: "#78350f",
      secondary: "#92400e",
      accent: "#b45309",
      background: "#fefce8",
      surface: "#ffffff",
      text: "#1c1917",
      textLight: "#78716c",
    },
    fonts: { heading: "Lora", body: "Source Sans 3" },
    sampleContent: {
      businessDescription: "Ozenle kavrulmus kahve cekirdekleri ve ev yapimi tatlilarla huzurlu bir mola.",
      heroTitle: "Her Yudumda Huzur",
      heroSubtitle: "Ozel Kavrum Kahveler",
      heroDescription: "Dunyanin dort bir yanindan secilmis cekirdeklerle hazirlanan ozel kavrum kahvelerimizi kesfeedin.",
      aboutDescription: "Kahve tutkumuzu sizlerle paylasiyoruz. Her fincan, ozenle secilmis cekirdeklerin uzman barista ellerinde donusmesiyle hayat buluyor. Sicak atmosferimizde kendinizi evinizde hissedin.",
      services: [
        { title: "Filtre Kahve", description: "Tek origin cekirdeklerden gunden gune degisen filtre kahveler" },
        { title: "Espresso Bar", description: "Klasik ve ozel espresso bazli iceceklerimiz" },
        { title: "Ev Yapimi Tatlilar", description: "Her gun taze hazirlanan pasta, kek ve kurabiyeler" },
        { title: "Kahvalti Menusu", description: "Gune guzel baslamak icin zengin kahvalti secenekleri" },
      ],
      ctaTitle: "Bizi Ziyaret Edin",
      ctaDescription: "Sicak atmosferimizde bir fincan kahvenin tadini cikarin.",
      testimonials: [
        { name: "Zeynep Demir", role: "Kahve Tutkunu", content: "Sehirdeki en iyi filtre kahveyi burada iciyorum. Atmosfer de harika.", rating: 5 },
        { name: "Can Ozturk", role: "Freelancer", content: "Calisma ortami olarak mukemmel. Wi-Fi hizli, kahve lezzetli, personel guleryuzlu.", rating: 5 },
      ],
      faqItems: [
        { question: "Wi-Fi mevcut mu?", answer: "Evet, tum musterilerimiz icin ucretsiz yuksek hizli Wi-Fi sunuyoruz." },
        { question: "Kahve cekirdegi satisi yapiyor musunuz?", answer: "Evet, ozel kavrum cekirdeklerimizi paketli olarak satin alabilirsiniz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Menu", slug: "menu", sectionTypes: ["hero", "menu"] },
      { name: "Galeri", slug: "galeri", sectionTypes: ["hero", "gallery"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "kuafor",
    label: "Kuafor",
    templateSlug: "bloom",
    colorPalette: {
      primary: "#7c3aed",
      secondary: "#6d28d9",
      accent: "#a78bfa",
      background: "#faf5ff",
      surface: "#ffffff",
      text: "#1e1b4b",
      textLight: "#6b7280",
    },
    fonts: { heading: "Cormorant Garamond", body: "Raleway" },
    sampleContent: {
      businessDescription: "Uzman stilistlerimizle sac bakim ve tasarimda fark yaratan kuafor salonumuz.",
      heroTitle: "Stilinizi Yeniden Tanimlayin",
      heroSubtitle: "Profesyonel Sac Bakimi",
      heroDescription: "Deneyimli stilistlerimiz, en son trendleri ve teknikleri kullanarak size ozel gorunumler olusturuyor.",
      aboutDescription: "Yillardir sektorde edindigimiz tecrube ve surekli gelisim anlayisimizla, her musterimize ozel cozumler sunuyoruz. Sac sagliginizi on planda tutarak, stilinizi tamamlayan en dogru kesim ve bakimi uyguluyoruz.",
      services: [
        { title: "Sac Kesimi", description: "Yuz tipinize uygun profesyonel sac kesimi ve sekillendirme" },
        { title: "Sac Boyama", description: "Balyaj, ombre, tekli proses ve yaratici renklendirme hizmetleri" },
        { title: "Sac Bakimi", description: "Keratin, botoks ve onarici bakim uygulamalari" },
        { title: "Gelin Saci", description: "Ozel gununuz icin prova dahil profesyonel gelin saci tasarimi" },
      ],
      ctaTitle: "Randevu Alin",
      ctaDescription: "Uzman stilistlerimizle tanisin ve yeni gorunumunuze kavusun.",
      testimonials: [
        { name: "Selin Arslan", role: "Musteri", content: "Her seferinde salondan mutlu cikiyorum. Renk gecisleri mukemmel!", rating: 5 },
        { name: "Deniz Celik", role: "Musteri", content: "Gelin sacimi burada yaptirdim, hayalimdeki gorunumu yakaldilar.", rating: 5 },
      ],
      faqItems: [
        { question: "Randevu almadan gelebilir miyim?", answer: "Musaitlik durumuna gore kabul ediyoruz ancak randevu almanizi oneririz." },
        { question: "Urunleriniz dogal mi?", answer: "Evet, mumkun oldugunca organik ve zararsiz urunler kullaniyoruz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Galeri", slug: "galeri", sectionTypes: ["hero", "gallery"] },
      { name: "Ekibimiz", slug: "ekibimiz", sectionTypes: ["hero", "team"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "guzellik-salonu",
    label: "Guzellik Salonu",
    templateSlug: "bloom",
    colorPalette: {
      primary: "#db2777",
      secondary: "#be185d",
      accent: "#f472b6",
      background: "#fdf2f8",
      surface: "#ffffff",
      text: "#1e1b4b",
      textLight: "#6b7280",
    },
    fonts: { heading: "Cormorant Garamond", body: "Raleway" },
    sampleContent: {
      businessDescription: "Profesyonel guzellik bakimi ve kisisel bakim hizmetleriyle kendinizi ozel hissedin.",
      heroTitle: "Dogal Guzelliginizi Ortaya Cikarin",
      heroSubtitle: "Profesyonel Guzellik Bakimi",
      heroDescription: "Uzman kadromuz ve premium urunlerle, cildinizin ihtiyac duydugu bakimi sunuyoruz.",
      aboutDescription: "Guzellik salonumuz, her musterisine ozel bakim planlari olusturarak dogal guzelligini on plana cikarmayi amacliyor. Uluslararasi sertifikali uzmanlarimiz, en kaliteli urunlerle hizmet vermektedir.",
      services: [
        { title: "Cilt Bakimi", description: "Cilt tipinize ozel derin temizlik, nemlendirme ve anti-aging bakim" },
        { title: "Makyaj", description: "Ozel gun, gelin ve profesyonel makyaj uygulamalari" },
        { title: "Tirnak Bakimi", description: "Manikur, pedikur, protez tirnak ve nail art tasarimlari" },
        { title: "Epilasyon", description: "Lazer epilasyon ve agda uygulamalari ile puruzsuz cilt" },
      ],
      ctaTitle: "Randevunuzu Olusturun",
      ctaDescription: "Kendinize vakit ayirin. Uzmanlarimiz sizi bekliyor.",
      testimonials: [
        { name: "Elif Sahin", role: "Musteri", content: "Cilt bakimi sonrasi cildim bambaska oldu. Cok memnunum!", rating: 5 },
        { name: "Buse Yildiz", role: "Musteri", content: "Gelin makyajim icin burada karar kildim. Sonuc muhtesemdi.", rating: 5 },
      ],
      faqItems: [
        { question: "Ilk seans icin ne kadar sure ayirmaliyim?", answer: "Ilk seansinizda cilt analizi yapilacagi icin yaklasik 1.5 saat ayirmanizi oneririz." },
        { question: "Hassas ciltler icin uygun urunleriniz var mi?", answer: "Evet, hassas ve alerjik ciltler icin ozel urun serimiz mevcuttur." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Galeri", slug: "galeri", sectionTypes: ["hero", "gallery"] },
      { name: "Fiyatlar", slug: "fiyatlar", sectionTypes: ["hero", "pricing"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "klinik",
    label: "Klinik / Saglik",
    templateSlug: "vertex",
    colorPalette: {
      primary: "#0284c7",
      secondary: "#0369a1",
      accent: "#38bdf8",
      background: "#f0f9ff",
      surface: "#ffffff",
      text: "#0f172a",
      textLight: "#64748b",
    },
    fonts: { heading: "Montserrat", body: "Open Sans" },
    sampleContent: {
      businessDescription: "Modern tibbi ekipman ve uzman kadrosuyla guvenilir saglik hizmeti.",
      heroTitle: "Sagliginiz Icin Buradayiz",
      heroSubtitle: "Uzman Kadro, Modern Teknoloji",
      heroDescription: "Deneyimli doktorlarimiz ve son teknoloji ekipmanlarimizla, sagliginiz icin en iyi hizmeti sunuyoruz.",
      aboutDescription: "Klnigimiz, hasta odakli yaklasimi ve multidisipliner ekibiyle, teşhis ve tedavi sureclerinde en yuksek standartlari hedeflemektedir. Her hastamiza ozel, butunsel bir saglik hizmeti sunmaktayiz.",
      services: [
        { title: "Genel Muayene", description: "Kapsamli saglik taramasi ve koruyucu hekimlik hizmetleri" },
        { title: "Laboratuvar", description: "Hizli ve guvenilir sonuclar icin tam donanimli laboratuvar" },
        { title: "Goruntuleme", description: "MR, ultrason ve rontgen hizmetleri" },
        { title: "Uzman Poliklinikleri", description: "Dahiliye, ortopedi, goz ve kulak burun bogaz uzmanliklari" },
      ],
      ctaTitle: "Randevu Alin",
      ctaDescription: "Sagliginiz icin ilk adimi atin. Online randevu sistemiyle kolayca randevunuzu olusturun.",
      testimonials: [
        { name: "Ali Korkmaz", role: "Hasta", content: "Ilgili ve profesyonel bir ekip. Tedavi surecim cok rahat gecti.", rating: 5 },
        { name: "Fatma Ozdemir", role: "Hasta", content: "Temiz, modern bir klinik. Bekleme suresi cok kisa.", rating: 5 },
      ],
      faqItems: [
        { question: "Hangi sigortalarla calisiyorsunuz?", answer: "Tum ozel saglik sigortalari ve SGK anlasmaliyiz. Detaylar icin bizi arayin." },
        { question: "Acil durumlar icin 7/24 acik misiniz?", answer: "Poliklinik hizmetlerimiz hafta ici 08:00-20:00 arasi, cumartesi 09:00-14:00 arasindadir." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Doktorlarimiz", slug: "doktorlarimiz", sectionTypes: ["hero", "team"] },
      { name: "Hakkimizda", slug: "hakkimizda", sectionTypes: ["hero", "about", "faq"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact"] },
    ],
  },
  {
    id: "avukat",
    label: "Hukuk Burosu",
    templateSlug: "vertex",
    colorPalette: {
      primary: "#1e3a5f",
      secondary: "#0f2b46",
      accent: "#3b82f6",
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#0f172a",
      textLight: "#64748b",
    },
    fonts: { heading: "Merriweather", body: "Source Sans 3" },
    sampleContent: {
      businessDescription: "Guvenilir ve deneyimli hukuk danismanligi ile haklarinizi koruyoruz.",
      heroTitle: "Haklarinizi Bilgi ve Deneyimle Koruyoruz",
      heroSubtitle: "Profesyonel Hukuk Danismanligi",
      heroDescription: "Uzman avukat kadromuz, her turlu hukuki surecte yaninizdadir. Guvenilir, seffaf ve sonuc odakli calisiyoruz.",
      aboutDescription: "Hukuk buromuz, yillardir edindigi tecrube ve guncel mevzuat bilgisiyle, bireysel ve kurumsal muvekkillerine en etkin hukuki destek sglmaktadir. Dava takibi, sozlesme hazirlama ve hukuki danismanlik alanlarinda uzmaniz.",
      services: [
        { title: "Ceza Hukuku", description: "Ceza davalrinda savunma ve magdur haklari konusunda uzman destek" },
        { title: "Is Hukuku", description: "Isci-isveren uyusmazliklari, ise iade ve tazminat davalari" },
        { title: "Aile Hukuku", description: "Bosanma, velayet, nafaka ve mal paylasimi davalari" },
        { title: "Ticaret Hukuku", description: "Sirket kurulusu, sozlesme hazirlama ve ticari dava takibi" },
      ],
      ctaTitle: "Ucretsiz On Gorusme",
      ctaDescription: "Hukuki sorunlariniz icin ilk gorusme ucretsizdir. Hemen randevu alin.",
      testimonials: [
        { name: "Hasan Celik", role: "Muvakkil", content: "Is davamda haklarimi en iyi sekilde savundular. Cok profesyonel.", rating: 5 },
        { name: "Ayse Polat", role: "Kurumsal Musteri", content: "Sirketimizin hukuk danismani olarak her konuda guveniyoruz.", rating: 5 },
      ],
      faqItems: [
        { question: "Ilk gorusme ucreti ne kadar?", answer: "Ilk gorusme tamamen ucretsizdir. Dava degerlenndirmesi yapildiktan sonra ucret bilgisi verilir." },
        { question: "Online danismanlik veriyor musunuz?", answer: "Evet, video gorusme ile online hukuki danismanlik hizmeti sunuyoruz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Faaliyet Alanlari", slug: "faaliyet-alanlari", sectionTypes: ["hero", "services", "faq"] },
      { name: "Ekibimiz", slug: "ekibimiz", sectionTypes: ["hero", "team"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact"] },
    ],
  },
  {
    id: "emlak",
    label: "Emlak",
    templateSlug: "vertex",
    colorPalette: {
      primary: "#15803d",
      secondary: "#166534",
      accent: "#4ade80",
      background: "#f0fdf4",
      surface: "#ffffff",
      text: "#0f172a",
      textLight: "#64748b",
    },
    fonts: { heading: "Poppins", body: "Inter" },
    sampleContent: {
      businessDescription: "Gayrimenkul alaninda guvenilir danismanlik ve genis portfoy ile hayalinizdeki eve kavusun.",
      heroTitle: "Hayalinizdeki Eve Bir Adim",
      heroSubtitle: "Guvenilir Gayrimenkul Danismanligi",
      heroDescription: "Genis portfoyumuz ve deneyimli ekibimizle, size en uygun gayrimenkulu bulmak icin buradayiz.",
      aboutDescription: "Gayrimenkul sektorunde yillardir edindigimiz guven ve tecrube ile, satis, kiralama ve yatirim danismanligi hizmetleri sunuyoruz. Musterilerimizin ihtiyaclarina ozel cozumler uretiyoruz.",
      services: [
        { title: "Konut Satisi", description: "Daire, villa ve rezidans satisinda genis portfoy ve profesyonel destek" },
        { title: "Kiralama", description: "Konut ve isyeri kiralama islemlerinde aracisiz guvenli hizmet" },
        { title: "Yatirim Danismanligi", description: "Gayrimenkul yatirimi icin analiz, fizibilite ve portfoy yonetimi" },
        { title: "Deger Tespiti", description: "Profesyonel ekspertiz ile gayrimenkul deger tespiti" },
      ],
      ctaTitle: "Ucretsiz Danismanlik Alin",
      ctaDescription: "Gayrimenkul ihtiyaclariniz icin uzman ekibimizle gorusun.",
      testimonials: [
        { name: "Kemal Tas", role: "Ev Sahibi", content: "Hayalimdeki daireyi cok kisa surede buldular. Surecin her asamasinda destek aldim.", rating: 5 },
        { name: "Sibel Yilmaz", role: "Yatirimci", content: "Yatirim danismanligi hizmetleri sayesinde dogru kararlari verdim.", rating: 5 },
      ],
      faqItems: [
        { question: "Komisyon orani ne kadar?", answer: "Komisyon orani islem turune gore degisir. Detaylar icin bizi arayin." },
        { question: "Kredi surecinde yardimci oluyor musunuz?", answer: "Evet, anlasmalirmz bankalarla kredi surecinde tam destek sagliyoruz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Portfoy", slug: "portfoy", sectionTypes: ["hero", "gallery"] },
      { name: "Hakkimizda", slug: "hakkimizda", sectionTypes: ["hero", "about", "team"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "fitness",
    label: "Fitness / Spor Salonu",
    templateSlug: "pulse",
    colorPalette: {
      primary: "#dc2626",
      secondary: "#b91c1c",
      accent: "#f97316",
      background: "#0f0f0f",
      surface: "#1a1a1a",
      text: "#f5f5f5",
      textLight: "#a3a3a3",
    },
    fonts: { heading: "Oswald", body: "Inter" },
    sampleContent: {
      businessDescription: "Profesyonel egitmenler esliginde modern ekipmanlarla hedefinize ulasin.",
      heroTitle: "Sinirlarini As, Gucunu Kesfet",
      heroSubtitle: "Profesyonel Fitness Deneyimi",
      heroDescription: "Modern ekipmanlar, uzman egitmenler ve motivasyon dolu ortamimizla en iyi versiyonunuz olun.",
      aboutDescription: "Spor salonumuz, her seviyeden sporcu icin tasarlanmis genis alanlar, son model ekipmanlar ve kisisel antrenman programlari sunmaktadir. Saglikli yasam yolculugunuzda yaninizdayiz.",
      services: [
        { title: "Kisisel Antrenman", description: "Hedefinize ozel birebir antrenman programlari" },
        { title: "Grup Dersleri", description: "Yoga, pilates, spinning ve fonksiyonel antrenman siniflar" },
        { title: "Beslenme Danismanligi", description: "Diyetisyen esliginde kisisel beslenme planlari" },
        { title: "Serbest Agirlik", description: "Profesyonel serbest agirlik ve powerlifting alani" },
      ],
      ctaTitle: "Ucretsiz Deneme Dersi",
      ctaDescription: "Ilk dersiniz bizden. Hemen kayit olun ve farkimizi gorun.",
      testimonials: [
        { name: "Emre Yildirim", role: "Uye", content: "6 ayda 20 kilo verdim. Egitmenler cok motive edici.", rating: 5 },
        { name: "Derya Aktas", role: "Uye", content: "Grup dersleri cok eglenceli. Her gun gelmeyi dort gozle bekliyorum.", rating: 5 },
      ],
      faqItems: [
        { question: "Uyelik ucretleri nedir?", answer: "Aylik, 3 aylik ve yillik uyelik seceneklerimiz mevcuttur. Detaylar icin bizi arayin." },
        { question: "Kisisel antrenman ayri ucretli mi?", answer: "Evet, kisisel antrenman uyelik ucretine dahil degildir. Paket seceneklerimiz vardir." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Programlar", slug: "programlar", sectionTypes: ["hero", "pricing"] },
      { name: "Galeri", slug: "galeri", sectionTypes: ["hero", "gallery"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "fotografci",
    label: "Fotografci",
    templateSlug: "showcase",
    colorPalette: {
      primary: "#ffffff",
      secondary: "#a3a3a3",
      accent: "#e5e5e5",
      background: "#0a0a0a",
      surface: "#171717",
      text: "#f5f5f5",
      textLight: "#a3a3a3",
    },
    fonts: { heading: "Cormorant Garamond", body: "Inter" },
    sampleContent: {
      businessDescription: "Anlarinizi sanatsal bir bakis acisiyla olumsuze donusturen profesyonel fotograf studyosu.",
      heroTitle: "Anlarinizi Sanata Donusturuyoruz",
      heroSubtitle: "Profesyonel Fotograf Studyosu",
      heroDescription: "Dugun, portre, urun ve etkinlik fotografciliginda yaratici bakis acisiyla anlarinizi olumsuze donusturuyoruz.",
      aboutDescription: "Fotografcilik tutkumuzla, her projeye sanatsal bir yaklasim getiriyoruz. Dogal isik ve mekan kullanimimizla, anlarinizi en otantik haliyle yakaliyoruz. Her kare, bir hikaye anlatiyor.",
      services: [
        { title: "Dugun Fotografciligi", description: "Ozel gununuzun her anini yaratici ve dogal karelerle olumsuze donusturuyoruz" },
        { title: "Portre Cekim", description: "Profesyonel portre, aile ve bebek fotografciligi" },
        { title: "Urun Fotografciligi", description: "E-ticaret ve katalog icin profesyonel urun cekimleri" },
        { title: "Etkinlik", description: "Kurumsal etkinlik, lansman ve ozel gun fotografciligi" },
      ],
      ctaTitle: "Projinizi Konusalim",
      ctaDescription: "Hayalinizdeki cekimi birlikte planlayalim. Bize ulasin.",
      testimonials: [
        { name: "Burcu Demir", role: "Gelin", content: "Dugun fotograflarimiz hayalimizin cok otesindeydi. Her kare bir sanat eseri.", rating: 5 },
        { name: "Mert Aydogan", role: "Isletme Sahibi", content: "Urun cekimleri satislarimizi gozle gorulur sekilde artirdi.", rating: 5 },
      ],
      faqItems: [
        { question: "Fotograflar ne kadar surede teslim ediliyor?", answer: "Dugun cekimleri 3-4 hafta, diger cekimler 1-2 hafta icerisinde teslim edilir." },
        { question: "Ham fotograflari da aliyor muyuz?", answer: "Tum paketlerimizde editli fotograflar verilir. Ham dosyalar ek ucretle saglanabilir." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "gallery", "testimonials", "cta"] },
      { name: "Portfoy", slug: "portfoy", sectionTypes: ["hero", "gallery"] },
      { name: "Hizmetler", slug: "hizmetler", sectionTypes: ["hero", "services", "pricing"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "yazilim",
    label: "Yazilim / Teknoloji",
    templateSlug: "forge",
    colorPalette: {
      primary: "#2563eb",
      secondary: "#1d4ed8",
      accent: "#60a5fa",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textLight: "#94a3b8",
    },
    fonts: { heading: "Space Grotesk", body: "Inter" },
    sampleContent: {
      businessDescription: "Modern teknolojilerle isletmenizin dijital donusumunu gerceklestiriyoruz.",
      heroTitle: "Dijital Cozumler, Gercek Sonuclar",
      heroSubtitle: "Yazilim Gelistirme ve Danismanlik",
      heroDescription: "Web uygulama, mobil uygulama ve bulut cozumleriyle isletmenizi dijital caga tasiyoruz.",
      aboutDescription: "Teknoloji ekibimiz, startup'lardan kurumsal sirketlere kadar genis bir yelpazede yazilim gelistirme, danismanlik ve dijital donusum hizmetleri sunmaktadir. Agile metodoloji ve modern teknoloji yigini ile projelerinizi hayata geciriyoruz.",
      services: [
        { title: "Web Gelistirme", description: "React, Next.js ve modern teknolojilerle hizli ve olceklenebilir web uygulamalar" },
        { title: "Mobil Uygulama", description: "iOS ve Android icin native ve cross-platform mobil uygulamalar" },
        { title: "Bulut Cozumleri", description: "AWS, Azure ve GCP uzerinde altyapi tasarimi ve yonetimi" },
        { title: "UI/UX Tasarim", description: "Kullanici odakli arayuz tasarimi ve kullanici deneyimi optimizasyonu" },
      ],
      ctaTitle: "Projenizi Konusalim",
      ctaDescription: "Dijital ihtiyaclariniz icin ucretsiz on gorusme alin.",
      testimonials: [
        { name: "Tolga Aydin", role: "Startup Kurucu", content: "MVP'mizi 3 ayda teslim ettiler. Kalite ve hiz birlikte geldi.", rating: 5 },
        { name: "Seda Kara", role: "CTO", content: "Bulut migrasyonumuzu sorunsuz yonettiler. Teknik yetkinlikleri cok yuksek.", rating: 5 },
      ],
      faqItems: [
        { question: "Proje sureci nasil isliyor?", answer: "Analiz, tasarim, gelistirme, test ve yayina alma asamalarindan olusan agile surecimiz vardir." },
        { question: "Destek ve bakim hizmeti veriyor musunuz?", answer: "Evet, proje teslimi sonrasi aylik bakim ve destek paketlerimiz mevcuttur." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "testimonials", "cta"] },
      { name: "Hizmetler", slug: "hizmetler", sectionTypes: ["hero", "services", "pricing"] },
      { name: "Hakkimizda", slug: "hakkimizda", sectionTypes: ["hero", "about", "team"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "otel",
    label: "Otel / Konaklama",
    templateSlug: "zenith",
    colorPalette: {
      primary: "#b8860b",
      secondary: "#8b6914",
      accent: "#d4a843",
      background: "#fefdf5",
      surface: "#ffffff",
      text: "#1c1917",
      textLight: "#78716c",
    },
    fonts: { heading: "Playfair Display", body: "Lora" },
    sampleContent: {
      businessDescription: "Konfor ve luks bir arada. Unutulmaz bir konaklama deneyimi icin sizi bekliyoruz.",
      heroTitle: "Luks ve Huzurun Bulusma Noktasi",
      heroSubtitle: "Premium Konaklama Deneyimi",
      heroDescription: "Essiz manzara, kusursuz hizmet ve konforlu odalarimizla kendinizi ozel hissedin.",
      aboutDescription: "Otelimiz, misafirlerine unutulmaz bir deneyim sunmayi amacliyor. Her detayi ozenle dusunulmus odalarimiz, dunyaca unlu seflerimizin hazirladdgi menuler ve ozel spa hizmetlerimizle tatilinizi bir sanata donusturuyoruz.",
      services: [
        { title: "Luks Odalar", description: "Deniz manzarali, genis ve modern dekorasyonlu odalar" },
        { title: "Restoran & Bar", description: "Acik bufe kahvalti, a la carte restoran ve pool bar" },
        { title: "Spa & Wellness", description: "Turk hamami, sauna, masaj ve guzellik bakimi hizmetleri" },
        { title: "Etkinlik Salonlari", description: "Dugun, toplanti ve ozel organizasyonlar icin donanimli salonlar" },
      ],
      ctaTitle: "Rezervasyon Yapin",
      ctaDescription: "En iyi fiyat garantisiyle yerinizi hemen ayirtin.",
      testimonials: [
        { name: "Ozlem Kilic", role: "Misafir", content: "Hayatimda kaldigim en guzel otellerden biri. Personel inanilmaz ilgili.", rating: 5 },
        { name: "Burak Cetin", role: "Is Seyahati", content: "Toplanti salonlari cok donanimli. Is seyahatlerim icin vazgecilmez.", rating: 5 },
      ],
      faqItems: [
        { question: "Check-in ve check-out saatleri nedir?", answer: "Check-in 14:00, check-out 12:00'dir. Erken check-in ve gec check-out talep edilebilir." },
        { question: "Evcil hayvan kabul ediyor musunuz?", answer: "Evet, belirli odalarimiz evcil hayvan dostudur. Rezervasyon sirasinda belirtmeniz yeterlidir." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "gallery", "testimonials", "cta"] },
      { name: "Odalar", slug: "odalar", sectionTypes: ["hero", "gallery", "pricing"] },
      { name: "Hakkimizda", slug: "hakkimizda", sectionTypes: ["hero", "about", "team"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
  {
    id: "blog",
    label: "Blog / Kisisel",
    templateSlug: "craft",
    colorPalette: {
      primary: "#171717",
      secondary: "#404040",
      accent: "#737373",
      background: "#ffffff",
      surface: "#fafafa",
      text: "#171717",
      textLight: "#737373",
    },
    fonts: { heading: "Merriweather", body: "Inter" },
    sampleContent: {
      businessDescription: "Dusuncelerinizi, deneyimlerinizi ve bilgilerinizi dunyayla paylasin.",
      heroTitle: "Dusunceler, Deneyimler, Ilham",
      heroSubtitle: "Kisisel Blog",
      heroDescription: "Hayattan, teknolojiden, seyahatten ve daha fazlasindan ilham veren yazilar.",
      aboutDescription: "Bu blog, deneyimlerimi, ogrendiklerimi ve dusuncelerimi paylasmak icin olusturuldu. Farkli konularda derinlemesine yazilar, rehberler ve goruslerimi burada bulabilirsiniz.",
      services: [
        { title: "Teknoloji Yazilari", description: "Yazilim, yapay zeka ve dijital dunya hakkinda guncel yazilar" },
        { title: "Seyahat Rehberleri", description: "Gezdigim yerlerin detayli rehberleri ve onerileri" },
        { title: "Kitap Incelemeleri", description: "Okudigum kitaplarin detayli inceleme ve onerileri" },
        { title: "Kisisel Gelisim", description: "Uretkenlik, aliskanliklar ve yasam deneyimleri uzerine yazilar" },
      ],
      ctaTitle: "Bultenime Katil",
      ctaDescription: "Yeni yazilardan haberdar olmak icin e-posta bultenime kaydolun.",
      testimonials: [
        { name: "Cem Yilmaz", role: "Okuyucu", content: "Yazilarin cok akici ve bilgilendirici. Her yeni yaziyi sabrsizlikla bekliyorum.", rating: 5 },
        { name: "Neslihan Acar", role: "Blog Yazari", content: "Seyahat rehberleri gercekten cok detayli ve faydali.", rating: 5 },
      ],
      faqItems: [
        { question: "Ne siklikta yazi yayinliyorsunuz?", answer: "Haftada en az bir yazi yayinlamayi hedefliyorum." },
        { question: "Konuk yazar olabilir miyim?", answer: "Evet, konuk yazi onerileri icin iletisim sayfasindan bana ulasabilirsiniz." },
      ],
    },
    pages: [
      { name: "Ana Sayfa", slug: "/", sectionTypes: ["hero", "about", "services", "cta"] },
      { name: "Hakkimda", slug: "hakkimda", sectionTypes: ["hero", "about", "testimonials"] },
      { name: "Iletisim", slug: "iletisim", sectionTypes: ["hero", "contact", "faq"] },
    ],
  },
];

// ─── Section Builders ─────────────────────────────────────────────────────────

let _sectionCounter = 0;
function sectionId(): string {
  _sectionCounter++;
  return `gen-${Date.now()}-${_sectionCounter}`;
}

function makeHero(
  title: string,
  subtitle: string,
  description: string,
  ctaText: string = "Iletisim",
  ctaLink: string = "/iletisim"
): HeroData {
  return {
    title,
    subtitle,
    description,
    backgroundImage: "",
    ctaText,
    ctaLink,
    alignment: "center",
    overlayOpacity: 60,
    height: "large",
  };
}

function makeBannerHero(title: string, subtitle: string): HeroData {
  return {
    title,
    subtitle,
    description: "",
    backgroundImage: "",
    ctaText: "Ana Sayfaya Don",
    ctaLink: "/",
    alignment: "center",
    overlayOpacity: 65,
    height: "medium",
  };
}

function makeAbout(
  businessName: string,
  description: string
): AboutData {
  return {
    title: "Hakkimizda",
    subtitle: businessName,
    description,
    image: "",
    features: [
      { icon: "star", title: "Kalite", description: "En yuksek standartlarda hizmet" },
      { icon: "users", title: "Deneyim", description: "Yillardir sektorde guvenilir isim" },
      { icon: "heart", title: "Musteri Memnuniyeti", description: "Musteri odakli yaklasim" },
    ],
    layout: "image-right",
  };
}

function makeServices(items: Array<{ title: string; description: string }>): ServicesData {
  return {
    title: "Hizmetlerimiz",
    subtitle: "Size neler sunuyoruz",
    items: items.map((item) => ({
      icon: "briefcase",
      title: item.title,
      description: item.description,
      image: "",
    })),
    layout: "grid",
    columns: 3,
  };
}

function makeTestimonials(items: Array<{ name: string; role: string; content: string; rating: number }>): TestimonialsData {
  return {
    title: "Musterilerimiz Ne Diyor?",
    subtitle: "Gercek deneyimler, gercek yorumlar",
    items: items.map((item) => ({
      name: item.name,
      role: item.role,
      avatar: "",
      content: item.content,
      rating: item.rating,
    })),
    layout: "grid",
  };
}

function makeCta(title: string, description: string): CtaData {
  return {
    title,
    description,
    buttonText: "Iletisime Gecin",
    buttonLink: "/iletisim",
  };
}

function makeContact(): ContactData {
  return {
    title: "Iletisim",
    subtitle: "Bize ulasin",
    showMap: true,
    showForm: true,
    formFields: [
      { name: "name", type: "text", label: "Adiniz Soyadiniz", required: true },
      { name: "email", type: "email", label: "E-posta Adresiniz", required: true },
      { name: "phone", type: "phone", label: "Telefon", required: false },
      { name: "message", type: "textarea", label: "Mesajiniz", required: true },
    ],
  };
}

function makeFaq(items: Array<{ question: string; answer: string }>): FaqData {
  return {
    title: "Sikca Sorulan Sorular",
    subtitle: "Merak edilenler",
    items,
  };
}

function makeGallery(): GalleryData {
  return {
    title: "Galeri",
    subtitle: "Calismalarimizdan kareler",
    images: [],
    layout: "grid",
    columns: 3,
  };
}

function makeTeam(): TeamData {
  return {
    title: "Ekibimiz",
    subtitle: "Profesyonel kadromuz",
    members: [],
    layout: "grid",
  };
}

function makePricing(): PricingData {
  return {
    title: "Fiyatlarimiz",
    subtitle: "Size uygun paketi secin",
    plans: [
      {
        name: "Baslangic",
        price: "---",
        period: "aylik",
        description: "Temel hizmetler",
        features: ["Temel ozellikler", "E-posta destek"],
        isPopular: false,
        ctaText: "Secin",
        ctaLink: "/iletisim",
      },
      {
        name: "Profesyonel",
        price: "---",
        period: "aylik",
        description: "En populer paket",
        features: ["Tum ozellikler", "Oncelikli destek", "Ozel cozumler"],
        isPopular: true,
        ctaText: "Secin",
        ctaLink: "/iletisim",
      },
    ],
  };
}

function makeMenu(): MenuData {
  return {
    title: "Menumuz",
    subtitle: "Lezzetlerimizi kesfedin",
    categories: [
      {
        name: "Ana Yemekler",
        items: [
          { name: "Ozel Menu", description: "Gunun ozel menusu", price: "---" },
        ],
      },
    ],
    layout: "cards",
    showImages: false,
  };
}

function makeHeader(
  businessName: string,
  pages: Array<{ name: string; slug: string }>
): HeaderData {
  return {
    layout: "left-aligned",
    sticky: true,
    transparent: false,
    menuItems: pages.map((p) => ({
      label: p.name,
      link: p.slug === "/" ? "/" : `/${p.slug}`,
    })),
  };
}

function makeFooter(businessName: string): FooterData {
  return {
    layout: "simple",
    copyright: `© ${new Date().getFullYear()} ${businessName}. Tum haklar saklidir.`,
    showSocialLinks: true,
    showNewsletter: false,
  };
}

// ─── Section Factory ──────────────────────────────────────────────────────────

function buildSection(
  type: string,
  order: number,
  businessName: string,
  sector: SectorInfo,
  description?: string
): SiteSection {
  const sc = sector.sampleContent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any;

  switch (type) {
    case "hero":
      data = makeHero(
        sc.heroTitle,
        sc.heroSubtitle,
        description || sc.heroDescription,
        sc.ctaTitle,
        "/iletisim"
      );
      break;
    case "about":
      data = makeAbout(businessName, description || sc.aboutDescription);
      break;
    case "services":
      data = makeServices(sc.services);
      break;
    case "testimonials":
      data = makeTestimonials(sc.testimonials);
      break;
    case "cta":
      data = makeCta(sc.ctaTitle, sc.ctaDescription);
      break;
    case "contact":
      data = makeContact();
      break;
    case "faq":
      data = makeFaq(sc.faqItems);
      break;
    case "gallery":
      data = makeGallery();
      break;
    case "team":
      data = makeTeam();
      break;
    case "pricing":
      data = makePricing();
      break;
    case "menu":
      data = makeMenu();
      break;
    default:
      data = makeHero(sc.heroTitle, sc.heroSubtitle, sc.heroDescription);
  }

  return {
    id: sectionId(),
    type: type as SiteSection["type"],
    data,
    isVisible: true,
    order,
  };
}

// ─── Main Generator ──────────────────────────────────────────────────────────

export function generateSiteConfig(
  businessName: string,
  sectorId: string,
  description?: string,
  options?: SiteGenerationOptions
): SiteConfig {
  const sector = SECTORS.find((s) => s.id === sectorId);
  if (!sector) {
    throw new Error(`Bilinmeyen sektor: ${sectorId}`);
  }

  // Reset counter for deterministic IDs within a generation
  _sectionCounter = 0;

  // Apply option overrides
  const colors = options?.colorPalette ?? sector.colorPalette;
  const fonts = options?.fonts ?? sector.fonts;

  // Build style for non-hero sections
  const sectionStyleOverride: SectionStyle | undefined =
    (options?.cardStyle || options?.spacing)
      ? {
          ...(options.cardStyle ? { cardStyle: options.cardStyle } : {}),
          ...(options.spacing ? { spacing: options.spacing } : {}),
        }
      : undefined;

  // Determine page definitions: use overrides or sector defaults
  const pageDefs = options?.pageOverrides
    ? options.pageOverrides.map((ov) => {
        const original = sector.pages.find((p) => p.slug === ov.slug);
        return {
          name: original?.name ?? (ov.slug === "/" ? "Ana Sayfa" : ov.slug),
          slug: ov.slug,
          sectionTypes: ov.sectionTypes,
        };
      })
    : sector.pages;

  const sectorKeywords = [sector.label.toLowerCase(), businessName.toLowerCase()];

  // Build pages
  const pages: SitePage[] = pageDefs.map((pageDef, pageIdx) => {
    const isHome = pageDef.slug === "/";
    const sections: SiteSection[] = pageDef.sectionTypes.map((sType, sIdx) => {
      let section: SiteSection;

      // For non-home pages, first section is a banner hero
      if (sType === "hero" && !isHome) {
        section = {
          id: sectionId(),
          type: "hero" as const,
          data: makeBannerHero(pageDef.name, businessName),
          isVisible: true,
          order: sIdx,
        };
      } else if (sType === "hero" && isHome) {
        section = buildSection("hero", sIdx, businessName, sector, description);
      } else if (sType === "about" && isHome) {
        section = buildSection("about", sIdx, businessName, sector, description);
      } else {
        section = buildSection(sType, sIdx, businessName, sector);
      }

      // Apply hero variant override
      if (sType === "hero" && options?.heroVariant && isHome) {
        (section.data as HeroData).variant = options.heroVariant;
      }

      // Apply section style override for non-hero sections
      if (sType !== "hero" && sectionStyleOverride) {
        section.style = { ...sectionStyleOverride };
      }

      return section;
    });

    return {
      id: `page-${Date.now()}-${pageIdx}`,
      name: pageDef.name,
      slug: pageDef.slug,
      order: pageIdx,
      sections,
      seo: {
        title: isHome
          ? `${businessName} — ${sector.label}`
          : `${pageDef.name} — ${businessName}`,
        description: isHome
          ? (description || sector.sampleContent.businessDescription)
          : `${businessName} ${pageDef.name.toLowerCase()} sayfasi`,
      },
    };
  });

  const config: SiteConfig = {
    global: {
      colors: { ...colors },
      fonts: { ...fonts },
      seo: {
        title: `${businessName} — ${sector.label}`,
        description: description || sector.sampleContent.businessDescription,
        ogImage: "",
        favicon: "",
        keywords: [...sectorKeywords, "turkiye"],
      },
      general: {
        businessName,
        logo: "",
        phone: "",
        email: "",
        address: "",
        socialLinks: {},
      },
      layout: {
        header: makeHeader(businessName, pageDefs),
        footer: makeFooter(businessName),
      },
    },
    pages,
  };

  return config;
}

export function getSectorById(id: string): SectorInfo | undefined {
  return SECTORS.find((s) => s.id === id);
}
