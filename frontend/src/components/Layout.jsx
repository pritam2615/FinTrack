import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  LogOut,
  Home,
  List,
  PieChart,
  DollarSign,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";

export default function Layout({ children }) {
  const { user, setUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/", icon: <Home size={20} /> },
    { label: "Transactions", path: "/transactions", icon: <List size={20} /> },
    { label: "Summary", path: "/summary", icon: <PieChart size={20} /> },
    { label: "Budgets", path: "/all", icon: <DollarSign size={20} /> },
    { label: "Profile", path: "/profile", icon: <User size={20} /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 inset-y-0 left-0 dark:bg-gray-900 text-white h-full transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-indigo-600">
          <Link to="/" className="text-2xl font-bold text-white">
            {!isCollapsed && "FinTrack"}
          </Link>
          <button
            className="hidden md:block text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          {navLinks.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 p-3 mx-2 rounded-md transition-all duration-200 relative group ${
                  isActive ? "bg-indigo-600" : "hover:bg-indigo-600"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 bg-white transition-all duration-300 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                />
                {icon}
                {!isCollapsed && <span>{label}</span>}
              </Link>
            );
          })}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 mx-2 mt-6 bg-red-500 hover:bg-red-600 rounded-md transition"
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full">
        {/* Topbar */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-indigo-700 md:hidden"
            >
              <Menu size={28} />
            </button>
            <Link
              to="/"
              className="text-xl font-bold text-indigo-700 hover:opacity-80 transition"
            >
              FinTrack
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:underline"
            >
              <User size={28} className="text-indigo-700" />
              {user ? (
                <span className="hidden sm:block font-medium text-gray-700">
                  Welcome, {user.userName || "User"}
                </span>
              ) : (
                <span className="hidden sm:block font-medium text-gray-700">
                  Not logged in
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto h-full bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
