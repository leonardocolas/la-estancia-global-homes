CREATE TABLE public.leads (
  id uuid not null default gen_random_uuid() primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  phone text not null default '' check (char_length(phone) <= 40),
  message text not null check (char_length(message) between 1 and 1000),
  created_at timestamp with time zone not null default now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_public_insert" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "leads_owner_read" ON public.leads
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "leads_admin_all" ON public.leads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX leads_owner_id_idx ON public.leads(owner_id);
CREATE INDEX leads_property_id_idx ON public.leads(property_id);