import { createBrowserRouter } from "react-router";

import RootLayout from "./RootLayout";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Search from "../pages/Search";
import ErrorBoundary from "../pages/ErrorBoundary";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Overview from "../pages/dashboard/sections/Overview";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

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
            children: [{ index: true, Component: Overview }],
         },
         { path: "login", element: <Login /> },
         {path: "signup", element: <Signup /> },
         { id: "search", path: "search", Component: Search },
         { id: "not-found", path: "*", Component: NotFound },
      ],
   },
]);

export default router;
