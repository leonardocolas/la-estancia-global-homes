import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteProperty,
  listMyProperties,
  setPropertyStatus,
} from "@/lib/properties.functions";
import { formatPrice, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/mis-casas")({
  head: () => ({
    meta: [
      { title: "Mis casas publicadas | La Estancia" },
      {
        name: "description",
        content: "Gestiona tus anuncios de venta y renta: pausa, reactiva o elimina tus casas.",
      },
      { property: "og:title", content: "Mis casas publicadas | La Estancia" },
      { property: "og:description", content: "Panel del dueño para gestionar sus anuncios." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MyPropertiesPage,
});

function MyPropertiesPage() {
  const { t, lang } = useI18n();
  const fetchMine = useServerFn(listMyProperties);
  const changeStatus = useServerFn(setPropertyStatus);
  const removeOne = useServerFn(deleteProperty);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["my-properties"], queryFn: () => fetchMine() });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    void queryClient.invalidateQueries({ queryKey: ["properties", "published"] });
  };

  const status = useMutation({
    mutationFn: (vars: { id: string; status: "published" | "paused" }) =>
      changeStatus({ data: vars }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeOne({ data: { id } }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  const items = data?.properties ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{t("mine_title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("mine_sub")}</p>
        </div>
        <Link
          to="/publicar"
          className="h-11 rounded-lg bg-accent px-5 text-sm font-semibold leading-[2.75rem] text-accent-foreground"
        >
          {t("nav_publish")}
        </Link>
      </div>

      {isLoading ? (
        <p className="mt-10 text-muted-foreground">{t("saving")}</p>
      ) : items.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          {t("mine_empty")}
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {items.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <img
                src={p.image}
                alt={p.title[lang]}
                className="size-20 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="min-w-48 flex-1">
                <p className="font-semibold">{p.title[lang]}</p>
                <p className="text-sm text-muted-foreground">
                  {p.city}, {p.country} · {formatPrice(p.price, p.currency, lang)}
                </p>
              </div>
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">
                {t(`status_${p.status}` as "status_pending")}
              </span>
              <div className="flex gap-2">
                {p.status === "published" ? (
                  <button
                    type="button"
                    onClick={() => status.mutate({ id: p.id, status: "paused" })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                  >
                    {t("pause")}
                  </button>
                ) : p.status === "paused" ? (
                  <button
                    type="button"
                    onClick={() => status.mutate({ id: p.id, status: "published" })}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                  >
                    {t("resume")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => del.mutate(p.id)}
                  className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
                >
                  {t("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}