import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createPublicClient, mapRows } from "@/lib/properties.server";

const propertyInput = z.object({
  title_es: z.string().min(3),
  title_en: z.string().optional().default(""),
  description_es: z.string().default(""),
  description_en: z.string().optional().default(""),
  city: z.string().min(1),
  country: z.string().min(1),
  operation: z.enum(["sale", "rent"]),
  price: z.number().nonnegative(),
  currency: z.string().min(1),
  beds: z.number().int().nonnegative(),
  baths: z.number().int().nonnegative(),
  area: z.number().int().nonnegative(),
  features_es: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  owner_name: z.string().default(""),
  owner_phone: z.string().default(""),
  owner_whatsapp: z.string().default(""),
  owner_email: z.string().default(""),
});

export const listPublishedProperties = createServerFn({ method: "GET" }).handler(async () => {
  const client = createPublicClient();
  const { data, error } = await client
    .from("properties")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) return { properties: [], error: error.message };
  return { properties: await mapRows(client, data ?? []), error: null };
});

export const getPublishedProperty = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const client = createPublicClient();
    const { data: rows, error } = await client
      .from("properties")
      .select("*")
      .eq("id", data.id)
      .eq("status", "published")
      .limit(1);
    if (error || !rows || rows.length === 0) return { property: null };
    const [property] = await mapRows(client, rows);
    return { property: property ?? null };
  });

const searchInput = z.object({
  q: z.string().optional().default(""),
  country: z.string().optional().default("all"),
  operation: z.string().optional().default("all"),
  page: z.number().int().optional().default(1),
  pageSize: z.number().int().optional().default(9),
});

export const searchPublishedProperties = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => searchInput.parse(input ?? {}))
  .handler(async ({ data }) => {
    const client = createPublicClient();
    const pageSize = Math.min(Math.max(data.pageSize, 1), 48);
    const page = Math.max(data.page, 1);

    const facets = await client.from("properties").select("country").eq("status", "published");
    const countries = [...new Set((facets.data ?? []).map((r) => r.country).filter(Boolean))].sort();

    let query = client
      .from("properties")
      .select("*", { count: "exact" })
      .eq("status", "published");

    if (data.country !== "all") query = query.eq("country", data.country);
    if (data.operation === "sale" || data.operation === "rent") {
      query = query.eq("operation", data.operation);
    }
    const term = data.q.trim().slice(0, 100);
    if (term) {
      const like = `%${term.replace(/[%,()]/g, " ")}%`;
      query = query.or(
        `title_es.ilike.${like},title_en.ilike.${like},city.ilike.${like},country.ilike.${like}`,
      );
    }

    const from = (page - 1) * pageSize;
    const { data: rows, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      return { properties: [], total: 0, page, pageSize, countries, error: error.message };
    }
    return {
      properties: await mapRows(client, rows ?? []),
      total: count ?? 0,
      page,
      pageSize,
      countries,
      error: null,
    };
  });

const _unusedGetPublishedProperty = createServerFn({ method: "GET" })
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const client = createPublicClient();
    const { data: rows, error } = await client
      .from("properties")
      .select("*")
      .eq("id", data.id)
      .eq("status", "published")
      .limit(1);
    if (error || !rows || rows.length === 0) return { property: null };
    const [property] = await mapRows(client, rows);
    return { property: property ?? null };
  });

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role);
    return { userId: context.userId, roles, isAdmin: roles.includes("admin") };
  });

export const listMyProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("properties")
      .select("*")
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { properties: await mapRows(context.supabase, data ?? []) };
  });

export const listAllProperties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { data, error } = await context.supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { properties: await mapRows(context.supabase, data ?? []) };
  });

export const createProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => propertyInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("properties")
      .insert({ ...data, features_en: [], owner_id: context.userId, status: "pending" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const setPropertyStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "published", "paused", "rejected"]),
        verified: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { status: typeof data.status; verified?: boolean } = { status: data.status };
    if (data.verified !== undefined) patch.verified = data.verified;
    const { error } = await context.supabase.from("properties").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProperty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("properties").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });