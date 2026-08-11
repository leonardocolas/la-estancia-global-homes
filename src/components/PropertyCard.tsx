import { Link } from "@tanstack/react-router";
import { formatPrice, useI18n } from "@/lib/i18n";
import type { Property } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  const { lang, t } = useI18n();

  return (
    <Link
      to="/propiedades/$id"
      params={{ id: property.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title[lang]}
          loading="lazy"
          width={1280}
          height={896}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground backdrop-blur">
          {t(property.operation)}
        </span>
        {property.verified && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            ✓ {t("verified")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {property.city}, {property.country}
        </p>
        <h3 className="text-lg font-semibold leading-snug">{property.title[lang]}</h3>
        <p className="text-sm text-muted-foreground">
          {property.beds} {t("beds")} · {property.baths} {t("baths")} · {property.area} {t("area")}
        </p>
        <p className="mt-auto font-display text-xl font-bold text-foreground">
          {formatPrice(property.price, property.currency, lang)}
          {property.operation === "rent" && (
            <span className="text-sm font-medium text-muted-foreground">{t("per_month")}</span>
          )}
        </p>
      </div>
    </Link>
  );
}