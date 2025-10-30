import { useUser, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

export default function SyncUser({
   role = "student",
}: {
   role?: "student" | "organizer";
}) {
   const { user, isLoaded } = useUser();
   const { getToken } = useAuth();

   useEffect(() => {
      if (!isLoaded || !user) return;

      const sync = async () => {
         try {
            const token = await getToken();
            const host = window.location.hostname;
            await axios.post(
               
               `http://${host}:3000/api/v1/auth/sync`,
               {
                  name: user.fullName,
                  email: user.primaryEmailAddress?.emailAddress,
                  role: role,
               },
               {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
               }
            );
            console.log(`✅ Synced ${role} user:`, user.fullName);
         } catch (error) {
            console.error("Failed to sync user:", error);
         }
      };
      sync();
   }, [isLoaded, user, role]);

   return null;
}
