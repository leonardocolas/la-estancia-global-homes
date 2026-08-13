import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

const dict: Dict = {
  brand: { es: "La Estancia", en: "La Estancia" },
  tagline: {
    es: "Casas para venta y renta en todo el mundo",
    en: "Homes for sale and rent all over the world",
  },
  nav_home: { es: "Inicio", en: "Home" },
  nav_properties: { es: "Propiedades", en: "Properties" },
  nav_publish: { es: "Publicar", en: "List your home" },
  nav_admin: { es: "Admin", en: "Admin" },
  nav_mine: { es: "Mis casas", en: "My homes" },
  nav_login: { es: "Entrar", en: "Sign in" },
  nav_logout: { es: "Salir", en: "Sign out" },
  empty_catalog: {
    es: "Todavía no hay casas publicadas. Sé el primero en publicar la tuya.",
    en: "No homes published yet. Be the first to list yours.",
  },
  auth_title: { es: "Entra o crea tu cuenta", en: "Sign in or create your account" },
  auth_sub: {
    es: "Necesitas una cuenta para publicar y gestionar tus casas.",
    en: "You need an account to list and manage your homes.",
  },
  auth_signin: { es: "Iniciar sesión", en: "Sign in" },
  auth_signup: { es: "Crear cuenta", en: "Create account" },
  auth_google: { es: "Continuar con Google", en: "Continue with Google" },
  auth_name: { es: "Nombre completo", en: "Full name" },
  auth_password: { es: "Contraseña", en: "Password" },
  auth_switch_signup: { es: "¿No tienes cuenta? Créala", en: "No account? Create one" },
  auth_switch_signin: { es: "¿Ya tienes cuenta? Entra", en: "Already have an account? Sign in" },
  auth_check_email: {
    es: "Revisa tu correo para confirmar la cuenta.",
    en: "Check your email to confirm your account.",
  },
  mine_title: { es: "Mis casas publicadas", en: "My listed homes" },
  mine_sub: {
    es: "Gestiona tus anuncios: pausa, reactiva o elimina.",
    en: "Manage your listings: pause, resume or delete.",
  },
  mine_empty: { es: "Aún no has publicado ninguna casa.", en: "You haven't listed any home yet." },
  pause: { es: "Pausar", en: "Pause" },
  resume: { es: "Reactivar", en: "Resume" },
  delete: { es: "Eliminar", en: "Delete" },
  saving: { es: "Guardando…", en: "Saving…" },
  publish_ok: {
    es: "¡Listo! Tu casa quedó enviada para revisión.",
    en: "Done! Your home was submitted for review.",
  },
  admin_only: {
    es: "Solo el administrador general puede ver esta página.",
    en: "Only the general admin can see this page.",
  },
  hero_title: { es: "Tu próxima casa, sin fronteras", en: "Your next home, without borders" },
  hero_sub: {
    es: "Dueños de todo el mundo publican sus casas. Compra o renta desde donde estés: de Madrid a La Habana, de Ciudad de México a Miami.",
    en: "Owners worldwide list their homes. Buy or rent from anywhere: from Madrid to Havana, Mexico City to Miami.",
  },
  hero_cta: { es: "Ver propiedades", en: "Browse properties" },
  hero_cta2: { es: "Publicar mi casa", en: "List my home" },
  search_where: { es: "¿Dónde?", en: "Where?" },
  search_where_ph: { es: "País o ciudad", en: "Country or city" },
  search_type: { es: "Operación", en: "Operation" },
  search_budget: { es: "Precio máximo", en: "Max price" },
  search_btn: { es: "Buscar", en: "Search" },
  sale: { es: "Venta", en: "Sale" },
  rent: { es: "Renta", en: "Rent" },
  all: { es: "Todas", en: "All" },
  featured: { es: "Destacadas", en: "Featured" },
  featured_sub: {
    es: "Selección de casas verificadas por nuestro equipo.",
    en: "A selection of homes verified by our team.",
  },
  per_month: { es: "/mes", en: "/month" },
  beds: { es: "hab.", en: "beds" },
  baths: { es: "baños", en: "baths" },
  area: { es: "m²", en: "m²" },
  view_all: { es: "Ver todas las propiedades", en: "See all properties" },
  results: { es: "propiedades encontradas", en: "properties found" },
  filters: { es: "Filtros", en: "Filters" },
  country: { es: "País", en: "Country" },
  clear: { es: "Limpiar", en: "Clear" },
  no_results: { es: "No hay propiedades con esos filtros.", en: "No properties match these filters." },
  owner: { es: "Publicado por", en: "Listed by" },
  contact_owner: { es: "Contactar al dueño", en: "Contact the owner" },
  phone: { es: "Teléfono", en: "Phone" },
  whatsapp: { es: "WhatsApp", en: "WhatsApp" },
  email: { es: "Correo", en: "Email" },
  description: { es: "Descripción", en: "Description" },
  features: { es: "Características", en: "Features" },
  verified: { es: "Verificada", en: "Verified" },
  back: { es: "Volver", en: "Back" },
  publish_title: { es: "Publica tu casa en minutos", en: "List your home in minutes" },
  publish_sub: {
    es: "Sube fotos, describe tu casa y define el precio. Clientes de todo el mundo la verán.",
    en: "Upload photos, describe your home and set the price. Clients worldwide will see it.",
  },
  form_title: { es: "Título del anuncio", en: "Listing title" },
  form_country: { es: "País", en: "Country" },
  form_city: { es: "Ciudad", en: "City" },
  form_op: { es: "Tipo de operación", en: "Operation type" },
  form_price: { es: "Precio", en: "Price" },
  form_currency: { es: "Moneda", en: "Currency" },
  form_beds: { es: "Habitaciones", en: "Bedrooms" },
  form_baths: { es: "Baños", en: "Bathrooms" },
  form_area: { es: "Área (m²)", en: "Area (m²)" },
  form_desc: { es: "Descripción", en: "Description" },
  form_photos: { es: "Fotos de la casa", en: "Home photos" },
  form_photos_hint: {
    es: "Arrastra tus imágenes aquí o haz clic para seleccionarlas",
    en: "Drag your images here or click to select them",
  },
  form_contact: { es: "Datos de contacto visibles", en: "Public contact details" },
  form_submit: { es: "Enviar para revisión", en: "Submit for review" },
  form_note: {
    es: "Revisamos cada anuncio antes de publicarlo.",
    en: "We review every listing before publishing it.",
  },
  form_features: {
    es: "Características (una por línea)",
    en: "Features (one per line)",
  },
  admin_title: { es: "Panel de administración", en: "Admin panel" },
  admin_sub: {
    es: "Control total de anuncios, dueños y usuarios.",
    en: "Full control over listings, owners and users.",
  },
  admin_listings: { es: "Anuncios", en: "Listings" },
  admin_pending: { es: "Pendientes", en: "Pending" },
  admin_owners: { es: "Dueños", en: "Owners" },
  admin_clients: { es: "Clientes", en: "Clients" },
  admin_table_prop: { es: "Propiedad", en: "Property" },
  admin_table_owner: { es: "Dueño", en: "Owner" },
  admin_table_status: { es: "Estado", en: "Status" },
  admin_table_actions: { es: "Acciones", en: "Actions" },
  status_published: { es: "Publicada", en: "Published" },
  status_pending: { es: "Pendiente", en: "Pending" },
  status_paused: { es: "Pausada", en: "Paused" },
  status_rejected: { es: "Rechazada", en: "Rejected" },
  approve: { es: "Aprobar", en: "Approve" },
  reject: { es: "Rechazar", en: "Reject" },
  footer_rights: { es: "Todos los derechos reservados.", en: "All rights reserved." },
  footer_note: {
    es: "Casas para venta y renta en más de 40 países.",
    en: "Homes for sale and rent in more than 40 countries.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string };

const I18nContext = createContext<Ctx>({ lang: "es", setLang: () => {}, t: (k) => String(k) });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem("la-estancia-lang");
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("la-estancia-lang", l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((k: keyof typeof dict) => dict[k]?.[lang] ?? String(k), [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function formatPrice(amount: number, currency: string, lang: Lang) {
  return new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}