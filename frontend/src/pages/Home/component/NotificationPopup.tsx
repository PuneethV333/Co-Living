import { useEffect, useRef } from "react";
import type { notificationsType, notificationType } from "../../../types/notification.types";
import { Bell, X } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

export const NotificationPopup = ({
  notifications,
  onClose,
  onAccept,
  onReject,
  isPending
}: {
  notifications: notificationsType;
  onClose: () => void;
  onAccept: (n: notificationType) => void;
  onReject: (n: notificationType) => void;
  isPending:boolean;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute top-[calc(100%+8px)] right-0 w-85 max-w-[calc(100vw-2rem)]
                 rounded-2xl border border-white/8 bg-[#0D1220] shadow-2xl shadow-black/60
                 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-orange-400" />
          <span className="text-[14px] font-bold text-white">Notifications</span>
          {notifications.length > 0 && (
            <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="h-6 w-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition"
        >
          <X size={13} />
        </button>
      </div>

      
      <div className="max-h-105 overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Bell size={20} className="text-zinc-600" />
            </div>
            <p className="text-[13px] font-semibold text-zinc-500">All caught up!</p>
            <p className="text-[11px] text-zinc-700">No new notifications</p>
          </div>
        ) : (
          notifications.map((n, i) => (
            <NotificationItem
              key={i}
              n={n}
              onAccept={() => onAccept(n)}
              onReject={() => onReject(n)}
              isPending = {isPending}
            />
          ))
        )}
      </div>

      
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/5 flex justify-center">
          <button className="text-[12px] font-medium text-orange-400 hover:text-orange-300 transition">
            View all notifications →
          </button>
        </div>
      )}
    </div>
  );
};