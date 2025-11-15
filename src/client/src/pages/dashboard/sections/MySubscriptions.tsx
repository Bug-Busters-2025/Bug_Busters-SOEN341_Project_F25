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

    const followedOrgIds = useMemo(() => new Set(subscriptions.map((o) => o.organizer_id)), [subscriptions]);
    const isFollowing = (orgId: number) => followedOrgIds.has(orgId);

    const onUnfollow = async (orgId: number) => {
        const prev = subscriptions;
        setSubscriptions((list) => list.filter((o) => o.organizer_id !== orgId));
        try {
            await unfollowOrganizer(orgId);
            setSubscriptionEvents((evs) => evs.filter((e) => e.organizer_id !== orgId));
        } catch (e: any) {
            setSubscriptions(prev);
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
            <Outlet context={{ 
                events: subscriptionEvents, 
                organizers: subscriptions, 
                isFollowing: isFollowing, 
                onFollow: onFollow, 
                onUnfollow: onUnfollow }}/> 
        </div>
    );
}