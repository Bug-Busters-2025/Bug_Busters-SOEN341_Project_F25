import { createBrowserRouter } from "react-router";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import AuthCentered from "@/components/AuthCentered";

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
import ProtectedRoute from "@/components/protectedRoutes";
import MyTickets from "@/components/dashboard/users/MyTickets";

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
               { index: true, Component: Overview },
               {
                  id: "analytics",
                  path: "analytics",
                  element: (
                     <ProtectedRoute allowedRoles={["organizer"]}>
                        <OrganizerAnalytics />
                     </ProtectedRoute>
                  ),
               },
               { index: true, path: "overview", Component: OrganizerEvents },
               {
                  id: "my-tickets",
                  path: "my-tickets",
                  element: (
                     //<ProtectedRoute allowedRoles={["students"]}>
                        <MyTickets />
                     //</ProtectedRoute>
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
