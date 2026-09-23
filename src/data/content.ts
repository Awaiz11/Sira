import hero from "@/assets/hero.jpg";
import experiencePour from "@/assets/experience-pour.jpg";
import experienceDetail from "@/assets/experience-detail.jpg";
import cocktail1 from "@/assets/cocktail-1.jpg";
import cocktail2 from "@/assets/cocktail-2.jpg";
import cocktail3 from "@/assets/cocktail-3.jpg";
import cocktail4 from "@/assets/cocktail-4.jpg";
import backbar from "@/assets/gallery-backbar.jpg";
import lounge from "@/assets/gallery-lounge.jpg";
import street from "@/assets/gallery-street.jpg";
import cheers from "@/assets/gallery-cheers.jpg";
import toast from "@/assets/gallery-toast.jpg";

export const images = { hero, experiencePour, experienceDetail };

export const NAV_LINKS = [
  { id: "experience", label: "Experience" },
  { id: "signatures", label: "Signatures" },
  { id: "gallery", label: "Gallery" },
  { id: "visit", label: "Visit" },
] as const;

export const VENUE = {
  street: "Carrer dels Flassaders, 18",
  district: "El Born, 08003 Barcelona",
  coords: "41°23′06″N — 2°10′55″E",
  phone: "+34 932 68 41 90",
  phoneHref: "tel:+34932684190",
  email: "hola@sira.bar",
  instagram: "@sira.bcn",
  instagramHref: "https://www.instagram.com/",
  maps: "https://www.google.com/maps/search/?api=1&query=Carrer+dels+Flassaders+18+Barcelona",
};

export type Cocktail = {
  no: string;
  name: string;
  translation: string;
  notes: string[];
  description: string;
  price: number;
  glass: string;
  image: string;
};

export const COCKTAILS: Cocktail[] = [
  {
    no: "01",
    name: "Nit de Sant Joan",
    translation: "Midsummer's Night",
    notes: ["Mezcal", "Charred rosemary", "Blood orange", "Smoked salt"],
    description: "The bonfires of midsummer in a glass — smoky and bright, with a faintly savoury finish.",
    price: 16,
    glass: "Rocks, hand-cut ice",
    image: cocktail1,
  },
  {
    no: "02",
    name: "Vermut Negre",
    translation: "Black Vermouth",
    notes: ["House vermouth", "Priorat red", "Cacao nib", "Orange oil"],
    description: "Our house vermouth, rested in Priorat casks and deepened with cacao. Velvet, bitter, long.",
    price: 15,
    glass: "Nick & Nora",
    image: cocktail2,
  },
  {
    no: "03",
    name: "Brisa Marina",
    translation: "Sea Breeze",
    notes: ["Samphire gin", "Fino sherry", "Arbequina olive", "Sea salt"],
    description: "A cold, saline martini that tastes of the Barceloneta shoreline an hour after sunset.",
    price: 16,
    glass: "Frozen coupe",
    image: cocktail3,
  },
  {
    no: "04",
    name: "Flor d'Ametller",
    translation: "Almond Blossom",
    notes: ["Aged rum", "Toasted almond", "Cava brut", "Bitter orange"],
    description: "Almond blossom and fine Penedès bubbles — our quiet celebration of the end of winter.",
    price: 17,
    glass: "Tall flute",
    image: cocktail4,
  },
];

export type GalleryItem = {
  src: string;
  title: string;
  time: string;
  alt: string;
  className: string;
};

/** Bento layout — 2 columns on mobile, 4 on desktop, dense flow. */
export const GALLERY: GalleryItem[] = [
  {
    src: backbar,
    title: "The back bar",
    time: "21:40",
    alt: "Backlit shelves of rare spirits glowing amber behind the bar",
    className: "col-span-2 row-span-2",
  },
  {
    src: lounge,
    title: "The velvet corner",
    time: "23:15",
    alt: "An oxblood velvet banquette beside a turntable and candlelit brass table",
    className: "col-span-1 row-span-2",
  },
  {
    src: cheers,
    title: "Salut",
    time: "00:05",
    alt: "Three coupes of raspberry sours raised in a toast against the dark",
    className: "col-span-1 row-span-1",
  },
  {
    src: street,
    title: "Carrer dels Flassaders",
    time: "20:55",
    alt: "A narrow medieval street in El Born glowing under amber lamps",
    className: "col-span-2 row-span-1",
  },
  {
    src: toast,
    title: "Late company",
    time: "01:20",
    alt: "Friends laughing and toasting with cocktails in warm low light",
    className: "col-span-2 row-span-1",
  },
];
