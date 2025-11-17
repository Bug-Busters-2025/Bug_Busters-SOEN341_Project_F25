import { NavLink } from "react-router";
import { BarChart3, Calendar, Ticket, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

export default function DashboardSidemenu() {
  const { role } = useRole();

  const organizerNavItems = [
    { to: "./organizer-events", icon: Calendar, label: "My Events" },
    { to: "./analytics", icon: BarChart3, label: "Analytics" },
    { to: "./notifications", icon: Bell, label: "Notifications" },
  ];

  const studentNavItems = [
    { to: "./my-tickets", icon: Ticket, label: "My Tickets", end: true },
  ];

  const adminNavItems = [
    { to: "./admin", icon: Users, label: "Manage Users" },
    { to: "./admin-events", icon: Calendar, label: "Manage Events" },
    { to: "./analytics", icon: BarChart3, label: "Analytics" },
  ];

  const effectiveRole = role ?? "student"; // <- default so My Tickets shows
  const navItems =
    effectiveRole === "student"
      ? studentNavItems
      : effectiveRole === "admin"
      ? adminNavItems
      : organizerNavItems;

  const panelConfig = {
    student: { title: "Student Dashboard", description: "Manage your tickets" },
    organizer: {
      title: "Organizer Dashboard",
      description: "Manage your events and analytics",
    },
    admin: {
      title: "Admin Dashboard",
      description: "Manage users, events and analytics",
    },
  };
  const currentPanel =
    panelConfig[(effectiveRole as keyof typeof panelConfig) || "student"];

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
