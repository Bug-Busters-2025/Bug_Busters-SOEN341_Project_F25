import { createBrowserRouter } from "react-router";

import RootLayout from "./RootLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Search from "../pages/Search";
import Calendar from "../pages/Calendar";
import ErrorBoundary from "../pages/ErrorBoundary";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Overview from "../pages/dashboard/sections/Overview";
import OrganizerAnalytics from "../pages/dashboard/sections/OrganizerAnalytics";
import OrganizerEvents from "../pages/dashboard/sections/OrganizerEvents";

const router = createBrowserRouter([
   {
      id: "root",
      path: "/",
      Component: RootLayout,
      errorElement: <ErrorBoundary />,
      children: [
         {
            id: "home",
            index: true,
            Component: Home,
         },
         {
            id: "dashboard",
            path: "dashboard",
            Component: DashboardLayout,
            children: [
               { index: true, Component: Overview },
               { path: "analytics", Component: OrganizerAnalytics },
               { path: "OrganizerEvents", Component: OrganizerEvents },
            ],
         },
         { id: "search", path: "search", Component: Search },
         { id: "not-found", path: "*", Component: NotFound },
         { id: "calendar", path: "calendar", Component: Calendar},
      ],
   },
]);

export default router;
