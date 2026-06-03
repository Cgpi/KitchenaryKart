import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Settings, LogOut, ChevronRight, User, Menu, X } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUser(JSON.parse(localStorage.getItem("user")) || null);
    sync();
    window.addEventListener("userUpdated", sync);
    return () => window.removeEventListener("userUpdated", sync);
  }, []);

  const logout = () => { localStorage.clear(); window.dispatchEvent(new Event("userUpdated")); navigate("/"); };

  const navItems = [
    { label: "Account", path: "/profile/accountsetting", icon: Settings },
    { label: "My Orders", path: "/profile/myorder", icon: ShoppingBag },
  ];

  const initials = user?.username
    ? user.username.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isActive = (path) => location.pathname === path;

  /* ── Shared nav item ── */
  const NavItem = ({ label, path, icon: Icon, onNav }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => { navigate(path); onNav?.(); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
          ${active ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
      >
        <Icon size={15} className={active ? "text-gray-900" : "text-gray-400"} />
        <span className="flex-1 text-left">{label}</span>
        {active && <ChevronRight size={13} className="text-gray-400" />}
      </button>
    );
  };

 /* ── DESKTOP SIDEBAR ── */
const Sidebar = () => (
  <aside className="hidden md:flex flex-col flex-shrink-0 w-56 h-screen bg-white border-r border-gray-100 sticky top-0">
    
    {/* User block */}
    <div className="px-4 pt-8 pb-6 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 select-none"
          style={{ background: "linear-gradient(135deg, #7f1d1d, #b91c1c)" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate leading-tight">
            {user?.username || "Guest"}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.email || ""}
          </p>
        </div>
      </div>
    </div>

    {/* Nav + Logout together */}
    <nav className="px-3 py-4 space-y-0.5">
      <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">
        Menu
      </p>

      {navItems.map((item) => (
        <NavItem key={item.path} {...item} />
      ))}

      {/* Divider */}
      <div className="h-px bg-gray-100 my-3" />

      {/* Logout directly below menu */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
      >
        <LogOut size={15} />
        Sign Out
      </button>
    </nav>

  </aside>
);

  /* ── MOBILE TOP BAR ── */
  const MobileBar = () => (
    <div className="md:hidden w-full bg-white border-b border-gray-100 flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold select-none"
            style={{ background: "linear-gradient(135deg, #7f1d1d, #b91c1c)" }}>
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{user?.username || "Guest"}</p>
          </div>
        </div>
        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Mobile nav tabs */}
      <div className="flex px-4 pb-3 gap-1">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = isActive(path);
          return (
            <button key={path} onClick={() => navigate(path)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all
                ${active ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"}`}>
              <Icon size={13} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Drawer overlay */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold select-none"
                  style={{ background: "linear-gradient(135deg, #7f1d1d, #b91c1c)" }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.username || "Guest"}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}
                className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">Menu</p>
              {navItems.map((item) => (
                <NavItem key={item.path} {...item} onNav={() => setMobileOpen(false)} />
              ))}
            </nav>

            {/* Drawer logout */}
            <div className="px-3 pb-8 border-t border-gray-100 pt-3">
              <button
                onClick={() => { setMobileOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <Sidebar />
      <MobileBar />
    </>
  );
};

export default ProfilePage;
