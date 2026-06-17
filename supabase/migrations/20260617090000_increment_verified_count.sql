-- Atomic increment for community_reports.verified_count to prevent race conditions.
CREATE OR REPLACE FUNCTION public.increment_verified_count(_report_id uuid)
RETURNS void LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.community_reports
  SET verified_count = verified_count + 1, updated_at = now()
  WHERE id = _report_id;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_verified_count(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_verified_count(uuid) TO authenticated;
