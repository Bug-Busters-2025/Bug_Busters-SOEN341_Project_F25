import axios from "axios";
import type {
  FollowersListResponse
} from "@/types/subscription";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1/subscriptions",
    withCredentials: true,
});


/**
 * GET /organizers/:organizer_id/followers
 * Load all followers of a given organizer.
 */
export async function getOrganizerFollowers(organizerId: number): Promise<FollowersListResponse> {
  const res = await api.get<FollowersListResponse>(`/organizers/${organizerId}/followers`);
  return res.data;
}

/**
* DELETE /organizers/:organizer_id/subscribers/:user_id
* Remove a specific subscriber from an organizer.
*
* Returns void and throws if the request fails.
* On success, the backend returns 204 No Content.
*/
export async function removeOrganizerSubscriber(organizerId: number, userId: number): Promise<void> {
  const res = await api.delete(`/organizers/${organizerId}/subscribers/${userId}`);

  if (res.status === 204) return;
  if (res.status < 200 || res.status >= 300) {
      throw new Error(`Remove subscriber failed: ${res.status}`);
  }
}