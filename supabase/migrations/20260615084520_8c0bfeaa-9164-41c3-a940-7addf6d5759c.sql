
-- Join code
CREATE OR REPLACE FUNCTION public.gen_join_code() RETURNS TEXT
LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT upper(substring(replace(gen_random_uuid()::text,'-','') from 1 for 6))
$$;

ALTER TABLE public.convoys ADD COLUMN join_code TEXT UNIQUE DEFAULT public.gen_join_code();
UPDATE public.convoys SET join_code = public.gen_join_code() WHERE join_code IS NULL;
ALTER TABLE public.convoys ALTER COLUMN join_code SET NOT NULL;

-- Allow convoy members to read teammate profiles
CREATE POLICY "profiles readable by convoy mates" ON public.profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.convoy_members me
    JOIN public.convoy_members them ON them.convoy_id = me.convoy_id
    WHERE me.user_id = auth.uid() AND them.user_id = profiles.id
  )
);
