import {Outlet} from "react-router";

export default function DashboardLayout() {
  
  return (
    <div className="w-screen h-screen flex flex-row bg-blue-500">
        <main id="dsh-content" className="flex-auto">
          <Outlet/>
        </main>
    </div>
  )
}
