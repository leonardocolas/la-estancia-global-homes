import { createFileRoute } from "@tanstack/react-router";
import { properties } from "@/data/properties";
import { formatPrice, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración | La Estancia" },
      {
        name: "description",
        content: "Panel del administrador general: revisar anuncios, aprobar dueños y gestionar clientes.",
      },
      { property: "og:title", content: "Panel de administración | La Estancia" },
      {
        property: "og:description",
        content: "Control total de anuncios, dueños y usuarios de La Estancia.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { t, lang } = useI18n();

  const stats = [
    { label: t("admin_listings"), value: properties.length },
    { label: t("admin_pending"), value: properties.filter((p) => p.status === "pending").length },
    { label: t("admin_owners"), value: new Set(properties.map((p) => p.owner.name)).size },
    { label: t("admin_clients"), value: 1284 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("admin_title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin_sub")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("admin_table_prop")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin_table_owner")}</th>
                <th className="px-5 py-3 font-semibold">{t("form_price")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin_table_status")}</th>
                <th className="px-5 py-3 font-semibold">{t("admin_table_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-4">
                    <p className="font-medium">{p.title[lang]}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.city}, {p.country} · {t(p.operation)}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.owner.name}</td>
                  <td className="px-5 py-4 font-medium">
                    {formatPrice(p.price, p.currency, lang)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.status === "published"
                          ? "bg-surface text-foreground"
                          : p.status === "pending"
                            ? "bg-gold/25 text-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t(`status_${p.status}`)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                        {t("approve")}
                      </button>
                      <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                        {t("reject")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}