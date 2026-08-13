import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPublishedProperty } from "@/lib/properties.functions";
import { formatPrice, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/propiedades/$id")({
  loader: async ({ params }) => {
    const { property } = await getPublishedProperty({ data: { id: params.id } });
    if (!property) throw notFound();
    return { property };
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
      No pudimos cargar esta propiedad.
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
      Esta propiedad no está disponible.
    </div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Propiedad no disponible | La Estancia" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.property;
    const title = `${p.title.es} — ${p.city}, ${p.country} | La Estancia`;
    return {
      meta: [
        { title },
        { name: "description", content: p.description.es.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description.es.slice(0, 155) },
      ],
    };
  },
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const gallery = property.images.length > 0 ? property.images : [property.image];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/propiedades"
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        ← {t("back")}
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border">
        <img
          src={property.image}
          alt={property.title[lang]}
          width={1280}
          height={896}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {gallery.slice(1, 6).map((src) => (
            <img
              key={src}
              src={src}
              alt={property.title[lang]}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-xl border border-border object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {property.city}, {property.country} · {t(property.operation)}
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{property.title[lang]}</h1>
          <p className="mt-4 font-display text-3xl font-bold">
            {formatPrice(property.price, property.currency, lang)}
            {property.operation === "rent" && (
              <span className="text-base font-medium text-muted-foreground">{t("per_month")}</span>
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              `${property.beds} ${t("beds")}`,
              `${property.baths} ${t("baths")}`,
              `${property.area} ${t("area")}`,
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium"
              >
                {chip}
              </span>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-semibold">{t("description")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{property.description[lang]}</p>

          <h2 className="mt-10 text-xl font-semibold">{t("features")}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(property.features[lang] as string[]).map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-accent">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("owner")}
          </p>
          <p className="mt-1 font-display text-xl font-semibold">{property.owner.name}</p>
          {property.verified && (
            <p className="mt-2 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground">
              ✓ {t("verified")}
            </p>
          )}

          <div className="mt-6 space-y-3 text-sm">
            <a
              href={`tel:${property.owner.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-surface"
            >
              <span className="text-muted-foreground">{t("phone")}</span>
              <span className="font-semibold">{property.owner.phone}</span>
            </a>
            <a
              href={`https://wa.me/${property.owner.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:bg-surface"
            >
              <span className="text-muted-foreground">{t("whatsapp")}</span>
              <span className="font-semibold">{property.owner.whatsapp}</span>
            </a>
            <a
              href={`mailto:${property.owner.email}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 hover:bg-surface"
            >
              <span className="text-muted-foreground">{t("email")}</span>
              <span className="truncate font-semibold">{property.owner.email}</span>
            </a>
          </div>

          <a
            href={`https://wa.me/${property.owner.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex h-11 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t("contact_owner")}
          </a>
        </aside>
      </div>
    </div>
  );
}