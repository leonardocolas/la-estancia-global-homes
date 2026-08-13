import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Property } from "@/data/properties";

export const IMAGE_BUCKET = "property-images";
const SIGNED_TTL = 60 * 60 * 24 * 7;

export function createPublicClient(): SupabaseClient<Database> {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type Row = Database["public"]["Tables"]["properties"]["Row"];

export async function signImages(
  client: SupabaseClient<Database>,
  paths: string[],
): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};
  const { data } = await client.storage.from(IMAGE_BUCKET).createSignedUrls(unique, SIGNED_TTL);
  const map: Record<string, string> = {};
  for (const entry of data ?? []) {
    if (entry.path && entry.signedUrl) map[entry.path] = entry.signedUrl;
  }
  return map;
}

const PLACEHOLDER = "/placeholder.svg";

export function mapRow(row: Row, urls: Record<string, string>): Property {
  const images = row.images.map((p) => urls[p] ?? p).filter(Boolean);
  return {
    id: row.id,
    title: { es: row.title_es, en: row.title_en || row.title_es },
    description: { es: row.description_es, en: row.description_en || row.description_es },
    city: row.city,
    country: row.country,
    countryCode: row.country_code,
    operation: row.operation,
    price: Number(row.price),
    currency: row.currency,
    beds: row.beds,
    baths: row.baths,
    area: row.area,
    images,
    image: images[0] ?? PLACEHOLDER,
    verified: row.verified,
    status: row.status,
    createdAt: row.created_at,
    owner: {
      name: row.owner_name,
      phone: row.owner_phone,
      whatsapp: row.owner_whatsapp,
      email: row.owner_email,
    },
    features: { es: row.features_es, en: row.features_en.length ? row.features_en : row.features_es },
  };
}

export async function mapRows(client: SupabaseClient<Database>, rows: Row[]): Promise<Property[]> {
  const urls = await signImages(
    client,
    rows.flatMap((r) => r.images),
  );
  return rows.map((r) => mapRow(r, urls));
}