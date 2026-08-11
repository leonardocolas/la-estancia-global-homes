import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/publicar")({
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
    ],
  }),
  component: PublishPage,
});

const field =
  "h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const label = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

function PublishPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("publish_title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("publish_sub")}</p>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      >
        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_title")}</span>
          <input className={field} placeholder="Casa colonial en Trinidad" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_country")}</span>
            <input className={field} placeholder="Cuba" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_city")}</span>
            <input className={field} placeholder="Trinidad" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_op")}</span>
            <select className={field}>
              <option>{t("sale")}</option>
              <option>{t("rent")}</option>
            </select>
          </label>
          <div className="grid grid-cols-[2fr_1fr] gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={label}>{t("form_price")}</span>
              <input className={field} inputMode="numeric" placeholder="65000" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>{t("form_currency")}</span>
              <select className={field}>
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
            <input className={field} inputMode="numeric" placeholder="3" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_baths")}</span>
            <input className={field} inputMode="numeric" placeholder="2" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={label}>{t("form_area")}</span>
            <input className={field} inputMode="numeric" placeholder="180" />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={label}>{t("form_desc")}</span>
          <textarea
            rows={5}
            className="rounded-lg border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <span className={label}>{t("form_photos")}</span>
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="font-display text-2xl">＋</span>
            <p className="text-sm text-muted-foreground">{t("form_photos_hint")}</p>
          </div>
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-3">
          <legend className={`${label} mb-2`}>{t("form_contact")}</legend>
          <input className={field} placeholder={t("phone")} />
          <input className={field} placeholder={t("whatsapp")} />
          <input className={field} placeholder={t("email")} />
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="h-11 rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("form_submit")}
          </button>
          <p className="text-xs text-muted-foreground">{t("form_note")}</p>
        </div>
      </form>
    </div>
  );
}