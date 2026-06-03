import { Calendar, Check, CheckCircle, Clock, MessageSquare, Phone, X, XCircle } from "lucide-react";
import type { notificationType } from "../../../types/notification.types";
import { timeAgo } from "../../../utils/timeAgo";

const TYPE_CONFIG: Record<
  notificationType["type"],
  { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
  VISIT_REQUEST: {
    icon: <Calendar size={14} />,
    label: "Visit Request",
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },

  MESSAGE: {
    icon: <MessageSquare size={14} />,
    label: "New Message",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },

  BOOKING_UPDATE: {
    icon: <Clock size={14} />,
    label: "Booking Update",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
  },

  ACCEPT_VISIT_REQUEST: {
    icon: <CheckCircle size={14} />,
    label: "Visit Accepted",
    color: "text-green-400",
    bg: "bg-green-500/15",
  },

  REJECT_VISIT_REQUEST: {
    icon: <XCircle size={14} />,
    label: "Visit Rejected",
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
};
export const NotificationItem = ({
  n,
  onAccept,
  onReject,
  isPending,
}: {
  n: notificationType;
  onAccept: () => void;
  onReject: () => void;
  isPending: boolean;
}) => {
  const cfg = TYPE_CONFIG[n.type];
  const isActionable =
    n.type === "VISIT_REQUEST" || n.type === "BOOKING_UPDATE";

  return (
    <div className="flex gap-3 px-4 py-3.5 hover:bg-white/3 transition group border-b border-white/5 last:border-b-0">
      <div className="relative shrink-0">
        <img
          src={n.senderId.profilePic}
          alt={n.senderId.name}
          className="h-10 w-10 rounded-xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://api.dicebear.com/7.x/thumbs/svg?seed=${n.senderId.name}`;
          }}
        />

        <div
          className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ${cfg.bg} border border-[#0A0F1C]`}
        >
          <span className={cfg.color}>{cfg.icon}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">
              {n.senderId.name}
            </p>
            <p className={`text-[11px] font-medium mt-0.5 ${cfg.color}`}>
              {cfg.label}
            </p>
          </div>
          <span className="text-[10px] text-zinc-600 shrink-0 mt-0.5">
            {timeAgo(n.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Phone size={10} className="text-zinc-600" />
          <span className="text-[11px] text-zinc-500">
            {n.senderId.phoneNumber}
          </span>
        </div>

        {isActionable && (
          <div className="flex items-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={onAccept}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-green-500/15 border border-green-500/20 px-3 py-1.5 text-[11px] font-semibold text-green-400 hover:bg-green-500/25 transition active:scale-95"
            >
              <Check size={11} /> Accept
            </button>
            <button
              type="button"
              onClick={onReject}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/15 border border-red-500/20 px-3 py-1.5 text-[11px] font-semibold text-red-400 hover:bg-red-500/25 transition active:scale-95"
            >
              <X size={11} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
