export type Operation = "sale" | "rent";
export type Status = "pending" | "published" | "paused" | "rejected";

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
  images: string[];
  image: string;
  verified: boolean;
  status: Status;
  createdAt: string;
  owner: { name: string; phone: string; whatsapp: string; email: string };
  features: { es: string[]; en: string[] };
};