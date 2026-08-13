import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar o crear cuenta | La Estancia" },
      {
        name: "description",
        content:
          "Accede a tu cuenta de La Estancia para publicar casas en venta o renta y gestionar tus anuncios.",
      },
      { property: "og:title", content: "Entrar o crear cuenta | La Estancia" },
      {
        property: "og:description",
        content: "Cuenta gratuita para dueños que quieren vender o rentar su casa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const field =
  "h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/publicar" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/publicar`,
          },
        });
        if (error) throw error;
        toast.success(t("auth_check_email"));
        const { data } = await supabase.auth.getSession();
        if (data.session) void navigate({ to: "/publicar" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        void navigate({ to: "/publicar" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message ?? "Error");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/publicar" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold">{t("auth_title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("auth_sub")}</p>

      <form
        onSubmit={submit}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
      >
        {mode === "signup" && (
          <input
            className={`${field} w-full`}
            placeholder={t("auth_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className={`${field} w-full`}
          type="email"
          autoComplete="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={`${field} w-full`}
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder={t("auth_password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-lg bg-accent text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {mode === "signup" ? t("auth_signup") : t("auth_signin")}
        </button>

        <button
          type="button"
          onClick={google}
          className="h-11 w-full rounded-lg border border-border bg-background text-sm font-semibold transition-colors hover:bg-surface"
        >
          {t("auth_google")}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? t("auth_switch_signup") : t("auth_switch_signin")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link to="/propiedades" className="text-muted-foreground hover:text-foreground">
          ← {t("nav_properties")}
        </Link>
      </p>
    </div>
  );
}