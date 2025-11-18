import axios from "axios";
import type {
    FollowOrganizerResponse,
    FollowingListResponse,
    UnfollowOrganizerResponse,
    FeedResponse
} from "@/types/subscription";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1/subscriptions",
    withCredentials: true,
});

export async function followOrganizer(organizerId: number): Promise<FollowOrganizerResponse> {
    const res = await api.post<FollowOrganizerResponse>(
        `/organizers/${organizerId}/follow`
    );
    return res.data;
}

export async function unfollowOrganizer(organizerId: number): Promise<UnfollowOrganizerResponse> {
    const res = await api.delete<UnfollowOrganizerResponse>(`/organizers/${organizerId}/follow`);

    if (res.status < 200 || res.status >= 300) {
        throw new Error(`Unfollow failed: ${res.status}`);
    }
    return res.data;
}

export async function getFollowing(): Promise<FollowingListResponse> {
    const res = await api.get<FollowingListResponse>("/me/following");
    return res.data;
}

export async function getMyFeed(limit = 50, offset = 0): Promise<FeedResponse> {
    const res = await api.get<FeedResponse>("/me/feed", {params: { limit, offset },});
    return res.data;
}