import { NavLink } from "react-router";
import { BarChart3, Calendar, Ticket} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

export default function DashboardSidemenu() {
   const { role, loading } = useRole();

   const organizerNavItems = [
      {
         to: "./organizer-events",
         icon: Calendar,
         label: "My Events",
      },
      {
         to: "./analytics",
         icon: BarChart3,
         label: "Analytics",
      },
      {
         to: "./my-tickets",
         icon: Ticket,
         label: "My Tickets",
      },
   ];

   const studentNavItems = [
      {
         to: "./my-tickets",
         icon: Ticket,
         label: "My Tickets",
         end: true,
      },
   ];

   const navItems = role === "student" ? studentNavItems : organizerNavItems;

   const panelConfig = {
      student: {
         title: "Student Dashboard",
         description: "Manage your tickets",
      },
      organizer: {
         title: "Organizer Dashboard",
         description: "Manage your events and analytics",
      },
      admin: {
         title: "Admin Dashboard",
         description: "Manage your events and analytics",
      },
   };

   const currentPanel =
      (role && panelConfig[role as keyof typeof panelConfig]) ||
      panelConfig.organizer;

   if (loading) {
      return (
         <aside
            id="dsb-sidemenu"
            className="relative h-full w-64 border-r border-border bg-card flex flex-col shadow-sm"
         >
            <div className="px-6 py-5 border-b border-border">
               <div className="h-7 w-3/4 bg-muted rounded animate-pulse" />
               <div className="h-4 w-full bg-muted rounded animate-pulse mt-2" />
            </div>
         </aside>
      );
   }

   return (
      <aside
         id="dsb-sidemenu"
         className="relative h-full sm:min-w-64 border-r border-border bg-card flex flex-col shadow-sm"
      >
         <div className="px-6 py-5 border-b border-border">
            <h2 className="text-xl font-bold text-secondary-foreground">
               {currentPanel.title}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
               {currentPanel.description}
            </p>
         </div>

         <nav className="flex-1 flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
               <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                     cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                           ? "bg-primary text-primary-foreground shadow-md"
                           : "text-muted-foreground hover:bg-muted hover:text-foreground"
                     )
                  }
               >
                  {({ isActive }) => (
                     <>
                        <item.icon
                           className={cn(
                              "h-5 w-5",
                              isActive && "animate-in zoom-in-50 duration-200"
                           )}
                        />
                        <span>{item.label}</span>
                     </>
                  )}
               </NavLink>
            ))}
         </nav>
      </aside>
   );
}
