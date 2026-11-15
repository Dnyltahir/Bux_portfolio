export type Project = {
  title: string;
  tags: string[];
  /** Cover image. Loaded from Behance for now: replace with files in public/assets before launch. */
  cover: string;
  alt: string;
  href: string;
  /** True when the link leaves the site (opens Behance in a new tab). */
  external: boolean;
  /** Width of the card on a 12-column grid. */
  span: 4 | 6 | 8;
};

const cdn = "https://mir-s3-cdn-cf.behance.net/projects";

export const behanceProfile = "https://www.behance.net/muhammadbux1";
export const instagramProfile = "https://www.instagram.com/vizbybux";
export const linkedinProfile = "https://www.linkedin.com/in/muhammadbux10";
/** From Bux's CV (2026). */
export const contactEmail = "muhmmadbux.17@gmail.com";
export const contactPhone = "+92 304 0364721";
export const cvFile = "/assets/Muhammad-Bux-CV-2026.pdf";

export const projects: Project[] = [
  {
    title: "Gourmet Cola Rebranding",
    tags: ["Brand identity", "Packaging"],
    cover: `${cdn}/max_808_webp/12bb44258267857.Y3JvcCw0MTQyLDMyNDAsODEwLDA.png`,
    alt: "Gourmet Cola rebranding cover",
    href: "/work/gourmet-cola",
    external: false,
    span: 6,
  },
  {
    title: "Manchar Ecological Decline",
    tags: [],
    cover: `${cdn}/808/9691e7204889571.Y3JvcCwxMDIyLDgwMCw4OCww.png`,
    alt: "Manchar Ecological Decline cover",
    href: "https://www.behance.net/gallery/204889571/Manchar-Ecological-Decline",
    external: true,
    span: 6,
  },
  {
    title: "3D Model of a Cutting-Edge Firearm",
    tags: ["3D modelling"],
    cover: `${cdn}/808/834cd0174338239.Y3JvcCwxMDA3LDc4OCwxOTcsMA.jpg`,
    alt: "3D model of a firearm",
    href: "https://www.behance.net/gallery/174338239/3D-Model-of-a-Cutting-Edge-Firearm",
    external: true,
    span: 4,
  },
  {
    title: "Khairpur",
    tags: ["Identity"],
    cover: `${cdn}/808/a73743136344017.Y3JvcCwzNTA4LDI3NDMsMCw5NTQy.jpg`,
    alt: "Identity designed for the state of Khairpur",
    href: "https://www.behance.net/gallery/136344017/Identity-designed-for-the-state-KHAIRPUR",
    external: true,
    span: 4,
  },
  {
    title: "Vintage Camera 3D Modeling",
    tags: ["3D modelling"],
    cover: `${cdn}/808/16ee09174336819.Y3JvcCwxMzgwLDEwODAsMjcwLDA.jpg`,
    alt: "3D model of a vintage camera",
    href: "https://www.behance.net/gallery/174336819/Capturing-Nostalgia-Vintage-Camera-3D-Modeling",
    external: true,
    span: 4,
  },
];

export type ArchiveProject = {
  title: string;
  href: string;
  /** Cover image on Behance, or null where Behance does not serve one. */
  cover: string | null;
};

const gallery = "https://www.behance.net/gallery";

// [title, Behance gallery path, cover file]. Every project on the Behance profile that is not featured above.
const archive: [string, string, string | null][] = [
  ["Beverages Label Design", "258267909/Beverages-Label-Design", "max_808_webp/99c0eb258267909.Y3JvcCw0MTQyLDMyNDAsMTYwOSww.png"],
  ["Facia Case Study: Fastest Face Recognition & Security", "230951031/Facia-Case-Study-Fastest-Face-Recognition-Security", "max_808_webp/9f161f230951031.Y3JvcCwyMzIyLDE4MTYsNzE4LDQwOA.png"],
  ["Tides of Trouble: 2023", "217170159/Tides-of-Trouble-2023", "max_808_webp/bde8ff217170159.Y3JvcCwyNzcyLDIxNjgsMjE4Miww.jpg"],
  ["Facia: Social Media Campaign for Face Recognition", "230950373/Facia-Social-Media-Campaign-for-Face-Recognition", "808/c8529a230950373.Y3JvcCwxMTEwLDg2OCwxNDUsOTA.png"],
  ["Chips Packaging", "255275747/Chips-packaging", "max_808_webp/7725c5255275747.Y3JvcCwzNDA4LDI2NjYsMjk1LDA.png"],
  ["Unseen Peradox", "178053993/Unseen-Peradox", "808/b3ac5f178053993.Y3JvcCwyNjMwLDIwNTcsMCww.jpg"],
  ["Visualizing Van Gogh's Life: An Infographic Journey", "178054107/Visualizing-Van-Goghs-Life-An-Infographic-Journey", "max_808_webp/388625178054107.Y3JvcCw4MzAwLDY0OTIsNjkyMywyMTE2.jpg"],
  ["Branding for Golden Autos Lahore", "136798615/Branding-for-Golden-Autos-lahore", "808/3c07e2136798615.Y3JvcCwzNDU1LDI3MDIsNTMwLDEzNg.jpg"],
  ["Data Visualization based on Vincent van Gogh's life", "178052879/Data-Visualization-based-on-Vincent-van-Gogh-life", "808/516dd6178052879.Y3JvcCwyMTcyLDE2OTksMTMyOCww.jpg"],
  ["GoPro Action Cam 3D Model", "174334989/GoPro-Action-Cam-3D-Model-Bringing-Adventure-to-Life", null],
  ["Rebranding Black Diamond", "117849519/Rebranding-Black-Diamond", "808/e2634d117849519.Y3JvcCwxNTAwLDExNzMsMCw4NDk4.jpg"],
  ["Khat e Faiz", "146337011/Khat-e-Faiz", "808/a8eff7146337011.Y3JvcCwzOTk5LDMxMjgsMCw3MTI4.jpg"],
  ["TRINK", "118224611/TRINK", "808/de878a118224611.Y3JvcCwzMDAwLDIzNDYsMCw0Njcw.png"],
  ["3D Figurative Character", "163793007/3D-figurative-character", "404/79ff70163793007.Y3JvcCw1MTMsNDAxLDc4NCwxNDc.jpg"],
  ["Bethak", "157895791/Bethak", "808/eca547157895791.Y3JvcCw0NTAxLDM1MjAsMCwzNTY4NA.jpg"],
  ["Dastaan, the clothing brand", "136557323/Dastaan-the-clothing-brand", "808/20ce58136557323.Y3JvcCw0NTAwLDM1MTksMCwxMjE5Ng.jpg"],
];

export const moreProjects: ArchiveProject[] = archive.map(([title, path, cover]) => ({
  title,
  href: `${gallery}/${path}`,
  cover: cover ? `${cdn}/${cover}` : null,
}));

export type Slide = {
  title: string;
  href: string;
  cover: string;
  external: boolean;
  /** Discipline labels. Only the featured projects have them so far. */
  tags: string[];
};

/** Every project with a cover image, featured ones first. Used by the hero carousel. */
export const slides: Slide[] = [
  ...projects.map(({ title, href, cover, external, tags }) => ({ title, href, cover, external, tags })),
  ...moreProjects.flatMap(({ title, href, cover }) => (cover ? [{ title, href, cover, external: true, tags: [] }] : [])),
];
