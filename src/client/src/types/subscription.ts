import { type Event } from "./event";

export interface UserSummary {
    user_id: number;
    name: string;
    email: string;
}

export interface OrganizerSummary {
    organizer_id: number;
    organizer_name: string;
    organizer_email: string;
}

export interface OrganizerSubscription {
    user_id: number;
    organizer_id: number;
    created_at: string;
}


// --- API response types ---
// POST /organizers/:organizer_id/follow
export interface FollowOrganizerResponse {
    followed: true;
    created: boolean;
}

// DELETE /organizers/:organizer_id/follow
export interface UnfollowOrganizerResponse {
    removed: boolean;
}

// GET /me/following
export interface FollowingListResponse {
    count: number;
    organizers: OrganizerSummary[];
}

// GET /organizers/:organizer_id/followers
export interface FollowersListResponse {
    count: number;
    followers: UserSummary[];
}

// GET /me/feed
export interface FeedResponse {
    count: number;
    limit: number;
    offset: number;
    events: Event[];
}


// Outlet context type
export interface SubscriptionContextType {
    events: Event[];
    organizers: OrganizerSummary[];
    isFollowing: (orgId: number) => boolean;
    onFollow: (orgId: number) => Promise<FollowOrganizerResponse>;
    onUnfollow: (orgId: number) => Promise<UnfollowOrganizerResponse>;
}