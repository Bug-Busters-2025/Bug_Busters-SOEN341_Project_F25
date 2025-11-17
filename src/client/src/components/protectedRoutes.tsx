import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useUser, useAuth } from "@clerk/clerk-react";

type Props = {
  allowedRoles?: string[];
  children: React.ReactNode;
};

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || "/api/v1";

export default function ProtectedRoute({ allowedRoles = [], children }: Props) {
  const authOn = import.meta.env.VITE_ENABLE_AUTH === "1";
  if (!authOn) return <>{children}</>;

  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const location = useLocation();

  const name = useMemo(() => user?.fullName || user?.firstName || user?.username || "User", [user]);
  const email = useMemo(
    () => user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "",
    [user]
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm opacity-70">Loading…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setSyncing(true);
        setSyncError(null);
        const token = await getToken();

        const syncRes = await fetch(`${API_BASE}/auth/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ name, email }),
        });
        if (!syncRes.ok) throw new Error(`sync ${syncRes.status}`);

        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        if (!meRes.ok) throw new Error(`me ${meRes.status}`);

        const me = (await meRes.json()) as { role?: string };
        if (!cancelled) setRole(me.role ?? "");
      } catch (e: any) {
        if (!cancelled) setSyncError(e?.message || "Auth failed");
      } finally {
        if (!cancelled) setSyncing(false);
      }
    }
    if (email) run();
    return () => {
      cancelled = true;
    };
  }, [email, name, getToken]);

  if (syncing || role === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm opacity-70">Signing in…</p>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-red-500 text-sm">{syncError}</p>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role || "")) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-red-500 text-sm">Not authorized.</p>
      </div>
    );
  }

  return <>{children}</>;
}
