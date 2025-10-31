import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AnalyticsSection from "@/components/dashboard/organizer/AnalyticsSection";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { toast } from "sonner";

interface UserRow {
   id: number;
   name: string;
   email: string;
   role: "student" | "organizer" | "admin";
   created_at?: string;
}

export default function AdminManageUsers() {
   const { getToken } = useAuth();
   const [users, setUsers] = useState<UserRow[]>([]);
   const [loading, setLoading] = useState(true);
   const [savingId, setSavingId] = useState<number | null>(null);
   const [error, setError] = useState<string | null>(null);

   const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
         const token = await getToken();
         const res = await axios.get("http://localhost:3000/api/v1/users", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
         });
         setUsers(res.data);
      } catch (e: any) {
         setError(e?.response?.data?.message || "Failed to load users");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   const updateRole = async (userId: number, role: "student" | "organizer") => {
      setSavingId(userId);
      setError(null);
      try {
         const token = await getToken();
         await axios.put(
            `http://localhost:3000/api/v1/users/${userId}/role`,
            { role },
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
         );
         setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role } : u))
         );
         toast.success("Role updated", {
            description: `User #${userId} is now ${role}`,
         });
      } catch (e: any) {
         setError(e?.response?.data?.message || "Failed to update role");
         toast.error("Failed to update role");
      } finally {
         setSavingId(null);
      }
   };

   const deleteUser = async (userId: number) => {
      const first = window.confirm(
         "Are you sure you want to delete this user?"
      );
      if (!first) return;
      const second = window.confirm(
         "This action cannot be undone. Confirm delete?"
      );
      if (!second) return;

      setSavingId(userId);
      setError(null);
      try {
         const token = await getToken();
         await axios.delete(`http://localhost:3000/api/v1/users/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
         });
         setUsers((prev) => prev.filter((u) => u.id !== userId));
         toast.success("User deleted");
      } catch (e: any) {
         setError(e?.response?.data?.message || "Failed to delete user");
         toast.error("Failed to delete user");
      } finally {
         setSavingId(null);
      }
   };

   return (
      <div className="h-full w-full flex flex-col p-6 md:p-10 gap-6 bg-gradient-to-br from-background via-muted/20 to-background overflow-auto">
         <AnalyticsSection
            icon={<Users className="w-4 h-4" />}
            title={<span>Manage Users ({users.length})</span>}
            subtitle={
               <span className="text-sm text-muted-foreground">
                  Change roles for non-admin users
               </span>
            }
            sectionId="admin-manage-users"
         >
            {error && (
               <div className="border border-destructive/40 bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm">
                  {error}
               </div>
            )}
            <div className="overflow-x-auto rounded-lg border border-border/60">
               <table className="min-w-full text-sm">
                  <thead className="bg-muted/40 text-muted-foreground">
                     <tr>
                        <th className="text-left px-4 py-3 font-medium">
                           Name
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                           Email
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                           Role
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                           Created
                        </th>
                        <th className="text-left px-4 py-3 font-medium">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr>
                           <td
                              className="px-4 py-6 text-center text-muted-foreground"
                              colSpan={4}
                           >
                              Loading users...
                           </td>
                        </tr>
                     ) : users.length === 0 ? (
                        <tr>
                           <td
                              className="px-4 py-6 text-center text-muted-foreground"
                              colSpan={4}
                           >
                              No users found
                           </td>
                        </tr>
                     ) : (
                        users.map((u) => (
                           <tr key={u.id} className="border-t border-border/60">
                              <td className="px-4 py-3 font-medium">
                                 {u.name}
                              </td>
                              <td className="px-4 py-3">{u.email}</td>
                              <td className="px-4 py-3">
                                 {u.role === "admin" ? (
                                    <span className="text-foreground">
                                       admin
                                    </span>
                                 ) : (
                                    <Select
                                       value={u.role}
                                       onValueChange={(val) =>
                                          updateRole(
                                             u.id,
                                             val as "student" | "organizer"
                                          )
                                       }
                                       disabled={savingId === u.id}
                                    >
                                       <SelectTrigger
                                          size="sm"
                                          className="w-36"
                                       >
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="student">
                                             student
                                          </SelectItem>
                                          <SelectItem value="organizer">
                                             organizer
                                          </SelectItem>
                                       </SelectContent>
                                    </Select>
                                 )}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                 {u.created_at
                                    ? new Date(
                                         u.created_at
                                      ).toLocaleDateString()
                                    : "—"}
                              </td>
                              <td className="px-4 py-3">
                                 {u.role === "admin" ? (
                                    <span className="text-muted-foreground">
                                       —
                                    </span>
                                 ) : (
                                    <Button
                                       variant="destructive"
                                       size="sm"
                                       disabled={savingId === u.id}
                                       onClick={() => deleteUser(u.id)}
                                    >
                                       Delete
                                    </Button>
                                 )}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </AnalyticsSection>
      </div>
   );
}
