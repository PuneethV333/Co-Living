import { CheckCircle2, MessageSquare, Phone, Star } from "lucide-react";
import { useGetMe } from "../../hooks/useAuth";
import { useCreateNotification } from "../../hooks/useNotification";
import type { getRoomMatePreferenceType } from "../../types/userPriority.types";
import { OccupationIcon } from "./OccupationIcon";
import { MatchRing } from "./MatchRing";

export const RoommateCard = ({ user }: { user: getRoomMatePreferenceType }) => {
    const { mutate: sendNotification, isPending } = useCreateNotification();
    const { data: me } = useGetMe()

    if (!me) {
        return
    }

    const handleConnect = () => {
        sendNotification({
            senderId: me._id,
            receiverId: user._id,
            type: "MESSAGE",
        });
    };

    const age = user.dob
        ? new Date().getFullYear() - new Date(user.dob as unknown as string).getFullYear()
        : null;

    const pct = Math.round((user.matchScore ?? 0) * 100);
    const matchLabel =
        pct >= 80 ? "Great Match" :
            pct >= 60 ? "Good Match" :
                "Possible Match";
    const matchBadgeColor =
        pct >= 80 ? "bg-green-500/15 border-green-500/20 text-green-400" :
            pct >= 60 ? "bg-orange-500/15 border-orange-500/20 text-orange-400" :
                "bg-zinc-700/30 border-white/8 text-zinc-500";

    return (
        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 hover:border-white/10 transition group">
            <div className="flex gap-3">

                <div className="relative shrink-0">
                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt={user.name}
                            className="h-14 w-14 rounded-2xl object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`;
                            }}
                        />
                    ) : (
                        <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400">
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                    )}
                    {user.verified && (
                        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#0A0F1C] flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-green-400" />
                        </span>
                    )}
                </div>


                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-white truncate">{user.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                {age && <span className="text-[11px] text-zinc-500">{age} yrs</span>}
                                {age && <span className="text-zinc-700">·</span>}
                                <OccupationIcon status={user.tenantProfile ? "student" : undefined} />
                            </div>
                        </div>
                        <MatchRing score={user.matchScore ?? 0} />
                    </div>


                    <span className={`inline-flex items-center gap-1 mt-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${matchBadgeColor}`}>
                        <Star size={9} fill="currentColor" /> {matchLabel}
                    </span>
                </div>
            </div>


            {user.bio && (
                <p className="text-[12px] text-zinc-500 leading-relaxed mt-3 line-clamp-2">{user.bio}</p>
            )}


            <div className="h-px bg-white/5 my-3" />


            <div className="flex items-center gap-2">
                {user.phoneNumber && (
                    <a
                        title="phone number"
                        href={`tel:${user.phoneNumber}`}
                        className="h-8 w-8 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/15 transition shrink-0"
                    >
                        <Phone size={14} />
                    </a>
                )}
                <button
                    onClick={handleConnect}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 py-2 text-[12px] font-semibold text-orange-300 hover:bg-orange-500/20 transition active:scale-95 disabled:opacity-50"
                >
                    {isPending ? (
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-orange-300/30 border-t-orange-300 animate-spin" />
                    ) : (
                        <><MessageSquare size={13} /> Connect</>
                    )}
                </button>
            </div>
        </div>
    );
};