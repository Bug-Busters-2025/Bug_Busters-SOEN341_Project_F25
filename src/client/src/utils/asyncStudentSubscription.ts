import type { FollowOrganizerResponse, FollowingListResponse, FeedResponse } from "@/types/subscription";

const api = (path: string, init?: RequestInit) =>
    fetch(`http://localhost:3000/api/v1/subscriptions${path}`, { credentials: "include", ...init });

export async function followOrganizer(organizerId: number): Promise<FollowOrganizerResponse> {
    const res = await api(`/organizers/${organizerId}/follow`, { method: "POST" });
    if (!res.ok) throw new Error(`Follow failed: ${res.status}`);
    return res.json();
}

export async function unfollowOrganizer(organizerId: number): Promise<void> {
    const res = await api(`/organizers/${organizerId}/follow`, { method: "DELETE" });
    if (res.status === 204) return;
    if (!res.ok) throw new Error(`Unfollow failed: ${res.status}`);
}

export async function getFollowing(): Promise<FollowingListResponse> {
    const res = await api("/me/following");
    if (!res.ok) throw new Error(`Fetch following failed: ${res.status}`);
    return res.json();
}

export async function getMyFeed(limit = 50, offset = 0): Promise<FeedResponse> {
    const res = await api(`/me/feed?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error(`Fetch feed failed: ${res.status}`);
    return res.json();
}