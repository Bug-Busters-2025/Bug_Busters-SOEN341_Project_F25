import { 
    useEffect, 
    useMemo, 
    useState,
} from "react";
import { 
    Outlet, 
    useLocation,
    useNavigate 
} from "react-router";
import {
    getFollowing,
    getMyFeed,
    unfollowOrganizer,
    followOrganizer,
} from "@/utils/asyncStudentSubscription";
import type {
    OrganizerSummary,
    FollowingListResponse,
    FeedResponse,
} from "@/types/subscription";
import type { Event } from "@/types/event";
import { Button } from "@/components/ui/button";


export default function StudentSubscription() {
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [subscriptions, setSubscriptions] = useState<OrganizerSummary[]>([]);
    const [subscriptionEvents, setSubscriptionEvents] = useState<Event[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const [followingRes, feedRes]: [FollowingListResponse, FeedResponse] =
                    await Promise.all([getFollowing(), getMyFeed(50, 0)]);
                if (cancelled) return;

                setSubscriptions(followingRes.organizers);
                setSubscriptionEvents(feedRes.events);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? "Failed to load subscriptions");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const followedOrgIds = useMemo(() => new Set(subscriptions.map((o) => o.id)), [subscriptions]);
    const isFollowing = (orgId: number) => followedOrgIds.has(orgId);

    const onUnfollow = async (orgId: number) => {
        const prev = subscriptions;
        setSubscriptions((list) => list.filter((o) => o.id !== orgId));
        try {
            await unfollowOrganizer(orgId);
            setSubscriptionEvents((evs) => evs.filter((e) => e.organizer_id !== orgId));
        } catch (e: any) {
            setSubscriptions(prev); // rollback
            setError(e?.message ?? "Unfollow failed");
        }
    };

    const onFollow = async (orgId: number) => {
        try {
            await followOrganizer(orgId);
            const res = await getFollowing();
            setSubscriptions(res.organizers);
        } catch (e: any) {
            setError(e?.message ?? "Follow failed");
        }
    };

    if (loading) {
        return (
            <div id="dsh-std-subscribptions" className="p-4">
                <p className="text-sm text-neutral-400">Loading your subscriptions…</p>
            </div>
        );
    }

    const getButtonVariant = (path: string): boolean => {
        const buttonName = path.substring(path.lastIndexOf('/') + 1);
        const currentUrlSegment = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
        return currentUrlSegment.toLowerCase() === buttonName.toLowerCase();
    };

    return (
        <div id="dsh-std-subscriptions" className="flex flex-col h-full w-full items-center space-y-8 p-6"> 
            <div className="flex flex-row justify-evenly w-[250px] border rounded-l-full rounded-r-full"> 
                <Button 
                    variant={getButtonVariant("./feed") ? "primary" : "ghost"} 
                    onClick={() => navigate("./feed")}
                    className="flex-1 rounded-l-full text-white" 
                > 
                    Event Feed 
                </Button> 
                <Button 
                    variant={getButtonVariant("./following") ? "primary" : "ghost"} 
                    onClick={() => navigate("./following")} 
                    className="flex-1 rounded-r-full text-white"
                > 
                    Subscriptions
                </Button>
            </div>
            <Outlet/> 
        </div>
        // <div id="dsh-std-subscriptions" className="p-4 space-y-8">
        //     {error && (
        //     <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-red-300 text-sm">
        //         {error}
        //     </div>
        //     )}
        //     <section>
        //         <h2 className="text-lg font-semibold mb-3">Organizers you follow</h2>
        //         {subscriptions.length === 0 ? (
        //         <p className="text-sm text-neutral-400">You’re not following anyone yet.</p>
        //         ) : (
        //         <ul className="space-y-2">
        //             {subscriptions.map((org) => (
        //             <li
        //                 key={org.id}
        //                 className="flex items-center justify-between rounded-lg border border-white/10 p-3"
        //             >
        //                 <div className="flex items-center gap-3">
        //                     <div>
        //                         <div className="font-medium">{org.name}</div>
        //                         <div className="text-xs text-neutral-400">{org.email}</div>
        //                     </div>
        //                 </div>
        //                 <button
        //                     onClick={() => onUnfollow(org.id)}
        //                     className="text-xs rounded-md border border-white/15 px-3 py-1 hover:bg-white/5"
        //                 >
        //                 Unfollow
        //                 </button>
        //             </li>
        //             ))}
        //         </ul>
        //         )}
        //     </section>
        //     <section>
        //         <h2 className="text-lg font-semibold mb-3">Events from organizers you follow</h2>
        //         {subscriptionEvents.length === 0 ? (
        //         <p className="text-sm text-neutral-400">No upcoming events yet.</p>
        //         ) : (
        //         <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        //             {subscriptionEvents.map((e) => (
        //             <li key={e.id} className="rounded-lg border border-white/10 p-4">
        //                 <div className="text-sm text-neutral-400 mb-1">
        //                 {isFollowing(e.organizer_id!) ? "Following organizer" : "Not following"}
        //                 </div>
        //                 <h3 className="font-semibold">{e.title}</h3>
        //                 {e.location && (
        //                 <div className="text-sm text-neutral-300">{e.location}</div>
        //                 )}
        //                 <div className="text-xs text-neutral-400 mt-1">
        //                 {new Date(e.event_date).toLocaleString()}
        //                 </div>
        //                 <div className="mt-3 flex items-center gap-2">
        //                 {isFollowing(e.organizer_id!) ? (
        //                     <button
        //                     onClick={() => onUnfollow(e.organizer_id!)}
        //                     className="text-xs rounded-md border border-white/15 px-3 py-1 hover:bg-white/5"
        //                     >
        //                     Unfollow organizer
        //                     </button>
        //                 ) : (
        //                     <button
        //                     onClick={() => onFollow(e.organizer_id!)}
        //                     className="text-xs rounded-md border border-white/15 px-3 py-1 hover:bg-white/5"
        //                     >
        //                     Follow organizer
        //                     </button>
        //                 )}
        //                 </div>
        //             </li>
        //             ))}
        //         </ul>
        //         )}
        //     </section>
        // </div>
    );
}