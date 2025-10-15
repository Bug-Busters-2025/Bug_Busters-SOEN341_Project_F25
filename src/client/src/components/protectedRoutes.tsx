import { Navigate, useNavigate, useLocation } from "react-router";
import { useRole } from "@/hooks/useRole";
import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

interface ProtectedRouteProps {
   allowedRoles?: string[];
   children: React.ReactNode;
}
export default function ProtectedRoute({
   allowedRoles = [],
   children,
}: ProtectedRouteProps) {
   const { isSignedIn, isLoaded } = useUser();
   const { role, loading } = useRole();
   const [redirecting, setRedirecting] = useState(false);
   const navigate = useNavigate();
   const location = useLocation();

   if (!isLoaded) {
      return <p>Loading user session...</p>;
   }
   if (!isSignedIn) {
      if (!redirecting) {
         setRedirecting(true);
         setTimeout(
            () =>
               navigate("/sign-in", {
                  state: { from: location },
                  replace: true,
               }),
            1000
         );
      }

      return (
         <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <p className="text-lg font-semibold text-red-500">
               ⚠️ You must sign in to access this page.
            </p>
            <p className="text-sm text-gray-400 mt-2">
               Redirecting you to the sign-in page...
            </p>
         </div>
      );
   }

   if (loading || !isLoaded)
      return <p className="text-center mt-10">Loading...</p>;

   if (!allowedRoles.includes(role ?? "")) {
      if (!redirecting) {
         setRedirecting(true);

         setTimeout(
            () =>
               navigate("/sign-in", {
                  state: { from: location },
                  replace: true,
               }),
            1000
         );
      }

      return (
         <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <p className="text-lg font-semibold text-red-500">
               🚫 You are not authorized to view this page.
            </p>
            <p className="text-sm text-gray-400 mt-2">
               Redirecting you to the home page...
            </p>
         </div>
      );
   }

   return <>{children}</>;
}
