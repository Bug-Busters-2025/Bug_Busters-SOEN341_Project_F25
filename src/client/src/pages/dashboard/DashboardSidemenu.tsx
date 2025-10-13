import { NavLink } from "react-router";
import { BarChart3, Calendar, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSidemenu() {
   const navItems = [
      {
         to: ".",
         icon: Calendar,
         label: "My Events",
         end: true,
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

   return (
      <aside
         id="dsb-sidemenu"
         className="relative h-full w-64 border-r border-border bg-card flex flex-col shadow-sm"
      >
         <div className="px-6 py-5 border-b border-border">
            <h2 className="text-xl font-bold text-secondary-foreground">
               Organizer Panel
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
               Manage your events and analytics
            </p>
         </div>

         <nav className="flex-1 flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
               <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
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
