import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(context: any) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profiles }, { data: roles }, { data: alerts }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, call_sign, avatar_url, home_region, created_at").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("sos_alerts").select("id, status").eq("status", "active"),
    ]);
    return {
      profiles: profiles ?? [],
      roles: roles ?? [],
      activeAlertCount: (alerts ?? []).length,
    };
  });

export const listAllAlerts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("sos_alerts")
      .select("id, user_id, message, latitude, longitude, status, severity, created_at, resolved_at")
      .order("created_at", { ascending: false })
      .limit(100);
    return { alerts: data ?? [] };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    userId: z.string().uuid(),
    role: z.enum(["admin", "moderator", "ranger", "user"]),
    grant: z.boolean(),
  }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin.from("user_roles").upsert({ user_id: data.userId, role: data.role });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("user_roles").delete().match({ user_id: data.userId, role: data.role });
      if (error) throw error;
    }
    return { ok: true };
  });

export const resolveAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("sos_alerts")
      .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: context.userId })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });