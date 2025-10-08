import { Link } from "react-router";

export default function NotFound() {
   return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
         <h1 className="text-3xl font-bold text-red-500">
            404 <span className="text-black">- Page Not Found</span>
         </h1>
         <p>The page you are looking for does not exist.</p>
         <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
         >
            Go to home page
         </Link>
      </div>
   );
}
