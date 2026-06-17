
CREATE TABLE public.guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact text NOT NULL,
  relationship text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guardians TO authenticated;
GRANT ALL ON public.guardians TO service_role;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own guardians" ON public.guardians FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.guardian_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'safe',
  note text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guardian_checkins TO authenticated;
GRANT ALL ON public.guardian_checkins TO service_role;
ALTER TABLE public.guardian_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own checkins" ON public.guardian_checkins FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.knowledge_pack_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_slug text NOT NULL,
  downloaded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, pack_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_pack_downloads TO authenticated;
GRANT ALL ON public.knowledge_pack_downloads TO service_role;
ALTER TABLE public.knowledge_pack_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pack downloads" ON public.knowledge_pack_downloads FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
