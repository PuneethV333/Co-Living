import { useState } from "react";
import { Search, Bell, Plus, Menu, X } from "lucide-react";
import { useUiContext } from "../../../hooks/useUiContext";
import { useGetMe } from "../../../hooks/useAuth";

const NavBar = () => {
  const { menuIsOpen, setMenuIsOpen } = useUiContext();
  const { data: user } = useGetMe();
  const [searchVal, setSearchVal] = useState("");
  const [hasNotif] = useState(true);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0F1C] border-b border-white/5 flex items-center px-4 gap-3">
      {/* Hamburger */}
      <button
        onClick={() => setMenuIsOpen((p) => !p)}
        className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0"
        aria-label="Toggle menu"
      >
        {menuIsOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <span className="text-sm font-bold text-white">C</span>
        </div>
        <span className="hidden sm:block text-[15px] font-semibold text-white tracking-tight">
          Co-Living
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search city, locality, property..."
          className="w-full rounded-xl bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Notification bell */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition">
          <Bell size={17} />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#0A0F1C]" />
          )}
        </button>

        {/* List Property — hidden on mobile */}
        <button className="hidden md:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition">
          List Property
        </button>

        {/* Find Room CTA */}
        <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-orange-400 shadow-md shadow-orange-500/20 transition active:scale-95">
          <Plus size={14} />
          <span className="hidden sm:inline">Find Room</span>
        </button>

        {/* Avatar */}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.role}
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white/10"
          />
        ) : (
          <div className="h-9 w-9 rounded-xl bg-zinc-700 flex items-center justify-center text-[13px] font-bold text-white ring-2 ring-white/10">
            {user?.role?.[0] ?? "U"}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;