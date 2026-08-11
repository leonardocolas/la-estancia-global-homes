import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();

  const links = [
    { to: "/", label: t("nav_home") },
    { to: "/propiedades", label: t("nav_properties") },
    { to: "/publicar", label: t("nav_publish") },
    { to: "/admin", label: t("nav_admin") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
            E
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">La Estancia</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              activeProps={{ className: "bg-surface text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="flex items-center rounded-lg border border-border p-0.5">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <Link
            to="/publicar"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            {t("nav_publish")}
          </Link>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-border/70 px-4 py-2 md:hidden">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm text-muted-foreground"
            activeProps={{ className: "bg-surface text-foreground" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}