import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-base font-semibold text-foreground">La Estancia</p>
        <p>{t("footer_note")}</p>
        <p>© {new Date().getFullYear()} La Estancia. {t("footer_rights")}</p>
      </div>
    </footer>
  );
}