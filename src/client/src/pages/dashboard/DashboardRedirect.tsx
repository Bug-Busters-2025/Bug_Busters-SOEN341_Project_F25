import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRole } from "@/hooks/useRole";

export default function DashboardRedirect() {
   const { role, loading } = useRole();
   const navigate = useNavigate();

   useEffect(() => {
      if (loading) return;

      if (role === "student") {
         navigate("/dashboard/my-tickets", { replace: true });
      } else {
         navigate("/dashboard/organizer-events", { replace: true });
      }
   }, [role, loading, navigate]);

   return (
      <div className="flex items-center justify-center h-full">
         <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
   );
}
