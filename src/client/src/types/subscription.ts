import { type Event } from "./event";

export interface UserSummary {
    id: number;
    name: string;
    email: string;
}

export interface OrganizerSummary {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string; // maybe?
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
// 204 No Content on success; otherwise a JSON error.
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