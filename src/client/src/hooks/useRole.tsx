import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios"

export function useRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchRole = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) return;

        const response = await axios.get(
          `http://localhost:3000/api/users/role/${email}`
        );

        setRole(response.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [isLoaded, user]);

  return { role, loading };
}
