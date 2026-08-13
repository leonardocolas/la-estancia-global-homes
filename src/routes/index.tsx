import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import heroImg from "@/assets/hero.jpg";
import { PropertyCard } from "@/components/PropertyCard";
import { listPublishedProperties } from "@/lib/properties.functions";
import { useI18n } from "@/lib/i18n";

const publishedQuery = queryOptions({
  queryKey: ["properties", "published"],
  queryFn: () => listPublishedProperties(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Estancia — Casas para venta y renta en todo el mundo" },
      {
        name: "description",
        content:
          "Compra o renta casas publicadas por sus dueños en más de 40 países. Fotos, descripciones y precios reales en La Estancia.",
      },
      { property: "og:title", content: "La Estancia — Casas para venta y renta" },
      {
        property: "og:description",
        content: "Dueños de todo el mundo publican sus casas. Encuentra tu próxima casa sin fronteras.",
      },
    ],
  }),
  component: Index,
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedQuery),
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
      No pudimos cargar las propiedades. Recarga la página.
    </div>
  ),
});

function Index() {
  const { t } = useI18n();
  const { data } = useSuspenseQuery(publishedQuery);
  const all = data.properties;
  const featured = all.slice(0, 6);
  const countryCount = new Set(all.map((p) => p.country)).size;

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImg}
          alt="Villa moderna frente al mar al atardecer"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-32 sm:pt-48">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-foreground/80">
            {t("tagline")}
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold text-primary-foreground sm:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">{t("hero_sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/propiedades"
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              {t("hero_cta")}
            </Link>
            <Link
              to="/publicar"
              className="rounded-xl border border-primary-foreground/40 bg-background/10 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-background/20"
            >
              {t("hero_cta2")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-5xl px-4">
        <form className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-lift)] sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("search_where")}
            </span>
            <input
              placeholder={t("search_where_ph")}
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("search_type")}
            </span>
            <select className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
              <option>{t("all")}</option>
              <option>{t("sale")}</option>
              <option>{t("rent")}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("search_budget")}
            </span>
            <input
              inputMode="numeric"
              placeholder="250000"
              className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="flex items-end">
            <Link
              to="/propiedades"
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("search_btn")}
            </Link>
          </div>
        </form>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">{t("featured")}</h2>
            <p className="mt-2 text-muted-foreground">{t("featured_sub")}</p>
          </div>
          <Link
            to="/propiedades"
            className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            {t("view_all")} →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 && (
            <p className="text-muted-foreground sm:col-span-2 lg:col-span-3">{t("empty_catalog")}</p>
          )}
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-display text-4xl font-bold">{all.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("nav_properties")} · {t("footer_note")}
              </p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold">{countryCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("country")}</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold">100%</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("verified")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
