import { createBrowserRouter } from "react-router";

import RootLayout from "./RootLayout";

import Home from "../pages/Home";

import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Overview from "../pages/dashboard/sections/Overview";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: Home },
            {
                path: "dashboard",
                Component: DashboardLayout,
                children: [
                    {index: true, Component: Overview}
                ] // where the different Dashboard tabs will be
            },
            { path: "/search", Component: null} // set to null for now, but should be replaced by the Search page component
        ],
    },
]);

export default router;