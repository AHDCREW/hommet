// The site is published in the olive and cream palette under /home2 (the white, black and blue /home1 lives on the home1 branch).
// The palette is a complete stylesheet in app/<id>/ that only that route's layout loads. This file holds the few palette
// values React code needs (the Homi avatar and the effect colours that are passed in as props) and the route prefix that
// keeps every link inside the visitor's own palette.
export const themeIds = ["home2"] as const;
export type ThemeId = (typeof themeIds)[number];

export type Theme = {
  id: ThemeId;
  base: string;
  avatar: string;
  glare: string;
  spotlight: `rgba(${number}, ${number}, ${number}, ${number})`;
};

export const themes: Record<ThemeId, Theme> = {
  home2: { id: "home2", base: "/home2", avatar: "/images/hommet_icon-white-160.png", glare: "#F5F2E9", spotlight: "rgba(38, 58, 27, 0.07)" },
};

// "/roofing" -> "/home2/roofing", "/#partners" -> "/home2#partners". Anything that is not a path on this site is returned as is.
export const themeHref = ({ base }: Pick<Theme, "base">, href: string) => {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return href.startsWith("/#") ? `${base}${href.slice(1)}` : `${base}${href}`;
};
