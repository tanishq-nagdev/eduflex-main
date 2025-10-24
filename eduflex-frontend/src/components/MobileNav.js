// src/components/MobileNav.js
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBook, FaCogs, FaUser, FaBars, FaTimes, FaChartLine } from "react-icons/fa";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "User", path: "/user", icon: <FaUser /> },
    { name: "Courses", path: "/courses", icon: <FaBook /> },
    { name: "Assignments", path: "/assignments", icon: <FaCogs /> },
    { name: "Grades", path: "/grades", icon: <FaChartLine /> },
  ];

  return (
    <>
      {/* Mobile Header - Changed to GREEN theme */}
      <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold">EduFlex</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl hover:text-green-200 transition-colors"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-green-500 to-green-700 shadow-lg z-50 transform transition-transform">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <FaTimes className="text-white hover:text-green-200" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-white bg-opacity-20 text-white"
                        : "text-green-100 hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
