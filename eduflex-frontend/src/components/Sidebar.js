import { Link } from "react-router-dom";
import { FaTachometerAlt, FaCogs, FaUser, FaBook, FaChalkboardTeacher } from "react-icons/fa";

export default function Sidebar() {
  // Update your Sidebar.js menuItems to match your actual routes:
const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "User", path: "/user", icon: <FaUser /> },
  { name: "Courses", path: "/courses", icon: <FaBook /> },
  { name: "Assignments", path: "/assignments", icon: <FaCogs /> }, // Changed from System Setup
  { name: "Grades", path: "/grades", icon: <FaChalkboardTeacher /> }, // Changed from Faculty
];


  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-gradient-to-b from-green-500 to-green-700 text-white flex flex-col p-4 overflow-hidden group hover:w-64 transition-all duration-500 shadow-xl rounded-r-2xl z-50">
      <h1 className="text-2xl font-bold mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        EduFlex
      </h1>
      {menuItems.map((item) => (
        <Link
  key={item.name}
  to={item.path}
  className="mb-4 py-2 px-2 flex items-center rounded hover:bg-green-500 transition-all duration-300 overflow-hidden"
>
  <span className="text-xl transform transition-transform duration-300 group-hover:scale-110">
    {item.icon}
  </span>
  <span className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
    {item.name}
  </span>
</Link>

      ))}
    </div>
  );
}
