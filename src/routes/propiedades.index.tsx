import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { countries, properties, type Operation } from "@/data/properties";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/propiedades/")({
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
});

function PropertiesPage() {
  const { t, lang } = useI18n();
  const [op, setOp] = useState<Operation | "all">("all");
  const [country, setCountry] = useState<string>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      properties.filter((p) => {
        if (p.status !== "published") return false;
        if (op !== "all" && p.operation !== op) return false;
        if (country !== "all" && p.country !== country) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          const hay = `${p.title[lang]} ${p.city} ${p.country}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [op, country, query, lang],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("nav_properties")}</h1>
      <p className="mt-2 text-muted-foreground">
        {results.length} {t("results")}
      </p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5 lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_where")}
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_where_ph")}
            className="h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("search_type")}
          </span>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value as Operation | "all")}
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
            onChange={(e) => setCountry(e.target.value)}
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}