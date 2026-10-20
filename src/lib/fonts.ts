export const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "PT Serif",
  "Source Serif 4",
  "Libre Baskerville",
  "EB Garamond",
  "Oswald",
  "Ubuntu",
  "Noto Sans",
  "Fira Sans",
  "DM Sans",
  "Work Sans",
  "Sora",
  "Outfit",
  "Plus Jakarta Sans",
  "Geist",
] as const;

export type GoogleFont = (typeof GOOGLE_FONTS)[number];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): void {
  if (typeof document === "undefined") return;
  if (loadedFonts.has(fontName)) return;

  loadedFonts.add(fontName);
  const slug = fontName.replace(/ /g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${slug}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
