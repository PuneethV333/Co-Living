import { Calendar, Check, Clock, MessageSquare, X } from "lucide-react";
import { useReplyNotification } from "../../hooks/useNotification";
import type { notificationType } from "../../types/notification.types";
import { timeAgo } from "../../utils/timeAgo";

const TYPE_CONFIG: Record<
    notificationType["type"],
    { icon: React.ReactNode; label: string; color: string; bg: string }
> = {
    VISIT_REQUEST: { icon: <Calendar size={13} />, label: "Visit Request", color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/20" },
    MESSAGE: { icon: <MessageSquare size={13} />, label: "Message", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/20" },
    BOOKING_UPDATE: { icon: <Clock size={13} />, label: "Booking Update", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/20" },
    ACCEPT_VISIT_REQUEST: { icon: <Check size={13} />, label: "Visit Accepted", color: "text-green-400", bg: "bg-green-500/15 border-green-500/20" },
    REJECT_VISIT_REQUEST: { icon: <X size={13} />, label: "Visit Rejected", color: "text-red-400", bg: "bg-red-500/15 border-red-500/20" },
};

export const NotifRow = ({ n }: { n: notificationType }) => {
    const { mutate: reply, isPending } = useReplyNotification();
    const cfg = TYPE_CONFIG[n.type];
    const isActionable = n.requiresAction && !n.replied;

    const handleAccept = () =>
        reply({ toId: n.senderId._id, messageId: n._id, type: "ACCEPT_VISIT_REQUEST" });

    const handleReject = () =>
        reply({ toId: n.senderId._id, messageId: n._id, type: "REJECT_VISIT_REQUEST" });

    return (
        <div className={`flex gap-3 px-4 py-4 transition border-b border-white/5 last:border-0
      ${!n.sent ? "bg-orange-500/3" : "hover:bg-white/2"}`}>

            {/* Avatar + type badge */}
            <div className="relative shrink-0">
                <img
                    src={n.senderId.profilePic}
                    alt={n.senderId.name}
                    className="h-11 w-11 rounded-2xl object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            `https://api.dicebear.com/7.x/thumbs/svg?seed=${n.senderId.name}`;
                    }}
                />
                <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center border border-[#0A0F1C] ${cfg.bg.split(" ")[0]}`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-white">{n.senderId.name}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                                {cfg.icon} {cfg.label}
                            </span>
                        </div>
                        <p className="text-[12px] text-zinc-500 mt-0.5">{n.senderId.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {!n.sent && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                        <span className="text-[10px] text-zinc-600">{timeAgo(n.createdAt)}</span>
                    </div>
                </div>

                {/* Action buttons */}
                {isActionable && (
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={handleAccept}
                            disabled={isPending}
                            className="flex items-center gap-1.5 rounded-xl bg-green-500/15 border border-green-500/20 px-3.5 py-2 text-[11px] font-semibold text-green-400 hover:bg-green-500/25 transition active:scale-95 disabled:opacity-50"
                        >
                            {isPending
                                ? <span className="h-3 w-3 rounded-full border-2 border-green-400/30 border-t-green-400 animate-spin" />
                                : <Check size={11} />
                            }
                            Accept
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isPending}
                            className="flex items-center gap-1.5 rounded-xl bg-red-500/15 border border-red-500/20 px-3.5 py-2 text-[11px] font-semibold text-red-400 hover:bg-red-500/25 transition active:scale-95 disabled:opacity-50"
                        >
                            <X size={11} /> Reject
                        </button>
                    </div>
                )}

                {/* Replied state */}
                {n.requiresAction && n.replied && (
                    <p className="text-[11px] text-zinc-600 mt-2 flex items-center gap-1">
                        <Check size={10} className="text-zinc-600" /> Responded
                    </p>
                )}
            </div>
        </div>
    );
};
