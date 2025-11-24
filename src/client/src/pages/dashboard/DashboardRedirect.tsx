import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { useUser, useAuth } from "@clerk/clerk-react";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "/api/v1";

export default function DashboardRedirect() {
  const authOn = import.meta.env.VITE_ENABLE_AUTH === "1";
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [role, setRole] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const target = useMemo(() => {
    if (!role) return null;
    if (role === "admin") return "/dashboard/admin";
    if (role === "organizer") return "/dashboard/organizer-events";
    return "/dashboard/my-tickets";
  }, [role]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        if (!res.ok) throw new Error(`me ${res.status}`);
        const data = await res.json();
        if (!cancelled) setRole(data?.role || "student");
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "auth");
      }
    }

    if (!authOn) {
      setRole("student");
      return;
    }
    if (isLoaded && isSignedIn) load();

    return () => {
      cancelled = true;
    };
  }, [authOn, isLoaded, isSignedIn, getToken]);

  if (authOn && (!isLoaded || !isSignedIn)) {
    return <Navigate to="/sign-in" replace />;
  }

  if (err) {
    return <Navigate to="/" replace />;
  }

  if (!target) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm opacity-70">Loading…</p>
      </div>
    );
  }

  return <Navigate to={target} replace />;
}
