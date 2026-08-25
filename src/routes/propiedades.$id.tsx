import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Images,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { getPublishedProperty, searchPublishedProperties } from "@/lib/properties.functions";
import { formatPrice, useI18n } from "@/lib/i18n";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PropertyCard } from "@/components/PropertyCard";

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
    const meta: Record<string, string>[] = [
      { title },
      { name: "description", content: p.description.es.slice(0, 155) },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: p.description.es.slice(0, 155) },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (p.image.startsWith("https://")) {
      meta.push(
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      );
    }
    return { meta };
  },
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const gallery = property.images.length > 0 ? property.images : [property.image];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setActive((i) => (i + 1) % gallery.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("link_copied"));
    } catch {
      toast.success(window.location.href);
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${property.city}, ${property.country}`,
  )}`;

  const { data: similarData } = useQuery({
    queryKey: ["similar", property.country, property.id],
    queryFn: () => searchPublishedProperties({ data: { country: property.country, pageSize: 4 } }),
    staleTime: 60_000,
  });
  const similar = (similarData?.properties ?? []).filter((p) => p.id !== property.id).slice(0, 3);

  const stats = [
    { icon: BedDouble, label: `${property.beds} ${t("beds")}` },
    { icon: Bath, label: `${property.baths} ${t("baths")}` },
    { icon: Ruler, label: `${property.area} ${t("area")}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/propiedades"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← {t("back")}
        </Link>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <Share2 className="size-4" />
          {t("share")}
        </button>
      </div>

      {/* Gallery */}
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-border">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label={t("gallery_open")}
          className="block w-full cursor-zoom-in"
        >
          <img
            src={gallery[active]}
            alt={property.title[lang]}
            width={1280}
            height={896}
            className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
          />
        </button>
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur transition-transform hover:scale-105"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur">
          <Images className="size-3.5" />
          {active + 1} / {gallery.length}
        </span>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                i === active
                  ? "border-accent ring-2 ring-accent/30"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt={`${property.title[lang]} — foto ${i + 1}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{property.title[lang]}</DialogTitle>
          <img
            src={gallery[active]}
            alt={property.title[lang]}
            className="max-h-[80vh] w-full rounded-2xl object-contain"
          />
          {gallery.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={prev}
                aria-label="Anterior"
                className="flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="rounded-full bg-background px-4 py-1.5 text-sm font-semibold">
                {active + 1} / {gallery.length}
              </span>
              <button
                type="button"
                onClick={next}
                aria-label="Siguiente"
                className="flex size-10 items-center justify-center rounded-full bg-background text-foreground shadow-md transition-transform hover:scale-105"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              {t(property.operation)}
            </span>
            {property.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-foreground">
                <BadgeCheck className="size-3.5 text-accent" />
                {t("verified")}
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{property.title[lang]}</h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            {property.city}, {property.country}
          </p>
          <p className="mt-4 font-display text-3xl font-bold">
            {formatPrice(property.price, property.currency, lang)}
            {property.operation === "rent" && (
              <span className="text-base font-medium text-muted-foreground">{t("per_month")}</span>
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {stats.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium"
              >
                <Icon className="size-4 text-accent" />
                {label}
              </span>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-semibold">{t("description")}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{property.description[lang]}</p>

          <h2 className="mt-10 text-xl font-semibold">{t("features")}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {(property.features[lang] as string[]).map((f: string) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="size-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-semibold">{t("location")}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{property.city}</p>
                <p className="text-sm text-muted-foreground">{property.country}</p>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-background"
            >
              {t("view_map")}
            </a>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
              {property.owner.name.slice(0, 1).toUpperCase() || "D"}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("owner")}
              </p>
              <p className="font-display text-lg font-semibold">{property.owner.name}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <a
              href={`tel:${property.owner.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface"
            >
              <Phone className="size-4 shrink-0 text-accent" />
              <span className="font-semibold">{property.owner.phone}</span>
            </a>
            <a
              href={`https://wa.me/${property.owner.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface"
            >
              <MessageCircle className="size-4 shrink-0 text-accent" />
              <span className="font-semibold">{property.owner.whatsapp}</span>
            </a>
            <a
              href={`mailto:${property.owner.email}`}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-surface"
            >
              <Mail className="size-4 shrink-0 text-accent" />
              <span className="truncate font-semibold">{property.owner.email}</span>
            </a>
          </div>

          <a
            href={`https://wa.me/${property.owner.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" />
            {t("contact_owner")}
          </a>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-2xl font-bold">{t("similar")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
