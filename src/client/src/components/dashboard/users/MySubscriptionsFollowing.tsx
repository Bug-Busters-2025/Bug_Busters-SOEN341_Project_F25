import { useOutletContext } from "react-router-dom";
import type { SubscriptionContextType } from "@/types/subscription";

export default function MySubscriptionsFollowing() {
    const { organizers, onUnfollow } = 
        useOutletContext<SubscriptionContextType>();
    
    return (
        <section>
            <h2 className="text-lg font-semibold mb-3">Organizers you follow</h2>
            {organizers.length === 0 ? (
            <p className="text-sm text-neutral-400">You’re not following anyone yet.</p>
            ) : (
            <ul className="space-y-2">
                {organizers.map((org) => (
                <li
                    key={org.organizer_id}
                    className="flex items-center justify-between rounded-lg border border-white/10 p-3"
                >
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="font-medium">{org.name}</div>
                            <div className="text-xs text-neutral-400">{org.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => onUnfollow(org.organizer_id)}
                        className="text-xs rounded-md border border-white/15 px-3 py-1 hover:bg-white/5"
                    >
                        Unfollow
                    </button>
                </li>
                ))}
            </ul>
            )}
        </section>
    );
}