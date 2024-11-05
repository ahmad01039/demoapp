"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from 'react-hot-toast';
import Link from "next/link";
import { navbarRoutes as routes } from "@/constants/navbarRoutes";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="text-white text-lg font-semibold">My Dashboard</div>

      <div className="relative inline-block text-left md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none"
          id="menu-button"
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {routes.map(route => (
                <Link href={route.url} key={route.url}>
                  <span
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                      pathname === route.url ? "font-bold" : ""
                    }`}
                  >
                    {route.name}
                  </span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:flex md:items-center md:space-x-4">
        {routes.map(route => (
          <Link href={route.url} key={route.url}>
            <span
              className={`text-white hover:text-gray-300 transition duration-200 ${
                pathname === route.url ? "font-bold" : ""
              }`}
            >
              {route.name}
            </span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
