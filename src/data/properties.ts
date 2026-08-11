import casa1 from "@/assets/casa-1.jpg";
import casa2 from "@/assets/casa-2.jpg";
import casa3 from "@/assets/casa-3.jpg";
import casa4 from "@/assets/casa-4.jpg";
import casa5 from "@/assets/casa-5.jpg";
import casa6 from "@/assets/casa-6.jpg";

export type Operation = "sale" | "rent";
export type Status = "published" | "pending" | "paused";

export type Property = {
  id: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  city: string;
  country: string;
  countryCode: string;
  operation: Operation;
  price: number;
  currency: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
  verified: boolean;
  status: Status;
  owner: { name: string; phone: string; whatsapp: string; email: string };
  features: { es: string[]; en: string[] };
};

export const properties: Property[] = [
  {
    id: "habana-colonial",
    title: {
      es: "Casa colonial restaurada en Centro Habana",
      en: "Restored colonial house in Centro Habana",
    },
    description: {
      es: "Casa colonial de 1912 completamente restaurada, con techos de 4 metros, columnas originales y patio interior. A diez minutos del Malecón, ideal para vivienda familiar o renta a extranjeros.",
      en: "Fully restored 1912 colonial house with 4-metre ceilings, original columns and an inner courtyard. Ten minutes from the Malecón, ideal as a family home or rental for foreigners.",
    },
    city: "La Habana",
    country: "Cuba",
    countryCode: "CU",
    operation: "sale",
    price: 78000,
    currency: "USD",
    beds: 4,
    baths: 2,
    area: 210,
    image: casa1,
    verified: true,
    status: "published",
    owner: {
      name: "Yamila Rodríguez",
      phone: "+53 5 234 1187",
      whatsapp: "+53 5 234 1187",
      email: "yamila.r@example.com",
    },
    features: {
      es: ["Patio interior", "Techos altos", "Agua 24h", "Escritura legalizada"],
      en: ["Inner courtyard", "High ceilings", "24h water", "Clear title deed"],
    },
  },
  {
    id: "madrid-chamberi",
    title: { es: "Apartamento luminoso en Chamberí", en: "Bright apartment in Chamberí" },
    description: {
      es: "Piso exterior reformado con balcón, suelo de roble y calefacción central. Zona tranquila con metro a 200 metros.",
      en: "Renovated outward-facing flat with balcony, oak floors and central heating. Quiet area with the metro 200 metres away.",
    },
    city: "Madrid",
    country: "España",
    countryCode: "ES",
    operation: "rent",
    price: 1450,
    currency: "EUR",
    beds: 2,
    baths: 1,
    area: 78,
    image: casa2,
    verified: true,
    status: "published",
    owner: {
      name: "Álvaro Núñez",
      phone: "+34 610 887 231",
      whatsapp: "+34 610 887 231",
      email: "alvaro.nunez@example.com",
    },
    features: {
      es: ["Balcón", "Amueblado", "Ascensor", "Calefacción central"],
      en: ["Balcony", "Furnished", "Elevator", "Central heating"],
    },
  },
  {
    id: "toscana-casale",
    title: { es: "Casa de campo con jardín y vistas", en: "Countryside house with garden and views" },
    description: {
      es: "Casona de piedra con porche cubierto, huerto y 3.000 m² de terreno. Perfecta para vivir del campo o alojamiento rural.",
      en: "Stone house with covered porch, vegetable garden and 3,000 m² of land. Perfect for country living or a rural guesthouse.",
    },
    city: "Siena",
    country: "Italia",
    countryCode: "IT",
    operation: "sale",
    price: 265000,
    currency: "EUR",
    beds: 5,
    baths: 3,
    area: 320,
    image: casa3,
    verified: true,
    status: "published",
    owner: {
      name: "Giulia Ferrari",
      phone: "+39 333 552 8841",
      whatsapp: "+39 333 552 8841",
      email: "giulia.ferrari@example.com",
    },
    features: {
      es: ["3.000 m² de terreno", "Chimenea", "Huerto", "Pozo propio"],
      en: ["3,000 m² of land", "Fireplace", "Vegetable garden", "Private well"],
    },
  },
  {
    id: "cancun-penthouse",
    title: { es: "Penthouse frente al mar con alberca", en: "Beachfront penthouse with pool" },
    description: {
      es: "Terraza privada de 60 m² con alberca y vista abierta al Caribe. Acceso directo a la playa y seguridad 24 horas.",
      en: "Private 60 m² terrace with pool and open Caribbean views. Direct beach access and 24-hour security.",
    },
    city: "Cancún",
    country: "México",
    countryCode: "MX",
    operation: "rent",
    price: 3200,
    currency: "USD",
    beds: 3,
    baths: 3,
    area: 185,
    image: casa4,
    verified: true,
    status: "published",
    owner: {
      name: "Diego Salas",
      phone: "+52 998 114 5520",
      whatsapp: "+52 998 114 5520",
      email: "diego.salas@example.com",
    },
    features: {
      es: ["Alberca privada", "Vista al mar", "Seguridad 24h", "Estacionamiento"],
      en: ["Private pool", "Ocean view", "24h security", "Parking"],
    },
  },
  {
    id: "miami-loft",
    title: { es: "Loft con vista al skyline", en: "Loft with skyline view" },
    description: {
      es: "Loft en piso 34 con ventanales de suelo a techo, gimnasio y rooftop en el edificio. Listo para entrar a vivir.",
      en: "34th-floor loft with floor-to-ceiling windows, building gym and rooftop. Move-in ready.",
    },
    city: "Miami",
    country: "Estados Unidos",
    countryCode: "US",
    operation: "sale",
    price: 495000,
    currency: "USD",
    beds: 2,
    baths: 2,
    area: 120,
    image: casa5,
    verified: false,
    status: "pending",
    owner: {
      name: "Karen Lopez",
      phone: "+1 305 442 9087",
      whatsapp: "+1 305 442 9087",
      email: "karen.lopez@example.com",
    },
    features: {
      es: ["Piso 34", "Gimnasio", "Rooftop", "Concierge"],
      en: ["34th floor", "Gym", "Rooftop", "Concierge"],
    },
  },
  {
    id: "oaxaca-casita",
    title: { es: "Casita colonial en el centro histórico", en: "Colonial cottage in the old town" },
    description: {
      es: "Casa de dos plantas con balcón de hierro forjado y patio con bugambilias, a dos calles del zócalo.",
      en: "Two-storey house with wrought-iron balcony and a bougainvillea patio, two streets from the main square.",
    },
    city: "Oaxaca",
    country: "México",
    countryCode: "MX",
    operation: "rent",
    price: 780,
    currency: "USD",
    beds: 2,
    baths: 1,
    area: 95,
    image: casa6,
    verified: true,
    status: "published",
    owner: {
      name: "Rosa Mendoza",
      phone: "+52 951 220 7743",
      whatsapp: "+52 951 220 7743",
      email: "rosa.mendoza@example.com",
    },
    features: {
      es: ["Patio con plantas", "Balcón", "Centro histórico", "Internet incluido"],
      en: ["Planted patio", "Balcony", "Historic centre", "Internet included"],
    },
  },
];

export const countries = Array.from(new Set(properties.map((p) => p.country))).sort();