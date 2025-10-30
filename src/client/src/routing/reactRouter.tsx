import { createBrowserRouter } from "react-router";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import AuthCentered from "@/components/AuthCentered";

import RootLayout from "@/routing/RootLayout";
import NotFound from "@/pages/NotFound";
import Search from "@/pages/Search";
import Calendar from "@/pages/Calendar";
import ErrorBoundary from "@/pages/ErrorBoundary";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardRedirect from "@/pages/dashboard/DashboardRedirect";
import OrganizerAnalytics from "@/pages/dashboard/sections/OrganizerAnalytics";
import OrganizerEvents from "@/pages/dashboard/sections/OrganizerEvents";
import ProtectedRoute from "@/components/protectedRoutes";
import AdminAnalytics from "@/pages/dashboard/sections/AdminAnalytics";
import AdminEvents from "@/pages/dashboard/sections/AdminEvents";
import OrganizerNotifications from "@/pages/dashboard/sections/OrganizerNotifications";
import MyTickets from "@/components/dashboard/users/MyTickets";
import Home from "@/pages/Home";

const authAppearance = {
   baseTheme: dark,
   variables: {
      colorPrimary: "#f97316",
      colorBackground: "hsl(240 10% 6%)",
   },
   elements: {
      rootBox: "w-full",
      card: "shadow-xl",
   },
} as const;

const router = createBrowserRouter([
   {
      id: "root",
      path: "/",
      Component: RootLayout,
      errorElement: <ErrorBoundary />,
      children: [
         { id: "home", index: true, Component: Home },
         {
            id: "dashboard",
            path: "dashboard",
            Component: DashboardLayout,
            children: [
               { index: true, Component: DashboardRedirect },
               {
                  id: "my-tickets",
                  path: "my-tickets",
                  Component: MyTickets,
               },
               {
                  id: "organizer-events",
                  path: "organizer-events",
                  element: (
                     <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                        <OrganizerEvents />
                     </ProtectedRoute>
                  ),
               },
               {
                  id: "analytics",
                  path: "analytics",
                  element: (
                     <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                        <OrganizerAnalytics />
                     </ProtectedRoute>
                  ),
               },
               {
                  id: "admin-analytics",
                  path: "admin-analytics",
                  element: (
                     <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminAnalytics />
                     </ProtectedRoute>
                  ),
               },
               {
                  id: "admin-events",
                  path: "admin-events",
                  element: (
                     <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminEvents />
                     </ProtectedRoute>
                  ),
               },
               {
                  id: "notifications",
                  path: "notifications",
                  element: (
                     <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                        <OrganizerNotifications />
                     </ProtectedRoute>
                  ),
               },
            ],
         },
         {
            id: "search",
            path: "search",
            element: (
               <ProtectedRoute allowedRoles={["student", "organizer", "admin"]}>
                  <Search />
               </ProtectedRoute>
            ),
         },
         {
            id: "calendar",
            path: "calendar",
            element: (
               <ProtectedRoute allowedRoles={["student", "organizer", "admin"]}>
                  <Calendar />
               </ProtectedRoute>
            ),
         },

         {
            path: "sign-in/*",
            element: (
               <AuthCentered>
                  <SignIn
                     routing="path"
                     path="/sign-in"
                     appearance={authAppearance}
                  />
               </AuthCentered>
            ),
         },
         {
            path: "sign-up/*",
            element: (
               <AuthCentered>
                  <SignUp
                     routing="path"
                     path="/sign-up"
                     appearance={authAppearance}
                  />
               </AuthCentered>
            ),
         },

         { id: "not-found", path: "*", Component: NotFound },
      ],
   },
]);

export default router;
