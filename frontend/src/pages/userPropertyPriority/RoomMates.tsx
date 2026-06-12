import { useGetRoomMatePreference } from "../../hooks/useUserPropertyPriortiy";
import { CardSkeleton } from "./CardSkeleton";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { RoommateCard } from "./RoommateCard";

const RoomMates = () => {
  const { data, isLoading, isError } = useGetRoomMatePreference();

  const preferences = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
          Roommate Preferences
        </p>

        <h1 className="text-[22px] font-bold text-white">
          Compatible Roommates
        </h1>

        <p className="text-[13px] text-zinc-500 mt-1">
          Explore roommate preferences based on budget, location and lifestyle.
        </p>
      </div>

      {!isLoading && !isError && preferences.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-white/5 bg-white/3 px-3 py-3 text-center">
            <p className="text-[20px] font-bold text-white">
              {preferences.length}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              Preferences Found
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/3 px-3 py-3 text-center">
            <p className="text-[20px] font-bold text-orange-400">
              {preferences.filter((p) => p.roomPreference.privateRoom).length}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Private Room</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/3 px-3 py-3 text-center">
            <p className="text-[20px] font-bold text-green-400">
              {preferences.filter((p) => p.petFriendly).length}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Pet Friendly</p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/3 px-3 py-3 text-center">
            <p className="text-[20px] font-bold text-blue-400">
              {preferences.filter((p) => p.transportNeeds.metroNearby).length}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">Metro Needed</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorState />}

      {!isLoading && !isError && preferences.length === 0 && <EmptyState />}

      {!isLoading && !isError && preferences.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-[14px] font-bold text-white">
              🏠 Roommate Preferences
            </h2>

            <span className="rounded-full bg-orange-500/15 border border-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400">
              {preferences.length}
            </span>

            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="flex flex-col gap-3">
            {preferences.map((p) => (
              <RoommateCard key={p._id} preference={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default RoomMates;
