import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from 'axios';


export default function SyncUser({role = "student"}: {role?: "student" | "organizer"}) {

    const {user, isLoaded} = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;

        const sync = async () => {
            try {
                await axios.post("http://localhost:3000/api/users/sync", {
                    name: user.fullName,
                    email: user.primaryEmailAddress?.emailAddress,
                    role: role
                });
                console.log(`✅ Synced ${role} user:`, user.fullName);
            } catch (error) {
                console.error("Failed to sync user:", error);
            }
        };
        sync();
    }, [isLoaded, user, role]);

    return null;

}