import type { SiteConfig, HeaderData, FooterData } from "@/types/template";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function makeHeader(items: Array<{ label: string; link: string }>, opts?: Partial<HeaderData>): HeaderData {
  return {
    layout: "left-aligned",
    sticky: true,
    transparent: false,
    menuItems: items,
    ...opts,
  };
}

function makeFooter(copyright: string, columns?: FooterData["columns"]): FooterData {
  return {
    layout: columns ? "columns" : "simple",
    copyright,
    columns,
    showSocialLinks: true,
    showNewsletter: false,
  };
}

function bannerHero(title: string, subtitle: string, link: string = "/") {
  return {
    title,
    subtitle,
    description: "",
    backgroundImage: "",
    ctaText: "Ana Sayfaya Don",
    ctaLink: link,
    alignment: "center" as const,
    overlayOpacity: 65,
    height: "medium" as const,
  };
}

// ─── FLAVOR — Restoran ─────────────────────────────────────────────────────────

export const flavorConfig: SiteConfig = {
  global: {
    colors: {
      primary: "#c2410c",
      secondary: "#9a3412",
      accent: "#ea580c",
      background: "#fffbf7",
      surface: "#ffffff",
      text: "#1c1917",
      textLight: "#78716c",
    },
    fonts: { heading: "Playfair Display", body: "Inter" },
    seo: {
      title: "Lezzet Duragi — El Yapimi Yemekler",
      description: "Istanbul'un kalbinde, taze malzemeler ve ozgun tariflerle hazirlanan ev yapimi lezzetler.",
      ogImage: "",
      favicon: "",
      keywords: ["restoran", "istanbul", "ev yemegi", "lezzet"],
    },
    general: {
      businessName: "Lezzet Duragi",
      logo: "",
      phone: "+90 (212) 555 12 34",
      email: "merhaba@lezzetduragi.com",
      address: "Beyoglu, Istiklal Cad. No:42, Istanbul",
      socialLinks: {
        instagram: "https://instagram.com/lezzetduragi",
        facebook: "https://facebook.com/lezzetduragi",
      },
    },
    layout: {
      header: makeHeader([
        { label: "Ana Sayfa", link: "/" },
        { label: "Menumuzu", link: "/menu" },
        { label: "Galeri", link: "/galeri" },
        { label: "Hakkimizda", link: "/hakkimizda" },
        { label: "Iletisim", link: "/iletisim" },
      ]),
      footer: makeFooter("© 2025 Lezzet Duragi. Tum haklar saklidir.", [
        {
          title: "Sayfalar",
          links: [
            { label: "Ana Sayfa", link: "/" },
            { label: "Menumuzu", link: "/menu" },
            { label: "Galeri", link: "/galeri" },
            { label: "Hakkimizda", link: "/hakkimizda" },
          ],
        },
        {
          title: "Iletisim",
          links: [
            { label: "+90 (212) 555 12 34", link: "tel:+902125551234" },
            { label: "merhaba@lezzetduragi.com", link: "mailto:merhaba@lezzetduragi.com" },
            { label: "Rezervasyon", link: "/iletisim" },
          ],
        },
      ]),
    },
  },
  pages: [
    {
      id: "page-home",
      name: "Ana Sayfa",
      slug: "",
      order: 0,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          order: 0,
          isVisible: true,
          data: {
            title: "Her Lokmanin Bir Hikayesi Var",
            subtitle: "Geleneksel Tatlar, Modern Dokunuslar",
            description: "Dededen toruna gecen tarifleri, bugünün damak tadina uygun modernlikle sofranizia tasiyoruz.",
            backgroundImage: "",
            ctaText: "Rezervasyon Yap",
            ctaLink: "/iletisim",
            secondaryCtaText: "Menuye Goz At",
            secondaryCtaLink: "/menu",
            alignment: "center",
            overlayOpacity: 45,
            height: "full",
          },
        },
        {
          id: "about-1",
          type: "about",
          order: 1,
          isVisible: true,
          data: {
            title: "2010'dan Bu Yana Istanbul'dayiz",
            subtitle: "Hikayemiz",
            description: "Lezzet Duragi, 2010 yilinda Beyoglu'nun tarihi sokaklarinda kucuk bir kahvalticilik olarak aci. Bugün 40'tan fazla oturma kapasitesiyle Istanbul'un en sevilen mahalle restoranlarindan biri olduk. Her sabah pazara gidip taze malzeme seciyoruz; cünkü lezzetin sirri burada basliyor.",
            image: "",
            features: [
              { icon: "leaf", title: "Taze Malzeme", description: "Her gün yerel pazardan alinan sebze ve meyveler." },
              { icon: "fire", title: "Geleneksel Tarifler", description: "3 nesil boyunca aktarilan, orijinal tarifler." },
              { icon: "star", title: "Odenek Alma", description: "Istanbul'un En iyi Restorani odülü 3 yil üst üste." },
            ],
            layout: "image-right",
          },
        },
        {
          id: "menu-1",
          type: "menu",
          order: 2,
          isVisible: true,
          data: {
            title: "Öne Cikan Lezzetler",
            subtitle: "Menumuzu Kesfedin",
            categories: [
              {
                name: "Kahvaltilar",
                items: [
                  { name: "Serpme Kahvalti", description: "Peynir cesitleri, zeytin, domates, salatalik, bal, kaymak", price: "₺320", badge: "Cok Satan" },
                  { name: "Menemen", description: "Ev yapimi domates sosu, biber, yumurta, tereyagi", price: "₺120" },
                  { name: "Simit Tabagi", description: "Taze simit, cream cheese, zeytin, domates", price: "₺95" },
                ],
              },
              {
                name: "Ana Yemekler",
                items: [
                  { name: "Islak Köfte", description: "El yapimi dana koftesi, islak ekmek, domates sosu", price: "₺185", badge: "Imza Yemek" },
                  { name: "Levrek Izgara", description: "Taze levrek, limon tereyagi sosu, mevsim salatasi", price: "₺280" },
                  { name: "Mercimek Corbasi", description: "Günlük taze pisirilmis, üzerine kizarmis yag", price: "₺75" },
                ],
              },
            ],
            layout: "detailed",
            showImages: false,
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          order: 3,
          isVisible: true,
          data: {
            title: "Musterilerimiz Ne Diyor?",
            subtitle: "Gercek Yorumlar",
            items: [
              { name: "Ayse Kaya", role: "Duzenli Musteri", avatar: "", content: "Yillardir geliyorum, hic hayal kirikligi yasatmadi. Serpme kahvaltisi Istanbul'un en iyisi.", rating: 5 },
              { name: "Mehmet Demir", role: "Yemek Blogcusu", avatar: "", content: "Islak köftesi baskasinda bulamazsiniz. Misafirperver personel, sicak ortam, her seyi mukemmel.", rating: 5 },
              { name: "Zeynep Arslan", role: "Otel Misafiri", avatar: "", content: "Istanbul gezimde denedim ve cok begendim. Fiyat performans muhtesem.", rating: 5 },
            ],
            layout: "grid",
          },
        },
        {
          id: "cta-1",
          type: "cta",
          order: 4,
          isVisible: true,
          data: {
            title: "Soframiza Bekleriz",
            description: "Özel günleriniz, is yemekleriniz ve aile toplantilari icin rezervasyon yapabilirsiniz.",
            buttonText: "Rezervasyon Yap",
            buttonLink: "/iletisim",
          },
        },
      ],
    },
    {
      id: "page-menu",
      name: "Menu",
      slug: "menu",
      order: 1,
      seo: { title: "Menumuzu — Lezzet Duragi", description: "Yemek, icecek ve tatli cesitlerimizi inceleyin." },
      sections: [
        {
          id: "hero-menu",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Menumuzu", "Taze ve Geleneksel Lezzetler"), height: "medium" },
        },
        {
          id: "menu-full",
          type: "menu",
          order: 1,
          isVisible: true,
          data: {
            title: "Tam Menumuzu",
            subtitle: "Her gun taze, her lokma ozel",
            categories: [
              {
                name: "Kahvaltilar",
                items: [
                  { name: "Serpme Kahvalti", description: "Peynir cesitleri, zeytin, domates, salatalik, bal, kaymak, recel", price: "₺320", badge: "Cok Satan" },
                  { name: "Menemen", description: "Ev yapimi domates sosu, biber, yumurta, tereyagi, maydanoz", price: "₺120" },
                  { name: "Simit Tabagi", description: "Taze simit, cream cheese, zeytin, domates, salatalik", price: "₺95" },
                  { name: "Sahanda Yumurta", description: "Iki yumurta, tereyagi veya zeytinyagi, tuz, karabiber", price: "₺85" },
                  { name: "Omlet", description: "Üc yumurta, peynir, domates, biber secenegiyle", price: "₺110" },
                ],
              },
              {
                name: "Corbalar",
                items: [
                  { name: "Mercimek Corbasi", description: "Günlük taze pisirilmis, limon, kirmizi pul biber", price: "₺75" },
                  { name: "Tarhana", description: "Ev yapimi tarhana, nane, kirmizi biber", price: "₺80" },
                  { name: "Iskembe", description: "Ev yapimi, sirkeli sarımsakli sos", price: "₺110" },
                ],
              },
              {
                name: "Ana Yemekler",
                items: [
                  { name: "Islak Köfte", description: "El yapimi dana koftesi, islak ekmek, domates sosu, baharat", price: "₺185", badge: "Imza Yemek" },
                  { name: "Levrek Izgara", description: "Taze levrek, limon tereyagi sosu, mevsim salatasi", price: "₺280" },
                  { name: "Tavuk Sis", description: "Marine edilmis tavuk gögsü, pirinc pilavi, cacik", price: "₺160" },
                  { name: "Kuru Fasulye", description: "Geleneksel tarif, pilav ve tursu esliginde", price: "₺120" },
                ],
              },
              {
                name: "Tatlilar",
                items: [
                  { name: "Künefe", description: "Antakya usulü tel kadayif, usumlu peynir, seker sosu, fisik", price: "₺145", badge: "Ozel" },
                  { name: "Sütlac", description: "Firinda pirinc sütlaci, tarçin", price: "₺85" },
                  { name: "Baklava", description: "Fisikli veya cevizli, serbetli", price: "₺95" },
                ],
              },
              {
                name: "Icecekler",
                items: [
                  { name: "Cay", description: "Demlik cay, iki bardak", price: "₺30" },
                  { name: "Türk Kahvesi", description: "Geleneksel Türk kahvesi, lokumlu", price: "₺55" },
                  { name: "Limonata", description: "Ev yapimi, taze sikma limon", price: "₺65" },
                  { name: "Taze Meyve Suyu", description: "Portakal, elma, visne secenegiyle", price: "₺75" },
                ],
              },
            ],
            layout: "detailed",
            showImages: false,
          },
        },
      ],
    },
    {
      id: "page-galeri",
      name: "Galeri",
      slug: "galeri",
      order: 2,
      seo: { title: "Galeri — Lezzet Duragi", description: "Restoranımızdan fotograflar." },
      sections: [
        {
          id: "hero-galeri",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Galeri", "Restoranımızdan Kareler"), height: "medium" },
        },
        {
          id: "gallery-full",
          type: "gallery",
          order: 1,
          isVisible: true,
          data: {
            title: "Fotograflarimiz",
            subtitle: "Yemeklerimiz, Mekânımız ve Anlar",
            images: [
              { url: "", alt: "Serpme Kahvalti Tabagi", caption: "Ozel Serpme Kahvalti" },
              { url: "", alt: "Restoranin Ic Mekani", caption: "Sicak ve Davetkar Ortamimiz" },
              { url: "", alt: "Islak Köfte", caption: "Imza Yemegimiz" },
              { url: "", alt: "Sabah Hazirlik", caption: "Her Gün Taze" },
              { url: "", alt: "Masalar", caption: "75 Kisilik Kapasitemiz" },
              { url: "", alt: "Tatlı Tabagi", caption: "Ev Yapımı Tatlilar" },
            ],
            layout: "masonry",
            columns: 3,
          },
        },
      ],
    },
    {
      id: "page-hakkimizda",
      name: "Hakkimizda",
      slug: "hakkimizda",
      order: 3,
      seo: { title: "Hakkimizda — Lezzet Duragi", description: "Hikayemiz, ekibimiz ve degerlerimiz." },
      sections: [
        {
          id: "hero-about",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hakkimizda", "Hikayemizi Ogrenin"), height: "medium" },
        },
        {
          id: "about-full",
          type: "about",
          order: 1,
          isVisible: true,
          data: {
            title: "2010'dan Bu Yana",
            subtitle: "Istanbul'un En Sevilen Restoranlarindan Biri",
            description: "Lezzet Duragi'nin temeli, Feride Hanim'in büyükannesinden ogrendigi tariflere dayanir. 2010'da 10 masalik kücük bir mekan olarak baslayan bu serüven, bugün 75 kisilik kapasitesiyle Istanbul'un gurme haritasinda saygın bir yer edinmistir.\n\nBiz sadece yemek pisirilmiyor; hikayeler anlatiyoruz. Her tarifin arkasindan nesiller boyu aktarilan bir gelenek, bir anı ve bir sevgi var. Malzemelerimizi her sabah yerel üreticilerden aliyoruz cünkü kaliteden taviz vermeyi hic düsünmedik.",
            image: "",
            features: [
              { icon: "leaf", title: "Yerel Tedarik", description: "Tüm malzemeler yerel üreticilerden, gun icinde temin edilir." },
              { icon: "fire", title: "Nesiller Boyu Tarifler", description: "3 kusaktan aktarilan orijinal Türk mutfagi tarifleri." },
              { icon: "star", title: "Ödüller", description: "Time Out Istanbul'un 'Yilin Restorani' odülü (2022, 2023, 2024)." },
              { icon: "heart", title: "Topluluk", description: "Her hafta düzenlenen atölyeler ve mahalle etkinlikleriyle bir parçayiz." },
            ],
            layout: "image-left",
          },
        },
        {
          id: "team-1",
          type: "team",
          order: 2,
          isVisible: true,
          data: {
            title: "Ekibimiz",
            subtitle: "Mutfagimizin Kalbi",
            members: [
              { name: "Feride Kaya", role: "Kurucu & Bas Asci", image: "", bio: "20 yillik deneyimiyle Türk mutfaginin en ozgün tariflerini hayata geciriyor." },
              { name: "Kemal Yildiz", role: "Sous Chef", image: "", bio: "Le Cordon Bleu Istanbul mezunu, Türk ve Fransiz mutfagi uzmanı." },
              { name: "Selin Celik", role: "Pastane Sefi", image: "", bio: "Geleneksel Türk tatlilarina modern dokunuslar katiyor." },
              { name: "Omer Sahin", role: "Restoran Müdürü", image: "", bio: "15 yillik sektör tecrübesiyle misafir memnuniyetini en üst düzeyde tutuyor." },
            ],
            layout: "grid",
          },
        },
        {
          id: "faq-1",
          type: "faq",
          order: 3,
          isVisible: true,
          data: {
            title: "Sikça Sorulan Sorular",
            subtitle: "",
            items: [
              { question: "Rezervasyon zorunlu mu?", answer: "Hafta sonları ve ozel günler icin rezervasyon onerilir. Hafta ici genellikle bekleme olmadan girebilirsiniz." },
              { question: "Vejetaryen secenekler var mi?", answer: "Evet, menumuzdeki pek cok yemek vejetaryen veya vegan alternatifleriyle sunulmaktadir." },
              { question: "Paket servis yapıyor musunuz?", answer: "Evet, saat 11:00-22:00 arasinda paket servisimiz aktiftir." },
              { question: "Özel etkinlik icin mekan kiralanabilir mi?", answer: "Restoranin tamami veya belirli bir bölümü için ozel etkinlik organizasyonu yapabiliyoruz. Detaylar için iletisime gecin." },
            ],
          },
        },
      ],
    },
    {
      id: "page-iletisim",
      name: "Iletisim",
      slug: "iletisim",
      order: 4,
      seo: { title: "Iletisim — Lezzet Duragi", description: "Rezervasyon ve iletisim bilgileri." },
      sections: [
        {
          id: "hero-iletisim",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Iletisim", "Bizimle İletisime Gecin"), height: "medium" },
        },
        {
          id: "contact-1",
          type: "contact",
          order: 1,
          isVisible: true,
          data: {
            title: "Rezervasyon & Iletisim",
            subtitle: "Sizi gorup agirlamak icin sabırsizlanıyoruz.",
            showMap: true,
            mapEmbedUrl: "",
            showForm: true,
            formFields: [
              { name: "name", type: "text", label: "Adiniz Soyadiniz", required: true },
              { name: "phone", type: "phone", label: "Telefon Numaraniz", required: true },
              { name: "email", type: "email", label: "E-posta Adresiniz", required: false },
              { name: "date", type: "text", label: "Rezervasyon Tarihi", required: false },
              { name: "guests", type: "select", label: "Kisi Sayisi", required: false, options: ["1-2 kisi", "3-4 kisi", "5-8 kisi", "9+ kisi"] },
              { name: "message", type: "textarea", label: "Ozel Istekleriniz", required: false },
            ],
          },
        },
      ],
    },
  ],
};

// ─── VERTEX — Kurumsal ─────────────────────────────────────────────────────────

export const vertexConfig: SiteConfig = {
  global: {
    colors: {
      primary: "#1d4ed8",
      secondary: "#1e3a8a",
      accent: "#3b82f6",
      background: "#f8faff",
      surface: "#ffffff",
      text: "#0f172a",
      textLight: "#64748b",
    },
    fonts: { heading: "Inter", body: "Inter" },
    seo: {
      title: "Vertex Digital — Dijital Dönüsüm Ajansi",
      description: "Isletmenizi dijital dünyada büyütmek icin stratejik çözümler sunuyoruz.",
      ogImage: "",
      favicon: "",
      keywords: ["dijital ajans", "web tasarim", "seo", "dijital pazarlama"],
    },
    general: {
      businessName: "Vertex Digital",
      logo: "",
      phone: "+90 (212) 555 99 00",
      email: "merhaba@vertexdigital.com.tr",
      address: "Levent, Büyükdere Cad. No:185, Istanbul",
      socialLinks: {
        linkedin: "https://linkedin.com/company/vertexdigital",
        twitter: "https://twitter.com/vertexdigital",
        instagram: "https://instagram.com/vertexdigital",
      },
    },
    layout: {
      header: makeHeader([
        { label: "Ana Sayfa", link: "/" },
        { label: "Hizmetler", link: "/hizmetler" },
        { label: "Hakkimizda", link: "/hakkimizda" },
        { label: "Blog", link: "/blog" },
        { label: "Iletisim", link: "/iletisim" },
      ]),
      footer: makeFooter("© 2025 Vertex Digital. Tum haklar saklidir.", [
        {
          title: "Sirket",
          links: [
            { label: "Ana Sayfa", link: "/" },
            { label: "Hakkimizda", link: "/hakkimizda" },
            { label: "Kariyer", link: "/kariyer" },
            { label: "Blog", link: "/blog" },
          ],
        },
        {
          title: "Hizmetler",
          links: [
            { label: "Web Tasarim", link: "/hizmetler" },
            { label: "SEO & Icerik", link: "/hizmetler" },
            { label: "Sosyal Medya", link: "/hizmetler" },
            { label: "Reklam", link: "/hizmetler" },
          ],
        },
        {
          title: "Iletisim",
          links: [
            { label: "+90 (212) 555 99 00", link: "tel:+902125559900" },
            { label: "merhaba@vertexdigital.com.tr", link: "mailto:merhaba@vertexdigital.com.tr" },
          ],
        },
      ]),
    },
  },
  pages: [
    {
      id: "page-home",
      name: "Ana Sayfa",
      slug: "",
      order: 0,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          order: 0,
          isVisible: true,
          data: {
            title: "Isletmenizi Dijitalde Büyütüyoruz",
            subtitle: "Stratejik Dijital Dönüsüm",
            description: "Web tasarim, SEO, sosyal medya ve dijital reklamcilik alanlarinda bütüncül cözümler sunuyoruz. Markanizi rakiplerinizin önüne geciriyoruz.",
            backgroundImage: "",
            ctaText: "Ücretsiz Danismanlik",
            ctaLink: "/iletisim",
            secondaryCtaText: "Hizmetlerimiz",
            secondaryCtaLink: "/hizmetler",
            alignment: "left",
            overlayOpacity: 50,
            height: "full",
          },
        },
        {
          id: "stats-1",
          type: "stats",
          order: 1,
          isVisible: true,
          data: {
            items: [
              { value: "250", suffix: "+", label: "Tamamlanan Proje" },
              { value: "98", suffix: "%", label: "Musteri Memnuniyeti" },
              { value: "8", suffix: " Yil", label: "Sektor Deneyimi" },
              { value: "40", suffix: "+", label: "Uzman Ekip" },
            ],
            layout: "grid",
            background: "primary",
          },
        },
        {
          id: "services-1",
          type: "services",
          order: 2,
          isVisible: true,
          data: {
            title: "Hizmetlerimiz",
            subtitle: "Dijital Basarinin Her Aşamasinda Yaninizdayiz",
            items: [
              { icon: "globe", title: "Web Tasarim & Gelistirme", description: "Mobil uyumlu, hizli ve modern web siteleri.", image: "", price: "" },
              { icon: "search", title: "SEO & Icerik Pazarlama", description: "Google'da üst siralara cıkin, organik trafik kazanin.", image: "", price: "" },
              { icon: "chart", title: "Dijital Reklam (Google & Meta)", description: "Hedef kitleye ulasan, ölcülebilir reklam kampanyalari.", image: "", price: "" },
              { icon: "users", title: "Sosyal Medya Yönetimi", description: "Marka bilinirliginizi artiran sosyal medya stratejisi.", image: "", price: "" },
              { icon: "mail", title: "E-posta Pazarlama", description: "Kisiyestirilmis kampanyalarla musteri bagliligi.", image: "", price: "" },
              { icon: "bar-chart", title: "Analitik & Raporlama", description: "Veri tabanli kararlar icin detayli analizler.", image: "", price: "" },
            ],
            layout: "grid",
            columns: 3,
          },
        },
        {
          id: "about-1",
          type: "about",
          order: 3,
          isVisible: true,
          data: {
            title: "Neden Vertex Digital?",
            subtitle: "8 Yil, 250+ Basarili Proje",
            description: "2017'de kurulan Vertex Digital, Türkiye'nin önde gelen dijital pazarlama ajanslarindan biri haline geldi. Istanbul merkezli 40+ kisiden olusan ekibimiz; strateji, tasarim, teknoloji ve veri analizini birlestirerek müsterilerimize rekabet üstünlügü sagliyor.",
            image: "",
            features: [
              { icon: "target", title: "Sonuc Odakli", description: "Her kampanya net KPI'lar ve ölcülebilir hedeflerle yürütülür." },
              { icon: "shield", title: "Seffaf Raporlama", description: "Haftalik detayli raporlar ve 7/24 iletisim." },
              { icon: "zap", title: "Hizli Teslimat", description: "Ajans bürokrasisini minimize eden ccevik yapi." },
            ],
            layout: "image-right",
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          order: 4,
          isVisible: true,
          data: {
            title: "Musterilerimiz Anlatiyor",
            subtitle: "Gercek Basari Hikayeleri",
            items: [
              { name: "Ali Yilmaz", role: "Genel Müdür, TechCo", avatar: "", content: "Vertex ile calismaya basladigimizdan bu yana organik trafiğimiz %340 artti. Harika bir ekip.", rating: 5 },
              { name: "Elif Dogan", role: "Pazarlama Direktörü, Moda A.S.", avatar: "", content: "Sosyal medya yönetimi konusunda gercekten uzmanlar. Takipci sayimiz 3 ayda ikiyle katilandi.", rating: 5 },
              { name: "Can Kaya", role: "Girisimci", avatar: "", content: "Web sitem icin muazzam is cikardilar. Dönüsüm oranlarim %85 yükseldi.", rating: 5 },
            ],
            layout: "grid",
          },
        },
        {
          id: "cta-1",
          type: "cta",
          order: 5,
          isVisible: true,
          data: {
            title: "Ücretsiz Strateji Seansı Alin",
            description: "30 dakikalk ücretsiz görüsmede isletmeniz icin en uygun dijital stratejiyi konusacagız.",
            buttonText: "Randevu Al",
            buttonLink: "/iletisim",
          },
        },
      ],
    },
    {
      id: "page-hizmetler",
      name: "Hizmetler",
      slug: "hizmetler",
      order: 1,
      seo: { title: "Hizmetler — Vertex Digital", description: "Web tasarim, SEO, dijital reklam ve daha fazlasi." },
      sections: [
        {
          id: "hero-hizmetler",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hizmetlerimiz", "Isletmeniz Icin Tam Kapsamli Dijital Cözümler") },
        },
        {
          id: "services-full",
          type: "services",
          order: 1,
          isVisible: true,
          data: {
            title: "Ne Yapiyoruz?",
            subtitle: "Her Ihtiyaciniz Icin Özel Cözüm",
            items: [
              { icon: "globe", title: "Web Tasarim & Gelistirme", description: "Mobil uyumlu, SEO dostu, hizli yüklenen modern web siteleri. Next.js, React ve WordPress ile gelistirme.", image: "", price: "10.000 ₺'den basliyor" },
              { icon: "search", title: "SEO & Icerik Pazarlama", description: "Anahtar kelime analizi, teknik SEO, blog yazarligi ve backlink stratejisiyle Google'in ilk sayfasina cıkin.", image: "", price: "4.500 ₺/ay" },
              { icon: "chart", title: "Google Ads", description: "Arama, display ve alışveris kampanyalariyla hedef kitlenize hizla ulasin.", image: "", price: "Reklam bütcesi üzerinden %15" },
              { icon: "users", title: "Meta (Facebook & Instagram) Reklamlari", description: "Detayli hedefleme ile satis ve potansiyel musteri üretimi.", image: "", price: "Reklam bütcesi üzerinden %15" },
              { icon: "camera", title: "Sosyal Medya Yönetimi", description: "Icerik üretimi, planlama, yorum yönetimi ve büyüme stratejisi.", image: "", price: "6.000 ₺/ay" },
              { icon: "mail", title: "E-posta & WhatsApp Pazarlama", description: "Otomasyon, segmentasyon ve kisiyestirilmis kampanyalar.", image: "", price: "3.000 ₺/ay" },
            ],
            layout: "cards",
            columns: 2,
          },
        },
        {
          id: "pricing-1",
          type: "pricing",
          order: 2,
          isVisible: true,
          data: {
            title: "Paketler",
            subtitle: "Her Olcekte Isletmeye Uygun Fiyatlar",
            plans: [
              {
                name: "Baslangic",
                price: "9.500",
                period: "₺/ay",
                description: "Kücük isletmeler ve girisimler icin temel dijital varlik paketi.",
                features: ["Web sitesi yönetimi", "SEO temelleri", "Aylik raporlama", "2 sosyal medya platformu", "E-posta destegi"],
                isPopular: false,
                ctaText: "Hemen Basla",
                ctaLink: "/iletisim",
              },
              {
                name: "Büyüme",
                price: "21.500",
                period: "₺/ay",
                description: "Büyümek isteyen orta olcekli sirketler icin kapsamli dijital pazarlama.",
                features: ["Web gelistirme dahil", "Tam SEO paketi", "Google & Meta Ads yönetimi", "4 sosyal medya platformu", "Haftalik raporlama", "Öncelikli destek"],
                isPopular: true,
                ctaText: "Önerileni Sec",
                ctaLink: "/iletisim",
              },
              {
                name: "Kurumsal",
                price: "Özel",
                period: "fiyatlandirma",
                description: "Büyük kurumlar ve e-ticaret icin tamamen kisiyestirilmis paket.",
                features: ["Tüm hizmetler dahil", "Ozel strateji ekibi", "7/24 destek", "Aylık stratejik danismanlik", "A/B testleri", "Öncelikli gelistirme"],
                isPopular: false,
                ctaText: "Teklif Al",
                ctaLink: "/iletisim",
              },
            ],
          },
        },
        {
          id: "faq-hizmetler",
          type: "faq",
          order: 3,
          isVisible: true,
          data: {
            title: "Sikca Sorulan Sorular",
            subtitle: "",
            items: [
              { question: "Sozlesme süresi ne kadar?", answer: "Minimum 3 aylik calısma tavsiye ediyoruz. Aylık yenilenebilir esnek sozlesmeler sunuyoruz." },
              { question: "Sonuclar ne zaman gorülür?", answer: "SEO icin 3-6 ay, reklam kampanyalari icin 2-4 hafta ortalama süremiz." },
              { question: "Raporlari nasil alacagim?", answer: "Haftalik özet rapor ve aylik detayli analiz raporu e-posta ile gönderilir. Ozel bir panel de kullanima sunulur." },
              { question: "Kendi icerigimi saglayabilir miyim?", answer: "Evet, kendi iceriklerinizi kullanabilirsiniz ya da ekibimiz sizin icin üretir." },
            ],
          },
        },
      ],
    },
    {
      id: "page-hakkimizda",
      name: "Hakkimizda",
      slug: "hakkimizda",
      order: 2,
      seo: { title: "Hakkimizda — Vertex Digital", description: "Ekibimiz ve sirket hikayemiz." },
      sections: [
        {
          id: "hero-hakkimizda",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hakkimizda", "Dijital Dönüsümün Öncüsü") },
        },
        {
          id: "about-full",
          type: "about",
          order: 1,
          isVisible: true,
          data: {
            title: "Kısaca Vertex Digital",
            subtitle: "2017'den Bu Yana Fark Yaratiyoruz",
            description: "Vertex Digital, 2017 yilinda Berke Sahin ve Selin Arslan tarafindan kuruldu. 'Dijital dönüsümü her isletmenin erisebilecegi bir hale getirmek' misyonuyla yola cikan ajansimiz, bugün 40+ uzman kadrosuyla Türkiye'nin en aktif dijital pazarlama ajanslari arasinda yer almaktadir.\n\nHer müsterinin kendine özgü ihtiyaclari olduguna inaniyoruz. Standart paketler yerine, veriye dayali analizler ve derin sektör bilgisiyle sekillenen özel stratejiler üretiyoruz.",
            image: "",
            features: [
              { icon: "award", title: "Sektör Ödülleri", description: "IAB Türkiye En Iyi Dijital Ajans Ödülü (2023)." },
              { icon: "users", title: "40+ Uzman", description: "Tasarim, gelistirme, analiz ve strateji uzmanlarindan olusan kadro." },
              { icon: "globe", title: "Uluslararasi Projeler", description: "Türkiye disinda 15+ ülkede proje deneyimi." },
            ],
            layout: "image-left",
          },
        },
        {
          id: "team-1",
          type: "team",
          order: 2,
          isVisible: true,
          data: {
            title: "Liderlik Ekibi",
            subtitle: "Arkamizdaki Güc",
            members: [
              { name: "Berke Sahin", role: "CEO & Kurucu", image: "", bio: "10 yillik dijital pazarlama deneyimi. Daha önce Google ve Meta'da calistı.", socialLinks: { linkedin: "#" } },
              { name: "Selin Arslan", role: "COO & Kurucu", image: "", bio: "Strateji ve büyüme konularinda uzman. MBA, Koç Üniversitesi.", socialLinks: { linkedin: "#" } },
              { name: "Burak Yildiz", role: "Teknik Direktör", image: "", bio: "Full-stack gelistirici, 8 yillik web uygulama deneyimi.", socialLinks: { linkedin: "#" } },
              { name: "Nazli Cetin", role: "Yaratici Direktör", image: "", bio: "Marka kimliği ve görsel iletisim uzmanı. Tasarım alaninda 7 yil.", socialLinks: { linkedin: "#" } },
            ],
            layout: "grid",
          },
        },
        {
          id: "stats-about",
          type: "stats",
          order: 3,
          isVisible: true,
          data: {
            title: "Rakamlarda Vertex",
            items: [
              { value: "250", suffix: "+", label: "Proje" },
              { value: "8", suffix: " Yil", label: "Deneyim" },
              { value: "40", suffix: "+", label: "Uzman" },
              { value: "15", suffix: "+", label: "Ülke" },
            ],
            layout: "grid",
            background: "surface",
          },
        },
      ],
    },
    {
      id: "page-blog",
      name: "Blog",
      slug: "blog",
      order: 3,
      seo: { title: "Blog — Vertex Digital", description: "Dijital pazarlama, SEO ve web tasarimi üzerine makaleler." },
      sections: [
        {
          id: "hero-blog",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Blog", "Dijital Dünyadan Bilgi ve Ilham") },
        },
        {
          id: "blog-full",
          type: "blog",
          order: 1,
          isVisible: true,
          data: {
            title: "Son Yazilar",
            subtitle: "Guncel dijital pazarlama icerikleri",
            layout: "grid",
            showReadMore: true,
            postsPerPage: 6,
            showCategories: true,
          },
        },
      ],
    },
    {
      id: "page-iletisim",
      name: "Iletisim",
      slug: "iletisim",
      order: 4,
      seo: { title: "Iletisim — Vertex Digital", description: "Ücretsiz danismanlik ve teklif talep edin." },
      sections: [
        {
          id: "hero-iletisim",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Iletisim", "Ücretsiz Danismanlik Alin") },
        },
        {
          id: "contact-1",
          type: "contact",
          order: 1,
          isVisible: true,
          data: {
            title: "Bize Ulasin",
            subtitle: "24 saat içinde geri dönüs saglıyoruz.",
            showMap: false,
            showForm: true,
            formFields: [
              { name: "name", type: "text", label: "Adiniz Soyadiniz", required: true },
              { name: "company", type: "text", label: "Sirket Adiniz", required: false },
              { name: "email", type: "email", label: "Is E-postaniz", required: true },
              { name: "phone", type: "phone", label: "Telefonunuz", required: false },
              { name: "service", type: "select", label: "Ilgilendiginiz Hizmet", required: false, options: ["Web Tasarim", "SEO", "Google Ads", "Sosyal Medya", "Diger"] },
              { name: "budget", type: "select", label: "Aylik Bütce Araligıniz", required: false, options: ["5.000 - 10.000 ₺", "10.000 - 25.000 ₺", "25.000 ₺+", "Bilmiyorum"] },
              { name: "message", type: "textarea", label: "Projeniz Hakkinda", required: false },
            ],
          },
        },
      ],
    },
  ],
};

// ─── SHOWCASE — Portfolyo ─────────────────────────────────────────────────────

export const showcaseConfig: SiteConfig = {
  global: {
    colors: {
      primary: "#18181b",
      secondary: "#27272a",
      accent: "#a1a1aa",
      background: "#fafafa",
      surface: "#ffffff",
      text: "#18181b",
      textLight: "#71717a",
    },
    fonts: { heading: "DM Sans", body: "DM Sans" },
    seo: {
      title: "Mehmet Demir — UI/UX & Brand Tasarimcisi",
      description: "Markalar icin dijital kimlik ve kullanici deneyimi tasarimi.",
      ogImage: "",
      favicon: "",
      keywords: ["ui ux tasarim", "marka tasarimi", "freelance", "grafik tasarim"],
    },
    general: {
      businessName: "Mehmet Demir",
      logo: "",
      phone: "+90 (532) 555 77 88",
      email: "merhaba@mehmetdemir.design",
      address: "Istanbul, Türkiye",
      socialLinks: {
        instagram: "https://instagram.com/mehmetdemir.design",
        linkedin: "https://linkedin.com/in/mehmetdemir",
        twitter: "https://twitter.com/mehmetdemir",
      },
    },
    layout: {
      header: makeHeader([
        { label: "Ana Sayfa", link: "/" },
        { label: "Projeler", link: "/projeler" },
        { label: "Hizmetler", link: "/hizmetler" },
        { label: "Hakkimda", link: "/hakkimda" },
        { label: "Iletisim", link: "/iletisim" },
      ], { layout: "split" }),
      footer: makeFooter("© 2025 Mehmet Demir. Tüm haklar saklidir."),
    },
  },
  pages: [
    {
      id: "page-home",
      name: "Ana Sayfa",
      slug: "",
      order: 0,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          order: 0,
          isVisible: true,
          data: {
            title: "Markanizi Hayata Geciriyorum",
            subtitle: "UI/UX & Brand Designer",
            description: "6 yillik deneyimle 80+ marka ve dijital urun tasarladim. Estetik, islev ve stratejiyi birlestiren tasarimlar.",
            backgroundImage: "",
            ctaText: "Projelerime Bak",
            ctaLink: "/projeler",
            secondaryCtaText: "Iletisime Gec",
            secondaryCtaLink: "/iletisim",
            alignment: "left",
            overlayOpacity: 0,
            height: "large",
          },
        },
        {
          id: "gallery-preview",
          type: "gallery",
          order: 1,
          isVisible: true,
          data: {
            title: "Öne Cikan Projeler",
            subtitle: "Son Calismalarim",
            images: [
              { url: "", alt: "SaaS Dashboard Tasarimi", caption: "Fintech SaaS / B2B Dashboard" },
              { url: "", alt: "Moda Markasi Kimligi", caption: "Fashion Brand Identity" },
              { url: "", alt: "Mobil Uygulama UI", caption: "E-Commerce Mobile App" },
              { url: "", alt: "Restoran Websitesi", caption: "Restaurant Brand & Web" },
              { url: "", alt: "Kurumsal Kimlik", caption: "Corporate Identity System" },
              { url: "", alt: "Landing Page Tasarimi", caption: "Tech Startup Landing Page" },
            ],
            layout: "masonry",
            columns: 3,
          },
        },
        {
          id: "services-preview",
          type: "services",
          order: 2,
          isVisible: true,
          data: {
            title: "Neler Yapiyorum?",
            subtitle: "Hizmetlerim",
            items: [
              { icon: "pen", title: "UI/UX Tasarim", description: "Web ve mobil uygulama arayüz tasarimi. Figma ile yüksek kaliteli prototipler.", image: "", price: "" },
              { icon: "star", title: "Marka Kimliği", description: "Logo, renk paleti, tipografi ve marka rehberi.", image: "", price: "" },
              { icon: "globe", title: "Web Tasarim", description: "Görseli güclü, kullanici dostu ve hizli web siteleri.", image: "", price: "" },
            ],
            layout: "grid",
            columns: 3,
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          order: 3,
          isVisible: true,
          data: {
            title: "Musterilerim Ne Diyor?",
            subtitle: "",
            items: [
              { name: "Canan Yildiz", role: "Kurucu, YildizTech", avatar: "", content: "Mehmet ile çalismanin en büyük artisi detaydaki ustaligi. Her piksel yerli yerinde.", rating: 5 },
              { name: "Tarkan Ozkaya", role: "CPO, Mobilya App", avatar: "", content: "Uygulamamizin kullanici deneyimini kokten dönüstürdü. Dönüsüm oranlarimiz %40 artti.", rating: 5 },
              { name: "Irem Sakar", role: "Pazarlama Direktörü", avatar: "", content: "Marka kimligimizi yeniledi. Artik fark yaratan bir görsel dilimiz var.", rating: 5 },
            ],
            layout: "grid",
          },
        },
        {
          id: "cta-1",
          type: "cta",
          order: 4,
          isVisible: true,
          data: {
            title: "Projenizi Konusalim",
            description: "Marka kimliginizi güclendirmek ya da dijital ürününüzü tasarlamak icin buradayim.",
            buttonText: "Iletisime Gec",
            buttonLink: "/iletisim",
          },
        },
      ],
    },
    {
      id: "page-projeler",
      name: "Projeler",
      slug: "projeler",
      order: 1,
      seo: { title: "Projeler — Mehmet Demir", description: "Tüm tasarim projelerimi inceleyin." },
      sections: [
        {
          id: "hero-projeler",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Projeler", "80+ Tamamlanan Proje"), height: "medium" },
        },
        {
          id: "gallery-full",
          type: "gallery",
          order: 1,
          isVisible: true,
          data: {
            title: "Tüm Calismalarim",
            subtitle: "Kategori, müsteri ve sektor olarak filtreleyebilirsiniz",
            images: [
              { url: "", alt: "SaaS Dashboard", caption: "Fintech SaaS Dashboard — B2B" },
              { url: "", alt: "Fashion Brand", caption: "Fashion Brand Identity — Koc Holding" },
              { url: "", alt: "Mobile App", caption: "E-Commerce Mobile App — iOS & Android" },
              { url: "", alt: "Restaurant", caption: "Restaurant Brand & Web — Lezzet Duragi" },
              { url: "", alt: "Corporate", caption: "Corporate Identity — Vertex Digital" },
              { url: "", alt: "Landing Page", caption: "Landing Page — Forge Tech" },
              { url: "", alt: "Blog Platform", caption: "Blog Platform UI — Craft" },
              { url: "", alt: "Hotel", caption: "Luxury Hotel Website — Zenith" },
              { url: "", alt: "Fitness", caption: "Fitness App — Pulse" },
            ],
            layout: "masonry",
            columns: 3,
          },
        },
      ],
    },
    {
      id: "page-hizmetler",
      name: "Hizmetler",
      slug: "hizmetler",
      order: 2,
      seo: { title: "Hizmetler & Fiyatlar — Mehmet Demir", description: "UI/UX, marka kimliği ve web tasarimi hizmetleri." },
      sections: [
        {
          id: "hero-hizmetler",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hizmetler & Fiyatlar", "Ihtiyaciniza Göre Secer") },
        },
        {
          id: "services-full",
          type: "services",
          order: 1,
          isVisible: true,
          data: {
            title: "Hizmetlerim",
            subtitle: "Her proje, sizi ve hedef kitlenizi anlamakla baslar",
            items: [
              { icon: "pen", title: "UI/UX Tasarim", description: "Kullanici arastirmasi, wireframe, prototip ve yüksek kaliteli Figma tasarimlari. Web ve mobil uygulama.", image: "", price: "7.500 ₺'den basliyor" },
              { icon: "star", title: "Marka Kimliği", description: "Logo tasarimi, renk sistemi, tipografi secimi ve kapsamli marka rehberi.", image: "", price: "12.000 ₺'den basliyor" },
              { icon: "globe", title: "Web Tasarim", description: "Figma'dan gelistirilmeye hazir, piksel mükemmeliyetinde web tasarimi.", image: "", price: "9.000 ₺'den basliyor" },
              { icon: "layout", title: "Tasarim Sistemi", description: "Scalable component library ve design token sistemi. React/Tailwind uyumlu.", image: "", price: "18.000 ₺'den basliyor" },
              { icon: "edit", title: "Danismanlik", description: "Mevcut ürününüzün UX denetimi ve iyilestirme önerileri.", image: "", price: "3.500 ₺/saat" },
            ],
            layout: "cards",
            columns: 2,
          },
        },
        {
          id: "pricing-1",
          type: "pricing",
          order: 2,
          isVisible: true,
          data: {
            title: "Paketler",
            subtitle: "Ihtiyaciniza en uygun paketi seciniz",
            plans: [
              {
                name: "Starter",
                price: "9.500",
                period: "₺ / proje",
                description: "Tek sayfalik web sitesi veya temel logo paketi.",
                features: ["1 sayfa web tasarimi", "Logo + renk paleti", "Mobil uyumlu", "2 revizyon hakkı", "Figma kaynak dosyasi"],
                isPopular: false,
                ctaText: "Baslayalim",
                ctaLink: "/iletisim",
              },
              {
                name: "Professional",
                price: "24.000",
                period: "₺ / proje",
                description: "Tam kapsamli marka kimliği + web sitesi paketi.",
                features: ["5 sayfaya kadar web tasarimi", "Tam marka kimliği paketi", "UI komponent kütüphanesi", "5 revizyon hakkı", "Figma + kaynak dosyalari", "30 gün destek"],
                isPopular: true,
                ctaText: "Sec",
                ctaLink: "/iletisim",
              },
              {
                name: "Enterprise",
                price: "Özel",
                period: "teklif",
                description: "Büyük ölcekli projeler ve süregelen tasarim ortakligi.",
                features: ["Sinırsiz sayfa", "Tasarim sistemi", "Developer handoff", "Süregelen destek", "Öncelikli atölye", "Aylık danismanlik"],
                isPopular: false,
                ctaText: "Görüsme Ayarla",
                ctaLink: "/iletisim",
              },
            ],
          },
        },
        {
          id: "faq-1",
          type: "faq",
          order: 3,
          isVisible: true,
          data: {
            title: "Sikça Sorulan Sorular",
            subtitle: "",
            items: [
              { question: "Proje ne kadar sürer?", answer: "Logo ve marka kimliği icin 2-3 hafta, tam web tasarimi icin 4-6 hafta süre gerekir." },
              { question: "Revizyon hakkı var mi?", answer: "Her paket icin belirlenmis revizyon hakki mevcuttur. Ek revizyonlar ücretlidir." },
              { question: "Tasarim dosyalarini alabilir miyim?", answer: "Evet, tüm projeler icin Figma kaynak dosyasi teslim edilir." },
              { question: "Gelistirme/kodlama da yapiyor musunuz?", answer: "Kodlama yapmiyorum; ancak developer handoff kapsamında tüm ölcüler, renkler ve varliklar düzenli sekilde teslim edilir." },
            ],
          },
        },
      ],
    },
    {
      id: "page-hakkimda",
      name: "Hakkimda",
      slug: "hakkimda",
      order: 3,
      seo: { title: "Hakkimda — Mehmet Demir", description: "Kim oldugum ve nasil calistigim." },
      sections: [
        {
          id: "hero-hakkimda",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hakkimda", "Tasarim, Benim Icin Bir Tutku") },
        },
        {
          id: "about-full",
          type: "about",
          order: 1,
          isVisible: true,
          data: {
            title: "Merhaba, Ben Mehmet",
            subtitle: "UI/UX & Brand Designer — Istanbul",
            description: "2019'dan bu yana full-time serbest calisan bir tasarimci olarak, markalar icin görsel kimlik ve dijital deneyimler tasarliyorum. Tasarima ilgim mimarliktan geliyor; her dijital deneyimi, kullanicinin icinde yasadigi bir alan gibi kurguluyorum.\n\nTasarimda bence en önemli sey netlik: kullanicinin ne yapacagini bilmesi ve bunu güzel bir deneyimle yasamasi. Estetik olmadan islev, islev olmadan estetik eksiktir.",
            image: "",
            features: [
              { icon: "award", title: "Awwwards Mansiyon", description: "2023 Site of the Day — Koc Holding Rebrand." },
              { icon: "users", title: "80+ Proje", description: "Kücük isletmeler ve Türkiye'nin önde gelen kurumsal markalari." },
              { icon: "globe", title: "6 Yil Deneyim", description: "Ajans, in-house ve freelance olmak üzere üc modelde." },
            ],
            layout: "image-right",
          },
        },
      ],
    },
    {
      id: "page-iletisim",
      name: "Iletisim",
      slug: "iletisim",
      order: 4,
      seo: { title: "Iletisim — Mehmet Demir", description: "Projenizi konusalim." },
      sections: [
        {
          id: "hero-iletisim",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Iletisim", "Projenizi Konusalim") },
        },
        {
          id: "contact-1",
          type: "contact",
          order: 1,
          isVisible: true,
          data: {
            title: "Mesaj Gönderin",
            subtitle: "Genellikle 24 saat icinde geri dönerim.",
            showMap: false,
            showForm: true,
            formFields: [
              { name: "name", type: "text", label: "Adiniz", required: true },
              { name: "email", type: "email", label: "E-posta", required: true },
              { name: "service", type: "select", label: "Hizmet Talebi", required: false, options: ["UI/UX Tasarim", "Marka Kimliği", "Web Tasarim", "Danismanlik", "Diger"] },
              { name: "budget", type: "select", label: "Tahmini Bütce", required: false, options: ["10.000 ₺ altı", "10.000 - 25.000 ₺", "25.000 ₺ üzeri"] },
              { name: "message", type: "textarea", label: "Projeniz Hakkinda", required: true },
            ],
          },
        },
      ],
    },
  ],
};

// ─── BLOOM — Güzellik & Spa ────────────────────────────────────────────────────

export const bloomConfig: SiteConfig = {
  global: {
    colors: {
      primary: "#be185d",
      secondary: "#9d174d",
      accent: "#ec4899",
      background: "#fdf2f8",
      surface: "#ffffff",
      text: "#1e1b1e",
      textLight: "#6b7280",
    },
    fonts: { heading: "Cormorant Garamond", body: "Lato" },
    seo: {
      title: "Bloom Güzellik & Spa — Istanbul Kadiköy",
      description: "Kendinize zaman ayirin. Profesyonel cilt bakimi, masaj, saç ve tırnak hizmetleri.",
      ogImage: "",
      favicon: "",
      keywords: ["güzellik salonu", "spa", "cilt bakimi", "masaj", "istanbul"],
    },
    general: {
      businessName: "Bloom Güzellik & Spa",
      logo: "",
      phone: "+90 (216) 555 33 44",
      email: "randevu@bloomspa.com.tr",
      address: "Kadiköy, Bahariye Cad. No:28, Istanbul",
      socialLinks: {
        instagram: "https://instagram.com/bloomspa",
        facebook: "https://facebook.com/bloomspa",
      },
    },
    layout: {
      header: makeHeader([
        { label: "Ana Sayfa", link: "/" },
        { label: "Hizmetler", link: "/hizmetler" },
        { label: "Galeri", link: "/galeri" },
        { label: "Hakkimizda", link: "/hakkimizda" },
        { label: "Iletisim", link: "/iletisim" },
      ]),
      footer: makeFooter("© 2025 Bloom Güzellik & Spa. Tüm haklar saklidir.", [
        {
          title: "Hizmetler",
          links: [
            { label: "Cilt Bakimi", link: "/hizmetler" },
            { label: "Masaj", link: "/hizmetler" },
            { label: "Sac Bakimi", link: "/hizmetler" },
            { label: "Tirnak Bakimi", link: "/hizmetler" },
          ],
        },
        {
          title: "Randevu",
          links: [
            { label: "Online Randevu", link: "/iletisim" },
            { label: "+90 (216) 555 33 44", link: "tel:+902165553344" },
            { label: "Calisma Saatleri", link: "/iletisim" },
          ],
        },
      ]),
    },
  },
  pages: [
    {
      id: "page-home",
      name: "Ana Sayfa",
      slug: "",
      order: 0,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          order: 0,
          isVisible: true,
          data: {
            title: "Kendinize Vakit Ayirin",
            subtitle: "Lüks Güzellik & Wellness Deneyimi",
            description: "Uzman ellerin dokunusuyla yenilenin. Cilt bakimindan masaja, sac bakimindan tırnak hizmetlerine kadar tüm güzellik ihtiyaclariniz bir arada.",
            backgroundImage: "",
            ctaText: "Randevu Al",
            ctaLink: "/iletisim",
            secondaryCtaText: "Hizmetlerimiz",
            secondaryCtaLink: "/hizmetler",
            alignment: "center",
            overlayOpacity: 40,
            height: "full",
          },
        },
        {
          id: "services-preview",
          type: "services",
          order: 1,
          isVisible: true,
          data: {
            title: "Hizmetlerimiz",
            subtitle: "Kendinizi En Iyi Hissedin",
            items: [
              { icon: "sparkles", title: "Cilt Bakimi", description: "Derin temizlik, nemlendirme ve anti-aging uygulamalar.", image: "", price: "550 ₺'den" },
              { icon: "heart", title: "Masaj & Terapi", description: "Klasik, aromaterapi, derin doku ve lenfatik masaj.", image: "", price: "650 ₺'den" },
              { icon: "scissors", title: "Sac Bakimi", description: "Keratin, botoks, renklendirme ve özel saç bakimi.", image: "", price: "400 ₺'den" },
              { icon: "star", title: "Tırnak Bakimi", description: "Manikür, pedikür ve kalici oje uygulamalari.", image: "", price: "280 ₺'den" },
            ],
            layout: "grid",
            columns: 4,
          },
        },
        {
          id: "about-1",
          type: "about",
          order: 2,
          isVisible: true,
          data: {
            title: "Neden Bloom?",
            subtitle: "Kadiköy'ün En Güvenilir Spa Merkezi",
            description: "2015'ten bu yana Kadiköy'de hizmet veren Bloom Güzellik & Spa, her müsterisine özel ve kişisellestirilmis güzellik deneyimi sunar. 12 uzman terapist ve estetisyenden olusan ekibimiz, Türkiye ve Avrupa'da egitim almis profesyonellerden olusur.",
            image: "",
            features: [
              { icon: "leaf", title: "Organik Ürünler", description: "Tüm uygulama ürünlerimiz sertifikalı organik ve cruelty-free." },
              { icon: "award", title: "Ödüllü Ekip", description: "Istanbul Güzellik Ödülleri 2024 — En Iyi Spa." },
              { icon: "users", title: "12 Uzman", description: "Türkiye ve Avrupa sertifikalı estetisyen ve terapistler." },
            ],
            layout: "image-right",
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          order: 3,
          isVisible: true,
          data: {
            title: "Müsterilerimizden",
            subtitle: "",
            items: [
              { name: "Pinar Ozkan", role: "Düzenli Musteri", avatar: "", content: "Aylarca gittigim yerlerden biri. Cilt bakimi sonrasi kendimi bambaşka hissediyorum.", rating: 5 },
              { name: "Esra Koc", role: "Ilk Ziyaret", avatar: "", content: "Masaj odasi cok sakin ve huzurluydu. Terapist gerçekten uzmanindi. Kesinlikle tekrar gidecegim.", rating: 5 },
              { name: "Hande Arslan", role: "Düzenli Musteri", avatar: "", content: "Sac botoksu muhteşemdi. Ürün kalitesi ve hijyen konusunda cok titizler.", rating: 5 },
            ],
            layout: "grid",
          },
        },
        {
          id: "cta-1",
          type: "cta",
          order: 4,
          isVisible: true,
          data: {
            title: "Ilk Randevunuz %20 Indirimli",
            description: "Online randevu alin, ilk ziyaretinizde tüm hizmetlerde %20 indirim kazanin.",
            buttonText: "Hemen Randevu Al",
            buttonLink: "/iletisim",
          },
        },
      ],
    },
    {
      id: "page-hizmetler",
      name: "Hizmetler",
      slug: "hizmetler",
      order: 1,
      seo: { title: "Hizmetler & Fiyatlar — Bloom Spa", description: "Tüm güzellik ve spa hizmetleri." },
      sections: [
        {
          id: "hero-hizmetler",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hizmetler", "Güzelliginiz Icin Her Sey Bir Arada") },
        },
        {
          id: "services-full",
          type: "services",
          order: 1,
          isVisible: true,
          data: {
            title: "Hizmet Listesi",
            subtitle: "Fiyatlara dahildir: temizlik, uygulama, maske, nemlendirme",
            items: [
              { icon: "sparkles", title: "Yüz Bakimi — Temel", description: "Derin temizlik, buharlama, gözenek temizleme, nemlendirme maskesi. (60 dk)", image: "", price: "550 ₺" },
              { icon: "sparkles", title: "Yüz Bakimi — Premium", description: "Temel paket + Vitamin C serum, microdermabrazyon, boyun bakimi. (90 dk)", image: "", price: "850 ₺" },
              { icon: "sparkles", title: "Anti-Aging Bakim", description: "Hiyalüronik asit, retinol, LED isiği terapi. (90 dk)", image: "", price: "1.100 ₺" },
              { icon: "heart", title: "Klasik Masaj", description: "Tüm vücut gevşeme masaji, aromaterapi yagi ile. (60 dk)", image: "", price: "650 ₺" },
              { icon: "heart", title: "Derin Doku Masaji", description: "Kas yorgunlugu ve gerginlik icin yogun baskı. (60 dk)", image: "", price: "750 ₺" },
              { icon: "heart", title: "Lenfatik Masaj", description: "Sisme ve toksin atimi icin. (60 dk)", image: "", price: "800 ₺" },
              { icon: "scissors", title: "Sac Keratin", description: "Brezilya keratin — hafıza dolasiklik, parlaklık. (2-3 saat)", image: "", price: "1.500 ₺+" },
              { icon: "scissors", title: "Sac Renklendirme", description: "Kök boyama, ombré, balyaj dahil tüm teknikler.", image: "", price: "800 ₺+" },
              { icon: "star", title: "Klasik Manikür", description: "Tırnak sekillendirme, törpüleme, kutikül bakimi ve oje. (40 dk)", image: "", price: "280 ₺" },
              { icon: "star", title: "Kalici Oje", description: "Shellac veya gel oje, 3 haftaya kadar dayaniklilik. (60 dk)", image: "", price: "400 ₺" },
            ],
            layout: "list",
            columns: 2,
          },
        },
        {
          id: "pricing-1",
          type: "pricing",
          order: 2,
          isVisible: true,
          data: {
            title: "Üyelik Paketleri",
            subtitle: "Düzenli bakim planlayin, önemli tasarruf edin",
            plans: [
              {
                name: "Aylik Bakim",
                price: "1.800",
                period: "₺/ay",
                description: "Ayda bir kapsamli bakım rutini.",
                features: ["1x Premium Yüz Bakimi", "1x Klasik Masaj (60 dk)", "Üye indirimi %10", "Online randevu önceligi"],
                isPopular: false,
                ctaText: "Üye Ol",
                ctaLink: "/iletisim",
              },
              {
                name: "Haftalik Wellness",
                price: "3.600",
                period: "₺/ay",
                description: "Haftada bir ziyaretle kendinize en iyi bakimi yapin.",
                features: ["4x Hizmet seciminiz", "Üye indirimi %20", "Öncelikli randevu", "Üye hediye paketi", "Organik ürün seti"],
                isPopular: true,
                ctaText: "En Populer",
                ctaLink: "/iletisim",
              },
              {
                name: "VIP",
                price: "Ozel",
                period: "paket",
                description: "Tamamen kisiyestirilmis, sınırsız ziyaret paketi.",
                features: ["Sınırsız ziyaret", "Özel terapist ataması", "Paket hediye seçenegi", "Evde bakım seti", "7/24 randevu", "Özel gün sürprizleri"],
                isPopular: false,
                ctaText: "Bilgi Al",
                ctaLink: "/iletisim",
              },
            ],
          },
        },
      ],
    },
    {
      id: "page-galeri",
      name: "Galeri",
      slug: "galeri",
      order: 2,
      seo: { title: "Galeri — Bloom Spa", description: "Mekânimiz ve uygulama fotograflari." },
      sections: [
        {
          id: "hero-galeri",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Galeri", "Mekânimizi Kesfedip") },
        },
        {
          id: "gallery-full",
          type: "gallery",
          order: 1,
          isVisible: true,
          data: {
            title: "Bloom'dan Kareler",
            subtitle: "Mekânimiz, ekibimiz ve uygulamalarimiz",
            images: [
              { url: "", alt: "Masaj Odasi", caption: "Premium Masaj Odasi" },
              { url: "", alt: "Cilt Bakimi", caption: "Yüz Bakimi Uygulamasi" },
              { url: "", alt: "Resepsiyon", caption: "Hosgeldiniz Alani" },
              { url: "", alt: "Sac Bakimi", caption: "Sac Bakimi Bölümü" },
              { url: "", alt: "Tirnak Bakimi", caption: "Manikür & Pedikür" },
              { url: "", alt: "Ürünler", caption: "Organik Bakim Ürünlerimiz" },
              { url: "", alt: "Bekleme Alani", caption: "Dinlendirici Bekleme Alani" },
              { url: "", alt: "Lounge", caption: "Wellness Lounge" },
            ],
            layout: "masonry",
            columns: 3,
          },
        },
      ],
    },
    {
      id: "page-hakkimizda",
      name: "Hakkimizda",
      slug: "hakkimizda",
      order: 3,
      seo: { title: "Hakkimizda — Bloom Spa", description: "Hikayemiz ve ekibimiz." },
      sections: [
        {
          id: "hero-hakkimizda",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Hakkimizda", "Güzelliginiz Bize Emanet") },
        },
        {
          id: "about-full",
          type: "about",
          order: 1,
          isVisible: true,
          data: {
            title: "Bloom'un Hikayesi",
            subtitle: "2015'ten Bu Yana Kadikoy'deyiz",
            description: "Bloom Güzellik & Spa, 2015 yilinda Derya Sahin tarafından kuruldu. Amac basitti: Kadiköy'e Avrupa standartlarinda, erişilebilir fiyatli bir spa deneyimi kazandırmak.\n\nBugün 12 uzman kadromuzla hizmet veriyoruz. Her birinin calisma prensibi aynı: Müsterinin sadece daha güzel degil, daha iyi hissetmesi.",
            image: "",
            features: [
              { icon: "leaf", title: "Sertifikalı Organik", description: "Tüm ürünler ECOCERT veya COSMOS sertifikalı." },
              { icon: "award", title: "Istanbul Güzellik Ödülü", description: "2024 — En Iyi Spa & Wellness Merkezi." },
              { icon: "heart", title: "5.000+ Mutlu Musteri", description: "Dönüsüm orani %78 ile sektörün üzerinde." },
            ],
            layout: "image-left",
          },
        },
        {
          id: "team-1",
          type: "team",
          order: 2,
          isVisible: true,
          data: {
            title: "Uzman Ekibimiz",
            subtitle: "Her birinin ortak noktasi: tutku ve uzmanlık",
            members: [
              { name: "Derya Sahin", role: "Kurucu & Bas Estetisyen", image: "", bio: "10 yillik estetisyen. Fransa ve Italya'da ileri estetik egitimi almis." },
              { name: "Naz Kaya", role: "Kıdemli Terapist", image: "", bio: "Aromaterapi, derin doku ve lenfatik masaj uzmanı. 7 yil deneyim." },
              { name: "Seda Yilmaz", role: "Sac Bakım Uzmanı", image: "", bio: "Loreal ve Wella sertifikalı. Karamel, balyaj ve keratin uzmanı." },
              { name: "Büsra Öztürk", role: "Tirnak Sanatcisi", image: "", bio: "3D nail art ve kalici oje konusunda uzman. 5 yil deneyim." },
            ],
            layout: "grid",
          },
        },
      ],
    },
    {
      id: "page-iletisim",
      name: "Iletisim",
      slug: "iletisim",
      order: 4,
      seo: { title: "Randevu — Bloom Spa", description: "Online randevu alin." },
      sections: [
        {
          id: "hero-iletisim",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Randevu & Iletisim", "Sizi Bekliyoruz") },
        },
        {
          id: "contact-1",
          type: "contact",
          order: 1,
          isVisible: true,
          data: {
            title: "Online Randevu",
            subtitle: "Formu doldurun, en kısa sürede sizi arayalim.",
            showMap: true,
            mapEmbedUrl: "",
            showForm: true,
            formFields: [
              { name: "name", type: "text", label: "Adiniz Soyadiniz", required: true },
              { name: "phone", type: "phone", label: "Telefon", required: true },
              { name: "service", type: "select", label: "Hizmet Seciniz", required: true, options: ["Yüz Bakimi", "Masaj", "Sac Bakimi", "Tirnak Bakimi", "Paket — Bilgi Almak Istiyorum"] },
              { name: "date", type: "text", label: "Tercih Ettiginiz Tarih", required: false },
              { name: "time", type: "select", label: "Tercih Ettiginiz Saat", required: false, options: ["09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00", "17:00-19:00"] },
              { name: "message", type: "textarea", label: "Ozel Istekleriniz", required: false },
            ],
          },
        },
      ],
    },
  ],
};

// ─── PULSE — Fitness ───────────────────────────────────────────────────────────

export const pulseConfig: SiteConfig = {
  global: {
    colors: {
      primary: "#dc2626",
      secondary: "#b91c1c",
      accent: "#ef4444",
      background: "#0a0a0a",
      surface: "#141414",
      text: "#f5f5f5",
      textLight: "#a3a3a3",
    },
    fonts: { heading: "Barlow Condensed", body: "Barlow" },
    seo: {
      title: "Pulse Fitness — Istanbul Sisli",
      description: "Premium spor salonu ve kisisel antrenman merkezi. Hedeflerinize ulasmaniz icin buradayiz.",
      ogImage: "",
      favicon: "",
      keywords: ["spor salonu", "fitness", "kisisel antrenör", "istanbul", "gym"],
    },
    general: {
      businessName: "Pulse Fitness",
      logo: "",
      phone: "+90 (212) 555 66 77",
      email: "info@pulsefitness.com.tr",
      address: "Sisli, Halaskargazi Cad. No:154, Istanbul",
      socialLinks: {
        instagram: "https://instagram.com/pulsefitness",
        youtube: "https://youtube.com/pulsefitness",
      },
    },
    layout: {
      header: makeHeader([
        { label: "Ana Sayfa", link: "/" },
        { label: "Programlar", link: "/programlar" },
        { label: "Fiyatlar", link: "/fiyatlar" },
        { label: "Ekibimiz", link: "/ekip" },
        { label: "Iletisim", link: "/iletisim" },
      ]),
      footer: makeFooter("© 2025 Pulse Fitness. Tüm haklar saklidir."),
    },
  },
  pages: [
    {
      id: "page-home",
      name: "Ana Sayfa",
      slug: "",
      order: 0,
      sections: [
        {
          id: "hero-1",
          type: "hero",
          order: 0,
          isVisible: true,
          data: {
            title: "Sinirlari Yik",
            subtitle: "Istanbul'un En Kapsamli Fitness Merkezi",
            description: "2.800 m² alan, 120+ ekipman, 15 grup dersi ve uzman antrenörler. Hedefiniz ne olursa olsun, biz yaninizdayiz.",
            backgroundImage: "",
            ctaText: "Ücretsiz Deneme",
            ctaLink: "/iletisim",
            secondaryCtaText: "Programlara Bak",
            secondaryCtaLink: "/programlar",
            alignment: "center",
            overlayOpacity: 55,
            height: "full",
          },
        },
        {
          id: "stats-1",
          type: "stats",
          order: 1,
          isVisible: true,
          data: {
            items: [
              { value: "2.800", suffix: " m²", label: "Antrenman Alani" },
              { value: "120", suffix: "+", label: "Ekipman" },
              { value: "15", label: "Grup Dersi / Hafta" },
              { value: "3.500", suffix: "+", label: "Aktif Üye" },
            ],
            layout: "grid",
            background: "primary",
          },
        },
        {
          id: "services-1",
          type: "services",
          order: 2,
          isVisible: true,
          data: {
            title: "Programlarimiz",
            subtitle: "Her Seviye, Her Hedef Icin",
            items: [
              { icon: "zap", title: "Kisisel Antrenman", description: "1-1 antrenör destegi ile hedefe odaklı, kisisel program.", image: "", price: "2.200 ₺/ay" },
              { icon: "users", title: "Grup Dersleri", description: "HIIT, CrossFit, Yoga, Pilates, Spinning ve daha fazlasi.", image: "", price: "Üyelige dahil" },
              { icon: "heart", title: "Beslenme Danismanligi", description: "Diyetisyen esliginde kisisel beslenme plani.", image: "", price: "1.500 ₺" },
              { icon: "bar-chart", title: "Vücut Analizi", description: "InBody cihazi ile detayli vücut kompozisyon analizi.", image: "", price: "250 ₺" },
            ],
            layout: "grid",
            columns: 4,
          },
        },
        {
          id: "testimonials-1",
          type: "testimonials",
          order: 3,
          isVisible: true,
          data: {
            title: "Üyelerimiz Anlatiyor",
            subtitle: "",
            items: [
              { name: "Taner Bulut", role: "3 Ayda 18 kg Verdi", avatar: "", content: "Kisisel antrenörüm Emir ile 3 ayda 18 kg verdim. Hayatim degisti. Artik sabah kalkinca enerjim cok yüksek.", rating: 5 },
              { name: "Gizem Yüce", role: "Grup Dersi Üyesi", avatar: "", content: "HIIT derslerini cok seviyorum. Hem egleniyorum hem ciddi sonuc aliyorum. Antrenörler süper motive edici.", rating: 5 },
              { name: "Kerem Arslan", role: "6 Aydír Üye", avatar: "", content: "Tesisi cok temiz ve modern. Ekipmanlar yeni ve bakimli. Kesinlikle tavsiye ederim.", rating: 5 },
            ],
            layout: "grid",
          },
        },
        {
          id: "cta-1",
          type: "cta",
          order: 4,
          isVisible: true,
          data: {
            title: "Bugün Baslayın",
            description: "Ilk 7 gün ücretsiz deneyin. Kredi karti gerekmez.",
            buttonText: "Ücretsiz Deneyin",
            buttonLink: "/iletisim",
          },
        },
      ],
    },
    {
      id: "page-programlar",
      name: "Programlar",
      slug: "programlar",
      order: 1,
      seo: { title: "Programlar — Pulse Fitness", description: "Tüm antrenman programlari." },
      sections: [
        {
          id: "hero-programlar",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Programlar", "Hedefiniz Ne Olursa Olsun") },
        },
        {
          id: "services-full",
          type: "services",
          order: 1,
          isVisible: true,
          data: {
            title: "Tüm Programlarimiz",
            subtitle: "Uzman rehberliginde, bilimsel temelli antrenman",
            items: [
              { icon: "zap", title: "Kisisel Antrenman", description: "Hedeflere özel program, haftada 2-5 seans. Ilerleme takibi ve program revizyonlari dahil.", image: "", price: "2.200 ₺/ay" },
              { icon: "users", title: "HIIT", description: "Yüksek yogunluklu interval antrenman. 45 dk, haftada 5 sefer. Yag yakimi odakli.", image: "", price: "Üyelige dahil" },
              { icon: "heart", title: "Yoga & Meditasyon", description: "Güc, esneklik ve zihin sagligi. Haftada 4 sefer sabah ve aksam seçenegi.", image: "", price: "Üyelige dahil" },
              { icon: "activity", title: "Pilates Reformer", description: "Reformer makinalari ile özel pilates. Max 6 kisilik gruplar.", image: "", price: "800 ₺/ay ek" },
              { icon: "bike", title: "Indoor Cycling", description: "Müzik esliginde yogun spinning seanslar. Haftada 6 sefer.", image: "", price: "Üyelige dahil" },
              { icon: "shield", title: "CrossFit", description: "Fonksiyonel güc ve kondisyon. Her seviye icin ölceklenebilir.", image: "", price: "Üyelige dahil" },
            ],
            layout: "cards",
            columns: 3,
          },
        },
        {
          id: "faq-programlar",
          type: "faq",
          order: 2,
          isVisible: true,
          data: {
            title: "Program Hakkinda Sikca Sorulanlar",
            subtitle: "",
            items: [
              { question: "Yeni baslayanlar hangi programdan baslasın?", answer: "Yeni baslayanlar icin önce bir vücut analizi yapilmasi ve bireysel danismanlik seansı önerilir. Ardindan hedefinize göre program belirlenir." },
              { question: "Kisisel antrenör zorunlu mu?", answer: "Hayir, zorunlu degil. Ancak hedeflerinize daha hızlı ve saglikli ulasmaniz icin ilk 1-2 ay kisisel antrenman tavsiye edilir." },
              { question: "Grup derslerine ek ücret var mi?", answer: "Temel üyelik paketine tüm grup dersleri dahildir. Pilates Reformer için ek ücret alinir." },
              { question: "Program degistirilebilir mi?", answer: "Evet. Her ay antrenörünüzle görüsüp programinizi güncelleyebilirsiniz." },
            ],
          },
        },
      ],
    },
    {
      id: "page-fiyatlar",
      name: "Fiyatlar",
      slug: "fiyatlar",
      order: 2,
      seo: { title: "Üyelik Fiyatlari — Pulse Fitness", description: "Üyelik paketleri ve fiyatlar." },
      sections: [
        {
          id: "hero-fiyatlar",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Üyelik Fiyatlari", "Hedeflerinize Uygun Paket") },
        },
        {
          id: "pricing-1",
          type: "pricing",
          order: 1,
          isVisible: true,
          data: {
            title: "Üyelik Paketleri",
            subtitle: "Her bütce ve hedef icin secenek",
            plans: [
              {
                name: "Temel",
                price: "1.200",
                period: "₺/ay",
                description: "Temel ekipmanlara erisim ve grup dersleri.",
                features: ["Sınırsız salon erişimi", "Tüm grup dersleri", "Duş & soyunma odasi", "Aylık vücut analizi", "Uygulama erişimi"],
                isPopular: false,
                ctaText: "Hemen Başla",
                ctaLink: "/iletisim",
              },
              {
                name: "Premium",
                price: "2.400",
                period: "₺/ay",
                description: "Kisisel antrenör dahil kapsamli üyelik.",
                features: ["Temel paket dahil", "4x kisisel antrenman/ay", "Beslenme danismanligi", "Öncelikli ders rezervasyonu", "Özel soyunma odasi", "Konuk hakkı (2/ay)"],
                isPopular: true,
                ctaText: "En Cok Tercih Edilen",
                ctaLink: "/iletisim",
              },
              {
                name: "Elite",
                price: "3.800",
                period: "₺/ay",
                description: "Tam kapsamli VIP üyelik deneyimi.",
                features: ["Premium paket dahil", "8x kisisel antrenman/ay", "Reformer Pilates dahil", "Fizyo danismanligi", "Özel locker", "Sınırsız konuk"],
                isPopular: false,
                ctaText: "Elite Ol",
                ctaLink: "/iletisim",
              },
            ],
          },
        },
        {
          id: "faq-1",
          type: "faq",
          order: 2,
          isVisible: true,
          data: {
            title: "Üyelik Hakkinda",
            subtitle: "",
            items: [
              { question: "Aylik mi yoksa yillik mi daha avantajli?", answer: "Yillik üyelikte %20 indirim uygulanir. Yillik odeme yapanlara ayrıca 2 ay hediye eklenir." },
              { question: "Sözlesme zorunlu mu?", answer: "Hayir, aylık yenilenebilir üyelik imkânı sunuyoruz. Iptal 15 gün önceden yapilmalidir." },
              { question: "Üyeligi dondurabilir miyim?", answer: "Evet, yilda bir kez 1 aya kadar üyelik dondurulabilir." },
              { question: "Ücretsiz deneme var mi?", answer: "Evet, ilk 7 gün ücretsiz deneme hakkınız mevcut." },
            ],
          },
        },
      ],
    },
    {
      id: "page-ekip",
      name: "Ekibimiz",
      slug: "ekip",
      order: 3,
      seo: { title: "Ekibimiz — Pulse Fitness", description: "Uzman antrenörlerimiz." },
      sections: [
        {
          id: "hero-ekip",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Ekibimiz", "Uzman Antrenörlerimiz") },
        },
        {
          id: "team-1",
          type: "team",
          order: 1,
          isVisible: true,
          data: {
            title: "Antrenörlerimiz",
            subtitle: "Her biri kendi alaninin uzmanı",
            members: [
              { name: "Emir Dogan", role: "Bas Antrenör & Kurucu", image: "", bio: "Milli atletizmci, 12 yillik kisisel antrenörlük. NASM-CPT sertifikalı.", socialLinks: { twitter: "#" } },
              { name: "Burak Kaya", role: "CrossFit & Güc", image: "", bio: "CrossFit Level 2 sertifikalı. 5 yil ulusal seviyede powerlifting.", socialLinks: { twitter: "#" } },
              { name: "Ela Sahin", role: "Yoga & Pilates", image: "", bio: "RYT-500 sertifikalı yoga egitmeni. Pilates Reformer uzmanı.", socialLinks: { twitter: "#" } },
              { name: "Hasan Yilmaz", role: "Beslenme & Diyetetik", image: "", bio: "Klinik diyetisyen. Spor beslenmesi ve vücut kompozisyonu uzmanı.", socialLinks: {} },
            ],
            layout: "grid",
          },
        },
      ],
    },
    {
      id: "page-iletisim",
      name: "Iletisim",
      slug: "iletisim",
      order: 4,
      seo: { title: "Iletisim — Pulse Fitness", description: "Ücretsiz deneme için bize ulasin." },
      sections: [
        {
          id: "hero-iletisim",
          type: "hero",
          order: 0,
          isVisible: true,
          data: { ...bannerHero("Iletisim", "Ücretsiz Deneme Rezervasyonu") },
        },
        {
          id: "contact-1",
          type: "contact",
          order: 1,
          isVisible: true,
          data: {
            title: "Bize Ulasin",
            subtitle: "Ücretsiz 7 günlük denemenizi planlamak icin formu doldurun.",
            showMap: false,
            showForm: true,
            formFields: [
              { name: "name", type: "text", label: "Adiniz Soyadiniz", required: true },
              { name: "phone", type: "phone", label: "Telefon", required: true },
              { name: "goal", type: "select", label: "Hedefiniz", required: false, options: ["Kilo Vermek", "Kas Kazanmak", "Saglikli Kalmak", "Kondisyon Artırmak", "Diger"] },
              { name: "message", type: "textarea", label: "Eklemek Istedikleriniz", required: false },
            ],
          },
        },
      ],
    },
  ],
};

// ─── CRAFT — Blog & Kisisel Marka ─────────────────────────────────────────────

export const craftConfig: SiteConfig = {
  global: {
    colors: { primary: "#292524", secondary: "#57534e", accent: "#d97706", background: "#fafaf9", surface: "#f5f5f4", text: "#1c1917", textLight: "#78716c" },
    fonts: { heading: "Merriweather", body: "Open Sans" },
    seo: { title: "Aylin Koc — Yazar & Icerik Uretici", description: "Teknoloji, minimalizm ve yaratici yasam uzerine yazilar.", ogImage: "", favicon: "", keywords: ["blog", "yazar", "teknoloji", "minimalizm"] },
    general: { businessName: "Aylin Koc", logo: "", phone: "", email: "merhaba@aylinkoc.com", address: "Istanbul, Türkiye", socialLinks: { instagram: "https://instagram.com/aylinkoc", twitter: "https://twitter.com/aylinkoc", linkedin: "https://linkedin.com/in/aylinkoc" } },
    layout: {
      header: makeHeader([{ label: "Ana Sayfa", link: "/" }, { label: "Blog", link: "/blog" }, { label: "Hakkimda", link: "/hakkimda" }, { label: "Iletisim", link: "/iletisim" }], { layout: "centered" }),
      footer: makeFooter("© 2025 Aylin Koc. Tüm haklar saklidir."),
    },
  },
  pages: [
    { id: "page-home", name: "Ana Sayfa", slug: "", order: 0, sections: [
      { id: "hero-1", type: "hero", order: 0, isVisible: true, data: { title: "Fikirler, Hikayeler ve Deneyimler", subtitle: "Aylin Koc — Yazar & Icerik Uretici", description: "Teknoloji, minimalizm ve yaratici yasam uzerine samimi yazilar.", backgroundImage: "", ctaText: "Yazilara Bak", ctaLink: "/blog", secondaryCtaText: "Hakkimda", secondaryCtaLink: "/hakkimda", alignment: "center", overlayOpacity: 45, height: "large" } },
      { id: "blog-preview", type: "blog", order: 1, isVisible: true, data: { title: "Son Yazilar", subtitle: "", layout: "grid", showReadMore: true, postsPerPage: 3, showCategories: false } },
      { id: "cta-1", type: "cta", order: 2, isVisible: true, data: { title: "Haftalik Bülten", description: "Her hafta en iyi yazilari, kaynaklari ve fikirleri dogrudan gelen kutunuza gönderiyorum.", buttonText: "Abone Ol", buttonLink: "/iletisim" } },
    ] },
    { id: "page-blog", name: "Blog", slug: "blog", order: 1, seo: { title: "Blog — Aylin Koc" }, sections: [
      { id: "hero-blog", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Blog", "Tüm Yazilarim") } },
      { id: "blog-full", type: "blog", order: 1, isVisible: true, data: { title: "Tum Yazilar", subtitle: "Teknoloji, tasarim, uretkenlik ve yaraticilik uzerine", layout: "grid", showReadMore: true, postsPerPage: 9, showCategories: true } },
    ] },
    { id: "page-hakkimda", name: "Hakkimda", slug: "hakkimda", order: 2, sections: [
      { id: "hero-hakkimda", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Hakkimda", "Merhaba, Ben Aylin") } },
      { id: "about-1", type: "about", order: 1, isVisible: true, data: { title: "Benim Hakkimda", subtitle: "Yazar, Icerik Uretici, Minimalizm Tutkunu", description: "Teknoloji, minimalizm ve yaratici yasam uzerine 5 yildir yaziyorum. Karmasik konulari sade ve anlasılir sekilde anlatmak en büyük tutkum. Bu blogda ogrendiklerimi, hatalarimi ve ilham aldıklarımı paylasıyorum.", image: "", features: [{ icon: "edit", title: "200+ Yazi", description: "Teknoloji, tasarim ve kisisel gelisim uzerine." }, { icon: "users", title: "50.000+ Okuyucu", description: "Her ay buyüyen okuyucu toplulugu." }, { icon: "mic", title: "Podcast", description: "Haftalik sesli icerikler ve roportajlar." }], layout: "image-right" } },
    ] },
    { id: "page-iletisim", name: "Iletisim", slug: "iletisim", order: 3, sections: [
      { id: "hero-iletisim", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Iletisim", "Merhaba Deyin") } },
      { id: "contact-1", type: "contact", order: 1, isVisible: true, data: { title: "Iletisim", subtitle: "Isbirligi, fikir alisverisi veya sadece merhaba icin.", showMap: false, showForm: true, formFields: [{ name: "name", type: "text", label: "Adiniz", required: true }, { name: "email", type: "email", label: "E-posta", required: true }, { name: "subject", type: "text", label: "Konu", required: true }, { name: "message", type: "textarea", label: "Mesajiniz", required: true }] } },
    ] },
  ],
};

// ─── ZENITH — Butik Otel ───────────────────────────────────────────────────────

export const zenithConfig: SiteConfig = {
  global: {
    colors: { primary: "#1c1917", secondary: "#44403c", accent: "#b8860b", background: "#faf9f7", surface: "#f5f0e8", text: "#1c1917", textLight: "#78716c" },
    fonts: { heading: "Playfair Display", body: "Raleway" },
    seo: { title: "Zenith Butik Otel — Izmir Alsancak", description: "Tarihi bir konakta modern lüks. Izmir'in kalbinde eşsiz konaklama deneyimi.", ogImage: "", favicon: "", keywords: ["butik otel", "izmir", "konaklama", "lüks", "alsancak"] },
    general: { businessName: "Zenith Butik Otel", logo: "", phone: "+90 (232) 555 66 77", email: "rezervasyon@zenithhotel.com", address: "Alsancak, Kordon Cad. No:12, Izmir", socialLinks: { instagram: "https://instagram.com/zenithhotel", facebook: "https://facebook.com/zenithhotel" } },
    layout: {
      header: makeHeader([{ label: "Ana Sayfa", link: "/" }, { label: "Odalar", link: "/odalar" }, { label: "Galeri", link: "/galeri" }, { label: "Hakkimizda", link: "/hakkimizda" }, { label: "Rezervasyon", link: "/rezervasyon" }], { transparent: true }),
      footer: makeFooter("© 2025 Zenith Butik Otel. Tüm haklar saklidir.", [{ title: "Otel", links: [{ label: "Odalar", link: "/odalar" }, { label: "Galeri", link: "/galeri" }, { label: "Hakkimizda", link: "/hakkimizda" }] }, { title: "Iletisim", links: [{ label: "+90 (232) 555 66 77", link: "tel:+902325556677" }, { label: "Rezervasyon", link: "/rezervasyon" }] }]),
    },
  },
  pages: [
    { id: "page-home", name: "Ana Sayfa", slug: "", order: 0, sections: [
      { id: "hero-1", type: "hero", order: 0, isVisible: true, data: { title: "Lüksün Yeni Tanimi", subtitle: "Zenith Butik Otel — Izmir Alsancak", description: "1920'lerde insaa edilmis tarihi bir konakta modern lüksü bulusturduk. Her detay, sizin icin tasarlandi.", backgroundImage: "", ctaText: "Rezervasyon Yap", ctaLink: "/rezervasyon", secondaryCtaText: "Odalari Incele", secondaryCtaLink: "/odalar", alignment: "center", overlayOpacity: 55, height: "full" } },
      { id: "about-1", type: "about", order: 1, isVisible: true, data: { title: "Neden Zenith?", subtitle: "Alsancak'in En Seckin Otellerinden", description: "20 ozel oda, ozel restoranımiz ve spa alanımizla Izmir'in tarihî dokusunda eşsiz bir konaklama deneyimi sunuyoruz.", image: "", features: [{ icon: "star", title: "20 Ozel Oda", description: "Her biri ayrı tema ve konforda tasarlanmis odalar." }, { icon: "award", title: "Ödüllü Restoran", description: "Ege mutfaginin en guzel orneklerini sunduğumuz restoranımız." }, { icon: "heart", title: "Spa & Pool", description: "Kapali havuz, sauna ve masaj odalariyla tam dinlenme." }], layout: "image-right" } },
      { id: "gallery-preview", type: "gallery", order: 2, isVisible: true, data: { title: "Otel Galeri", subtitle: "Zenith'in güzelligini kesfedın", images: [{ url: "", alt: "Lobby", caption: "Tarihi Lobby" }, { url: "", alt: "Suite", caption: "Deluxe Suite" }, { url: "", alt: "Restoran", caption: "Restoran" }, { url: "", alt: "Spa", caption: "Spa & Pool" }, { url: "", alt: "Teras", caption: "Sehir Manzarali Teras" }, { url: "", alt: "Oda", caption: "Standart Oda" }], layout: "grid", columns: 3 } },
      { id: "testimonials-1", type: "testimonials", order: 3, isVisible: true, data: { title: "Misafir Degerlendirmeleri", subtitle: "", items: [{ name: "Ali & Seda Yilmaz", role: "Balayı Ciftleri", avatar: "", content: "Balayımız icin sectimiz en dogru kararlardan biriydi. Her seyi mukemmeldi.", rating: 5 }, { name: "Marc Dupont", role: "Iş Seyahati", avatar: "", content: "Zenith is the only place I stay in Izmir. Exceptional service and atmosphere.", rating: 5 }, { name: "Fatma Ekinci", role: "Aile Tatili", avatar: "", content: "Cocuklarimizla cok güzel vakit gecirdik. Ekip son derece ilgili ve profesyonel.", rating: 5 }], layout: "grid" } },
      { id: "cta-1", type: "cta", order: 4, isVisible: true, data: { title: "Erken Rezervasyon Avantaji", description: "60 gün öncesinden yapilan rezervasyonlarda %15 indirim.", buttonText: "Hemen Rezervasyon Yap", buttonLink: "/rezervasyon" } },
    ] },
    { id: "page-odalar", name: "Odalar", slug: "odalar", order: 1, seo: { title: "Odalar & Fiyatlar — Zenith Butik Otel" }, sections: [
      { id: "hero-odalar", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Odalar & Fiyatlar", "Konforunuza Uygun Secenek") } },
      { id: "services-full", type: "services", order: 1, isVisible: true, data: { title: "Oda Kategorileri", subtitle: "28m²'den 75m²'ye genis secenek yelpazesi", items: [{ icon: "home", title: "Standart Oda", description: "28m², sehir manzarali, ikili veya tek kisilik, tüm konfor elemanlariyla donanimis.", image: "", price: "₺2.800 / gece" }, { icon: "star", title: "Deluxe Oda", description: "38m², Ege Denizi veya sehir manzarali, premium mobilyali.", image: "", price: "₺4.500 / gece" }, { icon: "layout", title: "Junior Suite", description: "50m², ayri oturma alani, uzun konaklamalar icin ideal.", image: "", price: "₺6.800 / gece" }, { icon: "award", title: "Suite", description: "75m², panoramik manzara, özel jakuzi, butler servisi.", image: "", price: "₺12.000 / gece" }, { icon: "users", title: "Aile Odasi", description: "65m², iki ayri yatak odasi, cocuk dostu tasarim.", image: "", price: "₺7.500 / gece" }, { icon: "heart", title: "Balayı Suite", description: "Ciceklerle bezeli, özel dekorasyon, romantik paket.", image: "", price: "₺15.000 / gece" }], layout: "cards", columns: 3 } },
      { id: "pricing-1", type: "pricing", order: 2, isVisible: true, data: { title: "Konaklama Paketleri", subtitle: "Tam bir tatil deneyimi icin özel paketler", plans: [{ name: "Standart", price: "₺2.800", period: "gece", description: "Temel konaklama.", features: ["Standart Oda", "Kahvalti dahil", "Ücretsiz Wi-Fi", "Spa erişimi (temel)"], isPopular: false, ctaText: "Rezervasyon", ctaLink: "/rezervasyon" }, { name: "Premium Tatil", price: "₺5.500", period: "gece", description: "En cok tercih edilen paket.", features: ["Deluxe Oda veya Junior Suite", "Açık hava kahvaltisi", "Akşam yemegi (2 kisi)", "Full spa erişimi", "Havalimani transferi"], isPopular: true, ctaText: "Rezervasyon", ctaLink: "/rezervasyon" }, { name: "Lüks", price: "Iletisim", period: "paket", description: "Özel istekler icin kisisel planlama.", features: ["Suite secenek", "Özel tur organizasyonu", "Butler servisi", "VIP transfer", "Özel romantik atmosfer"], isPopular: false, ctaText: "Bilgi Alin", ctaLink: "/rezervasyon" }] } },
    ] },
    { id: "page-galeri", name: "Galeri", slug: "galeri", order: 2, sections: [
      { id: "hero-galeri", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Galeri", "Zenith'ten Kareler") } },
      { id: "gallery-full", type: "gallery", order: 1, isVisible: true, data: { title: "Otelimizden Fotograflar", subtitle: "Odalarimiz, restoranımız ve mekânımız", images: [{ url: "", alt: "Lobby", caption: "Tarihi Lobby" }, { url: "", alt: "Deluxe Suite", caption: "Deluxe Suite" }, { url: "", alt: "Restoran", caption: "Ödüllü Restoranımız" }, { url: "", alt: "Spa", caption: "Spa Merkezi" }, { url: "", alt: "Havuz", caption: "Kapali Havuz" }, { url: "", alt: "Teras", caption: "Sehir Manzarali Teras" }, { url: "", alt: "Standart Oda", caption: "Standart Oda" }, { url: "", alt: "Balayı Suite", caption: "Balayı Suite" }, { url: "", alt: "Kahvalti", caption: "Açik Hava Kahvaltisi" }], layout: "masonry", columns: 3 } },
    ] },
    { id: "page-hakkimizda", name: "Hakkimizda", slug: "hakkimizda", order: 3, sections: [
      { id: "hero-hakkimizda", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Hakkimizda", "Tarihi Konak, Modern Lüks") } },
      { id: "about-full", type: "about", order: 1, isVisible: true, data: { title: "Zenith'in Hikayesi", subtitle: "1920'den Günümüze", description: "1920'lerde tüccar konagi olarak insaa edilen bina, 2018 yilinda kapsamli restorasyon projesiyle butik otele donusturüldü. Tarihi mimari detaylar korunarak modern konfor elemanlari eklendi. Bugün 20 özel odamiz, ödüllü restoranımız ve spa merkezimizle Izmir'in en seckin konaklama mekanlarindan biri haline geldik.", image: "", features: [{ icon: "award", title: "Ödüllü Otel", description: "Türkiye Turizm Bakanligi 5 yildiz." }, { icon: "leaf", title: "Sürdürülebilirlik", description: "Günes enerjisi ve yerel tedarik ile çevreci yaklaşım." }, { icon: "heart", title: "Kisisel Servis", description: "Her misafir icin özellestirilmis deneyim." }], layout: "image-left" } },
      { id: "team-1", type: "team", order: 2, isVisible: true, data: { title: "Yönetim Ekibi", subtitle: "", members: [{ name: "Kemal Yuce", role: "Genel Müdür", image: "", bio: "20 yillik konaklama sektörü deneyimi. Daha önce Ritz Carlton Istanbul'da genel müdür yardimcisi olarak calistı." }, { name: "Selin Dogan", role: "Operasyon Müdürü", image: "", bio: "Müsteri deneyimi uzmanı. Her misafirin unutulmaz bir deneyim yasamasini saglamak icin calisir." }, { name: "Chef Mustafa", role: "Bas Aşci", image: "", bio: "Ege mutfaginin en usta elleri. Paris'te egitim görmus, Michelin belgeli deneyim." }], layout: "grid" } },
    ] },
    { id: "page-rezervasyon", name: "Rezervasyon", slug: "rezervasyon", order: 4, sections: [
      { id: "hero-rezervasyon", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Rezervasyon", "Konaklamanizi Planlayın") } },
      { id: "contact-1", type: "contact", order: 1, isVisible: true, data: { title: "Rezervasyon Formu", subtitle: "En kisa sürede size geri dönecegiz.", showMap: false, showForm: true, formFields: [{ name: "name", type: "text", label: "Adiniz Soyadiniz", required: true }, { name: "email", type: "email", label: "E-posta", required: true }, { name: "phone", type: "phone", label: "Telefon", required: true }, { name: "checkin", type: "text", label: "Giris Tarihi", required: true }, { name: "checkout", type: "text", label: "Cikis Tarihi", required: true }, { name: "room", type: "select", label: "Oda Tipi", required: true, options: ["Standart Oda", "Deluxe Oda", "Junior Suite", "Suite", "Aile Odasi", "Balayı Suite"] }, { name: "guests", type: "select", label: "Misafir Sayisi", required: false, options: ["1 kisi", "2 kisi", "3 kisi", "4 kisi", "5+ kisi"] }, { name: "message", type: "textarea", label: "Özel Istekleriniz", required: false }] } },
    ] },
  ],
};

// ─── FORGE — Teknoloji & Ajans ─────────────────────────────────────────────────

export const forgeConfig: SiteConfig = {
  global: {
    colors: { primary: "#0f172a", secondary: "#1e293b", accent: "#6366f1", background: "#030712", surface: "#0f172a", text: "#f1f5f9", textLight: "#94a3b8" },
    fonts: { heading: "Space Grotesk", body: "Inter" },
    seo: { title: "Forge Agency — Web, Mobil & AI Cözümleri", description: "Uçtan uca yazilim ve dijital ürün gelistirme ajansi.", ogImage: "", favicon: "", keywords: ["yazilim", "web gelistirme", "mobil uygulama", "ai", "teknoloji"] },
    general: { businessName: "Forge Agency", logo: "", phone: "+90 (212) 555 00 11", email: "merhaba@forgeagency.co", address: "Teknopark Istanbul, Pendik, Istanbul", socialLinks: { linkedin: "https://linkedin.com/company/forgeagency", twitter: "https://twitter.com/forgeagency" } },
    layout: {
      header: makeHeader([{ label: "Ana Sayfa", link: "/" }, { label: "Urun", link: "/urun" }, { label: "Fiyatlar", link: "/fiyatlar" }, { label: "Hakkimizda", link: "/hakkimizda" }, { label: "Iletisim", link: "/iletisim" }]),
      footer: makeFooter("© 2025 Forge Agency. Tüm haklar saklidir.", [{ title: "Sirket", links: [{ label: "Ana Sayfa", link: "/" }, { label: "Hakkimizda", link: "/hakkimizda" }, { label: "Kariyer", link: "#" }, { label: "Blog", link: "#" }] }, { title: "Hizmetler", links: [{ label: "Web Gelistirme", link: "/urun" }, { label: "Mobil Uygulama", link: "/urun" }, { label: "AI Entegrasyon", link: "/urun" }, { label: "DevOps & Cloud", link: "/urun" }] }, { title: "Iletisim", links: [{ label: "+90 (212) 555 00 11", link: "tel:+902125550011" }, { label: "merhaba@forgeagency.co", link: "mailto:merhaba@forgeagency.co" }] }]),
    },
  },
  pages: [
    { id: "page-home", name: "Ana Sayfa", slug: "", order: 0, sections: [
      { id: "hero-1", type: "hero", order: 0, isVisible: true, data: { title: "Dijital Gelecegi Birlikte Insaayoruz", subtitle: "Teknoloji & Yazilim Ajansi", description: "Web, mobil ve yapay zeka cözümleriyle isletmenizi geleceğe taşimak icin buradayiz.", backgroundImage: "", ctaText: "Projenizi Anlatin", ctaLink: "/iletisim", secondaryCtaText: "Hizmetlerimiz", secondaryCtaLink: "/urun", alignment: "left", overlayOpacity: 60, height: "full" } },
      { id: "stats-1", type: "stats", order: 1, isVisible: true, data: { items: [{ value: "150", suffix: "+", label: "Tamamlanan Proje" }, { value: "40", suffix: "+", label: "Aktif Musteri" }, { value: "98", suffix: "%", label: "Musteri Memnuniyeti" }, { value: "4", label: "Ulkede Hizmet" }], layout: "grid", background: "surface" } },
      { id: "services-1", type: "services", order: 2, isVisible: true, data: { title: "Hizmetlerimiz", subtitle: "Uçtan uca dijital cözümler", items: [{ icon: "globe", title: "Web Gelistirme", description: "React, Next.js ile hizli ve güvenli web uygulamalari.", image: "", price: "" }, { icon: "phone", title: "Mobil Uygulama", description: "React Native ile iOS & Android.", image: "", price: "" }, { icon: "zap", title: "AI Entegrasyon", description: "ChatGPT, Claude ve yerel modellerle isletmenizi akillastiranın.", image: "", price: "" }, { icon: "server", title: "Backend & API", description: "Yüksek performansli API ve mikro-servis mimarileri.", image: "", price: "" }], layout: "grid", columns: 4 } },
      { id: "testimonials-1", type: "testimonials", order: 3, isVisible: true, data: { title: "Musteri Gorusleri", subtitle: "", items: [{ name: "Kemal Ozturk", role: "CEO, HealthTech Startup", avatar: "", content: "Forge ekibi hem teknik bilgi hem iletisim acısından mukemmel. Zamaninda ve bütce dahilinde teslim.", rating: 5 }, { name: "Anna Schmidt", role: "CTO, Berlin E-commerce", avatar: "", content: "They delivered a product that exceeded our expectations. Highly recommended.", rating: 5 }, { name: "Burak Aydin", role: "Fintech Girisimci", avatar: "", content: "Kompleks API entegrasyonlarimizi hatasiz gerceklestirdiler. Teknik kapasiteleri üstün.", rating: 5 }], layout: "grid" } },
      { id: "cta-1", type: "cta", order: 4, isVisible: true, data: { title: "Projenizi Hayata Gecirmeye Hazir misiniz?", description: "30 dakikalk ücretsiz kesfetme görüsmesiyle baslayin.", buttonText: "Ücretsiz Görüsme Planla", buttonLink: "/iletisim" } },
    ] },
    { id: "page-urun", name: "Urun", slug: "urun", order: 1, seo: { title: "Hizmetler — Forge Agency" }, sections: [
      { id: "hero-urun", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Hizmetlerimiz", "Kodluyoruz, Sonuc Yaratiyoruz") } },
      { id: "services-full", type: "services", order: 1, isVisible: true, data: { title: "Neler Yapiyoruz?", subtitle: "Her proje detayli planlama ve uzman ekiple hayata gecirilir", items: [{ icon: "globe", title: "Web Gelistirme", description: "React, Next.js, Vue, Angular. JAMstack ve headless CMS entegrasyonu. Hiz optimizasyonu ve SEO dostu.", image: "", price: "35.000 ₺'den" }, { icon: "phone", title: "Mobil Uygulama", description: "React Native ile iOS & Android. Native performans, tek kod tabanı.", image: "", price: "50.000 ₺'den" }, { icon: "cpu", title: "AI & Machine Learning", description: "ChatGPT, Claude, Gemini entegrasyonu. Fine-tuning, RAG, otomasyon.", image: "", price: "Teklif Al" }, { icon: "server", title: "Backend & API", description: "Node.js, Python, Go. REST, GraphQL, WebSocket. Mikro-servisler.", image: "", price: "25.000 ₺'den" }, { icon: "shield", title: "DevOps & Cloud", description: "AWS, GCP, Azure. Docker, Kubernetes, CI/CD, monitoring.", image: "", price: "15.000 ₺'den" }, { icon: "pen-tool", title: "UI/UX Tasarim", description: "Kullanici arastirmasi, wireframe, Figma prototipler, tasarim sistemi.", image: "", price: "20.000 ₺'den" }], layout: "cards", columns: 3 } },
    ] },
    { id: "page-fiyatlar", name: "Fiyatlar", slug: "fiyatlar", order: 2, seo: { title: "Fiyatlar — Forge Agency" }, sections: [
      { id: "hero-fiyatlar", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Proje Paketleri", "Bütcenize Göre Fiyatlandirma") } },
      { id: "pricing-1", type: "pricing", order: 1, isVisible: true, data: { title: "Paketler", subtitle: "Her olcekte isletmeye uygun çözüm", plans: [{ name: "Startup", price: "35.000", period: "₺ / proje", description: "Yeni girisimler icin temel dijital varlik.", features: ["Landing page veya kurumsal site", "Responsive tasarim", "Temel SEO kurulumu", "3 ay bakim destegi", "Hiz optimizasyonu"], isPopular: false, ctaText: "Konusalim", ctaLink: "/iletisim" }, { name: "Business", price: "85.000", period: "₺ / proje", description: "Büyüyen isletmeler icin kapsamli cözüm.", features: ["Tam özellikli web uygulamasi", "Mobil uygulama (iOS + Android)", "Backend API gelistirme", "Admin paneli", "6 ay bakim destegi", "Analitik & raporlama"], isPopular: true, ctaText: "Projeyi Baslatalim", ctaLink: "/iletisim" }, { name: "Enterprise", price: "Teklif Al", period: "", description: "Büyük ölcekli, özel ihtiyaclar icin.", features: ["Özel mimari tasarim", "AI/ML entegrasyon", "Dedicated gelistirici ekibi", "SLA garantili destek", "Cok dilli & cok para birimi", "Öncelikli yanıt"], isPopular: false, ctaText: "Bilgi Al", ctaLink: "/iletisim" }] } },
      { id: "faq-fiyatlar", type: "faq", order: 2, isVisible: true, data: { title: "Fiyatlar Hakkinda", subtitle: "", items: [{ question: "Fiyata ne dahildir?", answer: "Tüm paketlere tasarim, gelistirme ve 3-6 ay bakim destegi dahildir. Hosting ve domain ayridir." }, { question: "Ödeme nasil yapılır?", answer: "Projeler %30 pesinat, %40 orta aşama ve %30 teslimatta olmak üzere üc taksitle ödenir." }, { question: "Proje ne kadar sürer?", answer: "Startup paketi ortalama 4-6 hafta, Business paketi 8-12 haftadir. Enterprise projeler scopa göre değişir." }] } },
    ] },
    { id: "page-hakkimizda", name: "Hakkimizda", slug: "hakkimizda", order: 3, sections: [
      { id: "hero-hakkimizda", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Hakkimizda", "Kodlayan, Düsünen, Teslim Eden Ekip") } },
      { id: "about-1", type: "about", order: 1, isVisible: true, data: { title: "Forge Agency Hakkinda", subtitle: "2020'den Bu Yana, 150+ Proje", description: "Forge Agency, 2020 yilinda Deniz Kaya ve Lale Sahin tarafından kuruldu. 'Kaliteli yazilimi her isletmenin erisebilecegi hale getirmek' amacıyla yola cikan ekibimiz, bugün 15 uzman kadrosuyla Türkiye ve Avrupa'da projeler hayata geciriyor.", image: "", features: [{ icon: "award", title: "Ödül", description: "Teknopark Istanbul Inovasyon Ödülü 2023." }, { icon: "globe", title: "4 Ülke", description: "TR, DE, UK, UAE'de aktif proje deneyimi." }, { icon: "zap", title: "Ccevik", description: "2 haftalik sprint döngüleriyle hızlı teslimat." }], layout: "image-right" } },
      { id: "team-1", type: "team", order: 2, isVisible: true, data: { title: "Ekibimiz", subtitle: "", members: [{ name: "Deniz Kaya", role: "Kurucu & CTO", image: "", bio: "10 yillik yazilim deneyimi. Daha önce Google ve Spotify'da calistı.", socialLinks: { linkedin: "#" } }, { name: "Lale Sahin", role: "Kurucu & CPO", image: "", bio: "IDEO ve Airbnb'de deneyim kazanmis ürün tasarimcisi.", socialLinks: { linkedin: "#" } }, { name: "Omer Celik", role: "Lead Developer", image: "", bio: "React, Node.js ve Rust uzmani. Açık kaynak katkicisi.", socialLinks: { linkedin: "#" } }, { name: "Ipek Yildiz", role: "Proje Yoneticisi", image: "", bio: "PMP sertifikali. Müsteri iletisimi ve proje koordinasyonundan sorumlu.", socialLinks: { linkedin: "#" } }], layout: "grid" } },
    ] },
    { id: "page-iletisim", name: "Iletisim", slug: "iletisim", order: 4, sections: [
      { id: "hero-iletisim", type: "hero", order: 0, isVisible: true, data: { ...bannerHero("Iletisim", "Projenizi Anlatin") } },
      { id: "contact-1", type: "contact", order: 1, isVisible: true, data: { title: "Bize Yazın", subtitle: "24 saat icinde geri dönüs saglıyoruz.", showMap: false, showForm: true, formFields: [{ name: "name", type: "text", label: "Adiniz Soyadiniz", required: true }, { name: "email", type: "email", label: "Is E-postaniz", required: true }, { name: "company", type: "text", label: "Sirket Adiniz", required: false }, { name: "budget", type: "select", label: "Bütce Araligıniz", required: true, options: ["10.000 - 30.000 ₺", "30.000 - 75.000 ₺", "75.000 - 200.000 ₺", "200.000 ₺+", "Belirlemedim"] }, { name: "message", type: "textarea", label: "Projeniz Hakkinda", required: true }] } },
    ] },
  ],
};

// ─── Template defaults map ────────────────────────────────────────────────────

export const TEMPLATE_DEFAULTS: Record<string, SiteConfig> = {
  flavor: flavorConfig,
  vertex: vertexConfig,
  showcase: showcaseConfig,
  bloom: bloomConfig,
  pulse: pulseConfig,
  craft: craftConfig,
  zenith: zenithConfig,
  forge: forgeConfig,
};

export function getTemplateDefault(slug: string): SiteConfig | null {
  return TEMPLATE_DEFAULTS[slug] ?? null;
}
