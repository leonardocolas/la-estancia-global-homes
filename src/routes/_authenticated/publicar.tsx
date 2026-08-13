import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createProperty } from "@/lib/properties.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/publicar")({
  head: () => ({
    meta: [
      { title: "Publica tu casa gratis | La Estancia" },
      {
        name: "description",
        content:
          "Sube fotos, describe tu casa y define el precio de venta o renta. Clientes de todo el mundo verán tu anuncio en La Estancia.",
      },
      { property: "og:title", content: "Publica tu casa gratis | La Estancia" },
      {
        property: "og:description",
        content: "Anuncia tu casa para venta o renta y recibe contactos directos de clientes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublishPage,
});

const field =
  "h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const label = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

function PublishPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const submitProperty = useServerFn(createProperty);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  async function uploadImages(userId: string) {
    const paths: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("property-images").upload(path, file, {
        contentType: file.type || "image/jpeg",
      });
      if (error) throw new Error(error.message);
      paths.push(path);
    }
    return paths;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const value = (k: string) => String(form.get(k) ?? "").trim();
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Sesión expirada");
      const images = await uploadImages(userId);
      await submitProperty({
        data: {
          title_es: value("title"),
          title_en: value("title_en"),
          description_es: value("description"),
          description_en: "",
          city: value("city"),
          country: value("country"),
          operation: value("operation") === "rent" ? "rent" : "sale",
          price: Number(value("price") || 0),
          currency: value("currency") || "USD",
          beds: Number(value("beds") || 0),
          baths: Number(value("baths") || 0),
          area: Number(value("area") || 0),
          features_es: value("features")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          images,
          owner_name: value("owner_name"),
          owner_phone: value("owner_phone"),
          owner_whatsapp: value("owner_whatsapp"),
          owner_email: value("owner_email"),
        },
      });
      toast.success(t("publish_ok"));
      void navigate({ to: "/mis-casas" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("publish_title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("publish_sub")}</p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_title")}</span>
          <input name="title" required className={field} placeholder="Casa colonial en Trinidad" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_title")} (EN)</span>
          <input name="title_en" className={field} placeholder="Colonial house in Trinidad" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_country")}</span>
            <input name="country" required className={field} placeholder="Cuba" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_city")}</span>
            <input name="city" required className={field} placeholder="Trinidad" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_op")}</span>
            <select name="operation" className={field}>
              <option value="sale">{t("sale")}</option>
              <option value="rent">{t("rent")}</option>
            </select>
          </label>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={label}>{t("form_price")}</span>
              <input name="price" required className={field} inputMode="numeric" placeholder="65000" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>{t("form_currency")}</span>
              <select name="currency" className={field}>
                <option>USD</option>
                <option>EUR</option>
                <option>MXN</option>
                <option>CUP</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_beds")}</span>
            <input name="beds" className={field} inputMode="numeric" placeholder="3" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_baths")}</span>
            <input name="baths" className={field} inputMode="numeric" placeholder="2" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_area")}</span>
            <input name="area" className={field} inputMode="numeric" placeholder="180" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_desc")}</span>
          <textarea
            name="description"
            rows={5}
            className="rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_features")}</span>
          <textarea
            name="features"
            rows={4}
            className="rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder={"Patio interior\nAgua 24 horas\nCerca del centro"}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={label}>{t("form_photos")}</span>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="font-display text-2xl">＋</span>
            <p className="text-sm text-muted-foreground">{t("form_photos_hint")}</p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </label>
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {files.map((f) => (
                <img
                  key={f.name}
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="aspect-[4/3] w-full rounded-lg border border-border object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className={`${label} mb-2`}>{t("form_contact")}</legend>
          <input name="owner_name" className={field} placeholder={t("auth_name")} required />
          <input name="owner_phone" className={field} placeholder={t("phone")} />
          <input name="owner_whatsapp" className={field} placeholder={t("whatsapp")} />
          <input name="owner_email" type="email" className={field} placeholder={t("email")} />
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {busy ? t("saving") : t("form_submit")}
          </button>
          <p className="text-xs text-muted-foreground">{t("form_note")}</p>
        </div>
      </form>
    </div>
  );
}