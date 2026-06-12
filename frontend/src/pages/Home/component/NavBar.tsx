import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  ClipboardList,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { useUiContext } from "../../../hooks/useUiContext";
import { useGetMe } from "../../../hooks/useAuth";
import type { notificationType } from "../../../types/notification.types";
import {
  useGetNotRepliedNotifications,
  useReplyNotification,
} from "../../../hooks/useNotification";
import { NotificationPopup } from "./NotificationPopup";
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { menuIsOpen, setMenuIsOpen } = useUiContext();
  const { data: user } = useGetMe();
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: newNotifications = [] } = useGetNotRepliedNotifications();
  const { mutate: reply, isPending } = useReplyNotification();

  const hasNew = newNotifications.length > 0;
  const isOwner = user?.role === "Owner";

  // focus input when mobile search expands
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = () => {
    if (!searchVal.trim()) return;
    navigate(`/home/browse?q=${encodeURIComponent(searchVal.trim())}`);
    setSearchOpen(false);
  };

  const handleAccept = (n: notificationType) => {
    reply({
      toId: n.senderId._id,
      messageId: n._id,
      type: "ACCEPT_VISIT_REQUEST",
    });
  };

  const handleReject = (n: notificationType) => {
    reply({
      toId: n.senderId._id,
      messageId: n._id,
      type: "REJECT_VISIT_REQUEST",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0F1C] border-b border-white/5 flex items-center px-4 gap-3">
      {/* ── Mobile full-width search overlay ── */}
      {searchOpen && (
        <div className="absolute inset-0 bg-[#0A0F1C] flex items-center px-4 gap-2 z-10 md:hidden">
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false);
              setSearchVal("");
            }}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition shrink-0"
          >
            <ArrowLeft size={17} />
          </button>
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
            <input
              ref={searchInputRef}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search city, locality, property..."
              className="w-full rounded-xl bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={!searchVal.trim()}
            className="rounded-xl bg-orange-500 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50 shrink-0"
          >
            Go
          </button>
        </div>
      )}

      {/* Hamburger */}
      <button
        type="button"
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

      {/* Desktop search — always visible on md+ */}
      <div className="flex-1 max-w-md mx-auto relative hidden md:block">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search city, locality, property..."
          className="w-full rounded-xl bg-white/5 border border-white/8 pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition"
        />
        {searchVal && (
          <button
            onClick={() => setSearchVal("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Mobile search icon — opens overlay */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition md:hidden"
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        {/* Bell */}
        <div ref={bellRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((p) => !p)}
            className="relative h-9 w-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white transition"
          >
            <Bell size={17} />
            {hasNew && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-[#0A0F1C]" />
            )}
          </button>
          {notifOpen && (
            <NotificationPopup
              notifications={newNotifications}
              onClose={() => setNotifOpen(false)}
              onAccept={handleAccept}
              onReject={handleReject}
              isPending={isPending}
            />
          )}
        </div>

        {/* Owner actions */}
        {isOwner ? (
          <>
            {/* Dashboard toggle */}
            <button
              type="button"
              onClick={() => navigate("/home")}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-medium transition ${
                location.pathname === "/home"
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                  : "border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard size={14} />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/home/create/room")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition"
            >
              <Plus size={14} /> Add Room
            </button>
            <button
              type="button"
              onClick={() => navigate("/home/create/Property")}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-orange-400 shadow-md shadow-orange-500/20 transition active:scale-95"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Property</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => navigate("/home/survey")}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-[13px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition"
            >
              <ClipboardList size={14} />
              <span className="hidden md:inline">Suggestions</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/home/browse")}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-orange-400 shadow-md shadow-orange-500/20 transition active:scale-95"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Find Room</span>
            </button>
          </>
        )}

        {/* Avatar */}
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.role}
            onClick={() => navigate("/home/profile")}
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-white/10 cursor-pointer hover:ring-orange-500/50 transition"
          />
        ) : (
          <div
            onClick={() => navigate("/home/profile")}
            className="h-9 w-9 rounded-xl bg-zinc-700 flex items-center justify-center text-[13px] font-bold text-white ring-2 ring-white/10 cursor-pointer hover:ring-orange-500/50 transition"
          >
            {user?.role?.[0] ?? "U"}
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
