"use client";
import { signOut } from "next-auth/react"; 
export default function Dashboard() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' }); 
  };

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white text-lg font-semibold">My Dashboard</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </nav>
      <h1 className="mt-4 text-2xl">Dashboard</h1>
    </>
  );
}
