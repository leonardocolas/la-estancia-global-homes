import { createFileRoute, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { searchPublishedProperties } from "@/lib/properties.functions";
import { useI18n } from "@/lib/i18n";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  country: fallback(z.string(), "all").default("all"),
  operation: fallback(z.string(), "all").default("all"),
  page: fallback(z.number().int(), 1).default(1),
});

type Filters = { q: string; country: string; operation: string; page: number };

const catalogQuery = (filters: Filters) =>
  queryOptions({
    queryKey: ["properties", "catalog", filters],
    queryFn: () => searchPublishedProperties({ data: { ...filters, pageSize: 9 } }),
  });

export const Route = createFileRoute("/propiedades/")({
  validateSearch: zodValidator(searchSchema),
  search: {
    middlewares: [stripSearchParams({ q: "", country: "all", operation: "all", page: 1 })],
  },
  loaderDeps: ({ search }) => ({
    q: search.q,
    country: search.country,
    operation: search.operation,
    page: search.page,
  }),
  head: () => ({
    meta: [
      { title: "Propiedades en venta y renta | La Estancia" },
      {
        name: "description",
        content:
          "Explora casas, apartamentos y villas en venta o renta publicadas por sus dueños en Cuba, España, México y más países.",
      },
      { property: "og:title", content: "Propiedades en venta y renta | La Estancia" },
      {
        property: "og:description",
        content: "Filtra por país, operación y precio para encontrar tu próxima casa.",
      },
    ],
  }),
  component: PropertiesPage,
  loader: ({ context, deps }) => {
    context.queryClient.ensureQueryData(catalogQuery(deps));
  },
  errorComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
      No pudimos cargar las propiedades. Recarga la página.
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
      No encontramos esta página.
    </div>
  ),
});

function PropertiesPage() {
  const { t, lang } = useI18n();
  const { q, country, operation, page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data } = useSuspenseQuery(catalogQuery({ q, country, operation, page }));
  const results = data.properties;
  const countries = data.countries;
  const pageSize = data.pageSize;
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  const [term, setTerm] = useState(q);
  useEffect(() => setTerm(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (term !== q) navigate({ search: (prev) => ({ ...prev, q: term, page: 1 }) });
    }, 350);
    return () => clearTimeout(id);
  }, [term, q, navigate]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("nav_properties")}</h1>
      <p className="mt-2 text-muted-foreground">
        {data.total} {t("results")}
      </p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_where")}
          </span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={t("search_where_ph")}
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_type")}
          </span>
          <select
            value={operation}
            onChange={(e) =>
              navigate({ search: (prev) => ({ ...prev, operation: e.target.value, page: 1 }) })
            }
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">{t("all")}</option>
            <option value="sale">{t("sale")}</option>
            <option value="rent">{t("rent")}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("country")}
          </span>
          <select
            value={country}
            onChange={(e) =>
              navigate({ search: (prev) => ({ ...prev, country: e.target.value, page: 1 }) })
            }
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">{t("all")}</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">{t("no_results")}</p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label={lang === "es" ? "Paginación" : "Pagination"}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: Math.max(1, page - 1) }) })
                }
                className="h-10 rounded-lg border border-input bg-background px-4 text-sm font-semibold disabled:opacity-40"
              >
                {lang === "es" ? "Anterior" : "Previous"}
              </button>
              <span className="px-3 text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() =>
                  navigate({ search: (prev) => ({ ...prev, page: Math.min(totalPages, page + 1) }) })
                }
                className="h-10 rounded-lg border border-input bg-background px-4 text-sm font-semibold disabled:opacity-40"
              >
                {lang === "es" ? "Siguiente" : "Next"}
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}