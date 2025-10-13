import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

export function useUserId() {
   const { user, isLoaded } = useUser();
   const { getToken } = useAuth();
   const [userId, setUserId] = useState<number | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!isLoaded || !user) {
         setLoading(false);
         return;
      }

      const fetchUserId = async () => {
         try {
            const token = await getToken();
            const response = await axios.get(
               "http://localhost:3000/api/v1/auth/me",
               {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
               }
            );

            setUserId(response.data.id);
         } catch (error) {
            console.error("Failed to fetch user ID:", error);
            setUserId(null);
         } finally {
            setLoading(false);
         }
      };

      fetchUserId();
   }, [isLoaded, user, getToken]);

   return { userId, loading };
}
