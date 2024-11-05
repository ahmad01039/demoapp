"use client";
import { usePathname } from "next/navigation"; 
import { signOut } from "next-auth/react"; 
import { toast } from 'react-hot-toast';
import Link from "next/link"; 

const Navbar: React.FC = () => {
  const pathname = usePathname(); 
  const routes = [
    { name: "Dashboard", url: "/dashboard" },
    { name: "Products", url: "/products" },
  ];
  const shouldDisplayNavbar = routes.some(route => pathname === route.url);
  if (!shouldDisplayNavbar) return null;

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-lg font-semibold">My Dashboard</div>
      <ul className="flex space-x-4">
        {routes.map(route => (
          <li key={route.url}>
            <Link href={route.url}>
              <span 
                className={`text-white hover:text-gray-300 transition duration-200 ${
                  pathname === route.url ? "font-bold" : ""
                }`}
              >
                {route.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
