import { useGetRoomMatePreference } from "../../hooks/useUserPropertyPriortiy";
import { CardSkeleton } from "./CardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { RoommateCard } from "./RoommateCard";

const RoomMates = () => {
    const { data, isLoading, isError } = useGetRoomMatePreference();

    const users = Array.isArray(data) ? data : data ? [data] : [];


    const greatMatches = users.filter((u) => (u.matchScore ?? 0) >= 0.8);
    const goodMatches = users.filter((u) => (u.matchScore ?? 0) >= 0.6 && (u.matchScore ?? 0) < 0.8);
    const otherMatches = users.filter((u) => (u.matchScore ?? 0) < 0.6);

    return (
        <div className="flex flex-col gap-8 pb-10">


            <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
                    Roommate Matching
                </p>
                <h1 className="text-[22px] font-bold text-white">Find Your Roommate</h1>
                <p className="text-[13px] text-zinc-500 mt-1">
                    Matched based on your lifestyle, budget, and preferences.
                </p>
            </div>


            {!isLoading && !isError && users.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Total Matches", value: users.length, color: "text-white" },
                        { label: "Great Matches", value: greatMatches.length, color: "text-green-400" },
                        { label: "Good Matches", value: goodMatches.length, color: "text-orange-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-2xl border border-white/5 bg-white/3 px-3 py-3 text-center">
                            <p className={`text-[20px] font-bold ${color}`}>{value}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            )}


            {isLoading && (
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
            )}


            {isError && <ErrorState />}


            {!isLoading && !isError && users.length === 0 && <EmptyState />}


            {!isLoading && !isError && users.length > 0 && (
                <div className="flex flex-col gap-8">
                    {greatMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-[14px] font-bold text-white">🔥 Great Matches</h2>
                                <span className="rounded-full bg-green-500/15 border border-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                                    {greatMatches.length}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {greatMatches.map((u) => <RoommateCard key={u._id} user={u} />)}
                            </div>
                        </section>
                    )}

                    {goodMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-[14px] font-bold text-white">✨ Good Matches</h2>
                                <span className="rounded-full bg-orange-500/15 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
                                    {goodMatches.length}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {goodMatches.map((u) => <RoommateCard key={u._id} user={u} />)}
                            </div>
                        </section>
                    )}

                    {otherMatches.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-[14px] font-bold text-white">👥 Other Matches</h2>
                                <span className="rounded-full bg-zinc-700/40 border border-white/8 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                                    {otherMatches.length}
                                </span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <div className="flex flex-col gap-3">
                                {otherMatches.map((u) => <RoommateCard key={u._id} user={u} />)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
};

export default RoomMates;