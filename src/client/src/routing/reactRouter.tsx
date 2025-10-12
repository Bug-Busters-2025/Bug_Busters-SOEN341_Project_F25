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

const authAppearance = {
  baseTheme: dark, // remove this line if we don't want dark or modify if we want varied box color depending on UI's light/dark theme
  variables: {
    colorPrimary: "#f97316",           // optional: brand accent
    colorBackground: "hsl(240 10% 6%)" // optional: darker page bg
  },
  elements: {
    rootBox: "w-full",
    card: "shadow-xl"
  }
} as const;

const router = createBrowserRouter([
<<<<<<< HEAD
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
=======
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
        children: [{ index: true, Component: Overview }],
      },
      { id: "search", path: "search", Component: Search },
      { id: "calendar", path: "calendar", Component: Calendar },

      // centered + themed clerk routes
      {
        path: "sign-in/*",
        element: (
          <AuthCentered>
            <SignIn routing="path" path="/sign-in" appearance={authAppearance} />
          </AuthCentered>
        ),
      },
      {
        path: "sign-up/*",
        element: (
          <AuthCentered>
            <SignUp routing="path" path="/sign-up" appearance={authAppearance} />
          </AuthCentered>
        ),
      },

      { id: "not-found", path: "*", Component: NotFound },
    ],
  },
>>>>>>> 62b1c5b40548bdca291b75d5bee04142b3b54da4
]);

export default router;
