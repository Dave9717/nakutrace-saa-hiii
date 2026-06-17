import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listUsers, listAllAlerts, setUserRole, resolveAlert } from "@/lib/admin.functions";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Users, Siren } from "lucide-react";
import { formatCoords } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Console — NAKUTRACE SAI" }] }),
  component: AdminPage,
});

const ROLES = ["admin", "moderator", "ranger", "user"] as const;

function AdminPage() {
  const qc = useQueryClient();
  const usersFn = useServerFn(listUsers);
  const alertsFn = useServerFn(listAllAlerts);
  const setRoleFn = useServerFn(setUserRole);
  const resolveFn = useServerFn(resolveAlert);

  const users = useQuery({ queryKey: ["admin", "users"], queryFn: () => usersFn({}) });
  const alerts = useQuery({ queryKey: ["admin", "alerts"], queryFn: () => alertsFn({}) });

  const grant = useMutation({
    mutationFn: (vars: { userId: string; role: (typeof ROLES)[number]; grant: boolean }) =>
      setRoleFn({ data: vars }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resolve = useMutation({
    mutationFn: (id: string) => resolveFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Alert resolved");
      qc.invalidateQueries({ queryKey: ["admin", "alerts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (users.isError)
    return (
      <AppShell>
        <div className="p-8 text-destructive">Forbidden — admin role required.</div>
      </AppShell>
    );

  return (
    <AppShell>
      <div className="container mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Admin Console
          </h1>
          <p className="text-sm text-muted-foreground">
            User roles, SOS triage and operator analytics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Users</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-2xl font-bold">{users.data?.profiles.length ?? "—"}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Active SOS</p>
              <Siren className="h-4 w-4 text-destructive" />
            </div>
            <p className="mt-1 text-2xl font-bold text-destructive">
              {users.data?.activeAlertCount ?? "—"}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Operators</p>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-2xl font-bold">
              {users.data?.roles.filter((r) => r.role !== "user").length ?? "—"}
            </p>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="alerts">SOS Triage</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="w-[220px]">Grant role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.data?.profiles.map((p) => {
                    const userRoles = users
                      .data!.roles.filter((r) => r.user_id === p.id)
                      .map((r) => r.role);
                    return (
                      <UserRow
                        key={p.id}
                        profile={p}
                        userRoles={userRoles}
                        onToggle={(role, on) => grant.mutate({ userId: p.id, role, grant: on })}
                        pending={grant.isPending}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Created</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.data?.alerts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs">
                        {new Date(a.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{a.message || "—"}</TableCell>
                      <TableCell className="text-xs">
                        {formatCoords(a.latitude, a.longitude) ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={a.status === "active" ? "destructive" : "secondary"}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {a.status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => resolve.mutate(a.id)}
                            disabled={resolve.isPending}
                          >
                            Resolve
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {alerts.data?.alerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        No alerts on record.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function UserRow({
  profile,
  userRoles,
  onToggle,
  pending,
}: {
  profile: {
    id: string;
    display_name: string | null;
    call_sign: string | null;
    home_region: string | null;
  };
  userRoles: string[];
  onToggle: (role: (typeof ROLES)[number], grant: boolean) => void;
  pending: boolean;
}) {
  const [selected, setSelected] = useState<(typeof ROLES)[number]>("ranger");
  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{profile.display_name || "Unnamed"}</div>
        <div className="text-xs text-muted-foreground">
          {profile.call_sign || profile.id.slice(0, 8)}
        </div>
      </TableCell>
      <TableCell className="text-xs">{profile.home_region || "—"}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {userRoles.length === 0 ? (
            <Badge variant="secondary">user</Badge>
          ) : (
            userRoles.map((r) => (
              <Badge
                key={r}
                variant={r === "admin" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => onToggle(r as (typeof ROLES)[number], false)}
              >
                {r} ×
              </Badge>
            ))
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Select value={selected} onValueChange={(v) => setSelected(v as (typeof ROLES)[number])}>
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => onToggle(selected, true)}
          >
            Grant
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
