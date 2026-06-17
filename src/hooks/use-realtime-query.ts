import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseRealtimeQueryOptions<T extends { id: string }> {
  table: string;
  channel: string;
  select?: string;
  order?: { column: string; ascending: boolean };
  limit?: number;
  filter?: { column: string; value: string };
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  realtimeFilter?: string;
  onPayload?: (prev: T[], payload: RealtimePostgresChangesPayload<T>) => T[];
}

const defaultOnPayload = <T extends { id: string }>(
  prev: T[],
  payload: RealtimePostgresChangesPayload<T>,
  limit: number,
): T[] => {
  if (payload.eventType === "DELETE") {
    return prev.filter((r) => r.id !== (payload.old as T).id);
  }
  const row = payload.new as T;
  const others = prev.filter((r) => r.id !== row.id);
  return [row, ...others].slice(0, limit);
};

export function useRealtimeQuery<T extends { id: string }>(options: UseRealtimeQueryOptions<T>) {
  const {
    table,
    channel: channelName,
    select = "*",
    order = { column: "created_at", ascending: false },
    limit = 50,
    filter,
    event = "*",
    realtimeFilter,
    onPayload,
  } = options;

  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table name is dynamic
      let query = supabase.from(table as any).select(select);
      if (filter) query = query.eq(filter.column, filter.value);
      query = query.order(order.column, { ascending: order.ascending }).limit(limit);

      const { data: rows } = await query;
      if (!cancelled) setData((rows ?? []) as unknown as T[]);
    })();

    const pgFilter: Record<string, string> = {
      event,
      schema: "public",
      table,
    };
    if (realtimeFilter) pgFilter.filter = realtimeFilter;

    const channel = supabase
      .channel(channelName)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- realtime filter shape is dynamic
      .on("postgres_changes", pgFilter as any, (payload: RealtimePostgresChangesPayload<T>) => {
        setData((prev) =>
          onPayload ? onPayload(prev, payload) : defaultOnPayload(prev, payload, limit),
        );
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filter/onPayload are intentionally compared by primitives
  }, [
    table,
    channelName,
    select,
    order.column,
    order.ascending,
    limit,
    filter?.column,
    filter?.value,
    event,
    realtimeFilter,
  ]);

  return [data, setData] as const;
}
