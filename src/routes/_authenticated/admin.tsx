import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteProperty,
  getMyAccess,
  listAllProperties,
  setPropertyStatus,
} from "@/lib/properties.functions";
import { formatPrice, useI18n } from "@/lib/i18n";
import type { Status } from "@/data/property-types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | La Estancia" },
      {
        name: "description",
        content: "Aprueba, rechaza o elimina anuncios de casas en venta y renta en La Estancia.",
      },
      { property: "og:title", content: "Panel de administración | La Estancia" },
      { property: "og:description", content: "Moderación global de anuncios de La Estancia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t, lang } = useI18n();
  const access = useServerFn(getMyAccess);
  const fetchAll = useServerFn(listAllProperties);
  const changeStatus = useServerFn(setPropertyStatus);
  const removeOne = useServerFn(deleteProperty);
  const queryClient = useQueryClient();

  const accessQuery = useQuery({ queryKey: ["my-access"], queryFn: () => access() });
  const isAdmin = accessQuery.data?.isAdmin ?? false;

  const listQuery = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => fetchAll(),
    enabled: isAdmin,
  });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    void queryClient.invalidateQueries({ queryKey: ["properties", "published"] });
  };

  const status = useMutation({
    mutationFn: (vars: { id: string; status: Status; verified?: boolean }) =>
      changeStatus({ data: vars }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => removeOne({ data: { id } }),
    onSuccess: refresh,
    onError: (e: Error) => toast.error(e.message),
  });

  if (accessQuery.isLoading) {
    return <p className="mx-auto max-w-5xl px-4 py-20 text-muted-foreground">{t("saving")}</p>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">{t("nav_admin")}</h1>
        <p className="mt-3 text-muted-foreground">{t("admin_only")}</p>
      </div>
    );
  }

  const items = listQuery.data?.properties ?? [];
  const counts = {
    total: items.length,
    pending: items.filter((p) => p.status === "pending").length,
    published: items.filter((p) => p.status === "published").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("admin_title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin_sub")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: t("admin_total"), value: counts.total },
          { label: t("status_pending"), value: counts.pending },
          { label: t("status_published"), value: counts.published },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("form_title")}</th>
              <th className="px-4 py-3">{t("form_country")}</th>
              <th className="px-4 py-3">{t("form_price")}</th>
              <th className="px-4 py-3">{t("admin_status")}</th>
              <th className="px-4 py-3 text-right">{t("admin_actions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 font-medium">{p.title[lang]}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.city}, {p.country}
                </td>
                <td className="px-4 py-3">{formatPrice(p.price, p.currency, lang)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">
                    {t(`status_${p.status}` as "status_pending")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        status.mutate({ id: p.id, status: "published", verified: true })
                      }
                      className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
                    >
                      {t("admin_approve")}
                    </button>
                    <button
                      type="button"
                      onClick={() => status.mutate({ id: p.id, status: "rejected" })}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      {t("admin_reject")}
                    </button>
                    <button
                      type="button"
                      onClick={() => del.mutate(p.id)}
                      className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && !listQuery.isLoading && (
        <p className="mt-6 text-center text-muted-foreground">{t("empty_catalog")}</p>
      )}
    </div>
  );
}