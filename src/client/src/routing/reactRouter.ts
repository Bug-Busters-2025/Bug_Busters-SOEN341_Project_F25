import { createBrowserRouter } from "react-router";

import RootLayout from "./RootLayout";

const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            { index: true, Component: null }, // set to null for now, but should be replaced by the Home page component
            {
                path: "dashboard",
                Component: null, // set to null for now, but should be replaced by the Dashboard page component
                children: [] // where the different Dashboard tabs will be
            },
            { path: "/search", Component: null} // set to null for now, but should be replaced by the Search page component
        ],
    },
]);

export default router;