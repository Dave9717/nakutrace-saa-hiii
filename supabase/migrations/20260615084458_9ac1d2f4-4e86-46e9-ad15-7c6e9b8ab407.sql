
-- Community reports
CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('hazard','fuel','water','wildlife','security','road','medical','other')),
  title TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info','low','medium','high','critical')),
  verified_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_reports TO authenticated;
GRANT ALL ON public.community_reports TO service_role;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports readable by authenticated" ON public.community_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "reports insert own" ON public.community_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports update own" ON public.community_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reports delete own" ON public.community_reports FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_reports_touch BEFORE UPDATE ON public.community_reports FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Convoy messages
CREATE TABLE public.convoy_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  convoy_id UUID NOT NULL REFERENCES public.convoys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.convoy_messages TO authenticated;
GRANT ALL ON public.convoy_messages TO service_role;
ALTER TABLE public.convoy_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "convoy msgs readable by members" ON public.convoy_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.convoy_members m WHERE m.convoy_id = convoy_messages.convoy_id AND m.user_id = auth.uid()));
CREATE POLICY "convoy msgs insert by members" ON public.convoy_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.convoy_members m WHERE m.convoy_id = convoy_messages.convoy_id AND m.user_id = auth.uid()));
CREATE POLICY "convoy msgs delete own" ON public.convoy_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.convoy_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.convoy_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_reports;
