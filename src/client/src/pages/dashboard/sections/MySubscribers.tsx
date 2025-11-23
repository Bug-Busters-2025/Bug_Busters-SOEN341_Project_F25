import {
  useEffect,
  useState,
} from "react";
import { useUserId } from "@/hooks/useUserId"; // <- wherever you put it
import {
  getOrganizerFollowers,
  removeOrganizerSubscriber
} from "@/utils/asyncOrganizerSubscription";
import type {
  UserSummary,
  FollowersListResponse,
} from "@/types/subscription";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MySubscribers() {
  const { userId, loading: userLoading } = useUserId();
  const [followers, setFollowers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (userLoading) return;

    if (!userId) {
      setLoading(false);
      setError("Unable to determine organizer id");
      return;
    }

    let cancelled = false;

    const loadFollowers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res: FollowersListResponse = await getOrganizerFollowers(userId);
        if (cancelled) return;

        setFollowers(res.followers);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load subscribers");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFollowers();

    return () => {
      cancelled = true;
    };
  }, [userId, userLoading]);

  const handleRemoveFollower = async (followerId: number) => {
    if (!userId) return;
    try {
      setRemovingId(followerId);
      setError(null);

      await removeOrganizerSubscriber(userId, followerId);

      setFollowers((prev) => prev.filter((f) => f.user_id !== followerId));
    } catch (e: any) {
      setError(e?.message ?? "Failed to remove subscriber");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading || userLoading) {
    return (
      <div id="dsh-my-subscribers">
        Loading subscribers…
      </div>
    );
  }

  return (
    <div
      id="dsh-my-subscribers"
      className="p-6 lg:p-8 max-w-4xl mx-auto space-y-4"
    >
      <h1 className="text-xl font-semibold">My Subscribers</h1>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
      <div className="rounded-xl border bg-card/40 shadow-sm overflow-hidden">
        <div className="max-h-[420px] min-h-[260px] overflow-y-auto">
          <Table>
            <TableCaption>
              {followers.length === 0
                ? "You currently have no subscribers."
                : `${followers.length} subscriber${followers.length > 1 ? "s" : ""}`}
            </TableCaption>
            <TableHeader>
              <TableRow className="h-12">
                <TableHead className="w-[220px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="whitespace-nowrap">
                  Following Since
                </TableHead>
                <TableHead className="w-[80px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followers.map((follower) => (
                <TableRow key={follower.user_id} className="h-12">
                  <TableCell className="font-medium align-middle">
                    {follower.name}
                  </TableCell>
                  <TableCell className="align-middle">
                    {follower.email}
                  </TableCell>
                  <TableCell className="align-middle">
                    {"followed_at" in follower && follower.followed_at
                      ? new Date(follower.followed_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right align-middle">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove subscriber"
                      disabled={removingId === follower.user_id}
                      onClick={() => handleRemoveFollower(follower.user_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {followers.length === 0 && (
                <TableRow className="h-24">
                  <TableCell
                    colSpan={4}
                    className="text-center text-sm text-muted-foreground align-middle"
                  >
                    No subscribers to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}