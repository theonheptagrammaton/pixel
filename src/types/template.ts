export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "menu"
  | "testimonials"
  | "team"
  | "pricing"
  | "contact"
  | "faq"
  | "cta"
  | "stats"
  | "blog"
  | "partners"
  | "video";

export interface SiteGlobalConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string;
    favicon: string;
    keywords: string[];
    ogTitle?: string;
    ogDescription?: string;
    twitterHandle?: string;
    googleVerification?: string;
  };
  general: {
    businessName: string;
    logo: string;
    phone: string;
    email: string;
    address: string;
    socialLinks: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      youtube?: string;
      tiktok?: string;
    };
  };
  layout: {
    header: HeaderData;
    footer: FooterData;
  };
  whatsapp?: {
    enabled: boolean;
    phoneNumber: string;
    message?: string;
  };
  cookieConsent?: {
    enabled: boolean;
    text: string;
    buttonText: string;
    linkUrl?: string;
    linkText?: string;
  };
}

export type HeroVariant = "default" | "split" | "video" | "slider" | "gradient";

export interface HeroSlide {
  title: string;
  description: string;
  backgroundImage: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  alignment: "left" | "center" | "right";
  overlayOpacity: number;
  height?: "full" | "large" | "medium";
  titleColor?: string;
  titleFontSize?: number;
  titleFontWeight?: number;
  subtitleColor?: string;
  subtitleFontSize?: number;
  descriptionColor?: string;
  descriptionFontSize?: number;
  variant?: HeroVariant;
  // Split variant
  splitImage?: string;
  splitImagePosition?: "left" | "right";
  // Video variant
  videoUrl?: string;
  videoPoster?: string;
  // Slider variant
  slides?: HeroSlide[];
  slideInterval?: number;
  // Gradient variant
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  layout: "image-left" | "image-right" | "image-top";
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  image: string;
  price?: string;
}

export interface ServicesData {
  title: string;
  subtitle: string;
  items: ServiceItem[];
  layout: "grid" | "list" | "cards";
  columns: 2 | 3 | 4;
}

export interface GalleryData {
  title: string;
  subtitle: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  layout: "grid" | "masonry" | "slider";
  columns: 2 | 3 | 4;
}

export interface MenuCategory {
  name: string;
  items: Array<{
    name: string;
    description: string;
    price: string;
    image?: string;
    badge?: string;
  }>;
}

export interface MenuData {
  title: string;
  subtitle: string;
  categories: MenuCategory[];
  layout: "simple" | "cards" | "detailed";
  showImages: boolean;
}

export interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface TestimonialsData {
  title: string;
  subtitle: string;
  items: TestimonialItem[];
  layout: "grid" | "slider" | "stacked";
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface TeamData {
  title: string;
  subtitle: string;
  members: TeamMember[];
  layout: "grid" | "list";
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
  ctaLink: string;
}

export interface PricingData {
  title: string;
  subtitle: string;
  plans: PricingPlan[];
}

export interface ContactData {
  title: string;
  subtitle: string;
  showMap: boolean;
  mapEmbedUrl?: string;
  showForm: boolean;
  formFields: Array<{
    name: string;
    type: "text" | "email" | "phone" | "textarea" | "select";
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  title: string;
  subtitle: string;
  items: FaqItem[];
}

export interface CtaData {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface HeaderData {
  layout: "centered" | "left-aligned" | "split";
  sticky: boolean;
  transparent: boolean;
  menuItems: Array<{
    label: string;
    link: string;
  }>;
}

export interface FooterData {
  layout: "simple" | "columns" | "minimal";
  copyright: string;
  columns?: Array<{
    title: string;
    links: Array<{ label: string; link: string }>;
  }>;
  showSocialLinks: boolean;
  showNewsletter: boolean;
  backgroundColor?: string;
}

export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface StatsData {
  title?: string;
  subtitle?: string;
  items: StatItem[];
  layout: "grid" | "centered";
  background: "primary" | "surface" | "background";
}

// Renamed from BlogPost to avoid Prisma model conflict
export interface BlogPostPreview {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  readTime?: string;
  link?: string;
  category?: string;
}

export interface BlogData {
  title: string;
  subtitle: string;
  layout: "grid" | "list";
  showReadMore: boolean;
  postsPerPage: number;
  showCategories: boolean;
}

export interface PartnerItem {
  name: string;
  logo: string;
  url?: string;
}

export interface PartnersData {
  title: string;
  subtitle: string;
  items: PartnerItem[];
  layout: "grid" | "carousel";
  grayscale: boolean;
  columns: 3 | 4 | 5 | 6;
}

export interface VideoData {
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailImage: string;
  overlayText?: string;
  autoplay: boolean;
  layout: "full-width" | "contained";
}

export type SectionDataMap = {
  hero: HeroData;
  about: AboutData;
  services: ServicesData;
  gallery: GalleryData;
  menu: MenuData;
  testimonials: TestimonialsData;
  team: TeamData;
  pricing: PricingData;
  contact: ContactData;
  faq: FaqData;
  cta: CtaData;
  stats: StatsData;
  blog: BlogData;
  partners: PartnersData;
  video: VideoData;
};

export type AnimationType = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale" | "none";

export type CardStyle = "default" | "minimal" | "bordered" | "glass" | "gradient" | "shadow";

export interface SectionStyle {
  background?: {
    type: "color" | "gradient" | "image";
    color?: string;
    gradient?: { from: string; to: string; angle: number };
    image?: string;
    overlay?: number;
  };
  spacing?: "compact" | "normal" | "spacious";
  divider?: "none" | "line" | "wave" | "curve" | "angle";
  colorOverride?: {
    text?: string;
    textLight?: string;
    accent?: string;
  };
  animation?: AnimationType;
  cardStyle?: CardStyle;
}

export interface SiteSection {
  id: string;
  type: SectionType;
  data:
    | HeroData
    | AboutData
    | ServicesData
    | GalleryData
    | MenuData
    | TestimonialsData
    | TeamData
    | PricingData
    | ContactData
    | FaqData
    | CtaData
    | StatsData
    | BlogData
    | PartnersData
    | VideoData;
  isVisible: boolean;
  order: number;
  style?: SectionStyle;
}

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  order: number;
  sections: SiteSection[];
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
}

export interface SiteConfig {
  global: SiteGlobalConfig;
  pages: SitePage[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: string;
  defaultConfig: SiteConfig;
  availableSections: SectionType[];
}
