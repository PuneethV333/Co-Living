import {
  IndianRupee,
  MapPin,
  Home,
  PawPrint,
  Train,
  Car,
  Users,
  Utensils,
} from "lucide-react";
import type { getRoomMatePreferenceType } from "../../types/userPriority.types";


export const RoommateCard = ({
  preference,
}: {
  preference: getRoomMatePreferenceType;
}) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/3 p-4 hover:border-orange-500/20 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-white">
            Preference Match
          </p>

          <p className="text-[11px] text-zinc-500 mt-1">
            User ID: {preference.userId.slice(0, 8)}...
          </p>
        </div>

        <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-300">
          Compatible
        </span>
      </div>

      <div className="h-px bg-white/5 my-4" />

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/3 border border-white/5 p-3">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <IndianRupee size={14} />
            <span className="text-[11px]">Budget</span>
          </div>

          <p className="text-[13px] font-medium text-white">
            ₹{preference.budget.min.toLocaleString()} - ₹
            {preference.budget.max.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl bg-white/3 border border-white/5 p-3">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <Home size={14} />
            <span className="text-[11px]">Property Types</span>
          </div>

          <p className="text-[13px] font-medium text-white capitalize">
            {preference.propertyTypes.join(", ")}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-zinc-400 mb-2">
          <MapPin size={14} />
          <span className="text-[11px]">Preferred Locations</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {preference.preferredLocations.map((loc) => (
            <span
              key={loc}
              className="rounded-full border border-white/8 bg-white/3 px-2 py-1 text-[11px] text-zinc-300"
            >
              {loc}
            </span>
          ))}
        </div>
      </div>

      <div className="h-px bg-white/5 my-4" />

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/5 bg-white/3 p-2">
          <div className="flex items-center gap-2">
            <Users size={13} className="text-orange-400" />
            <span className="text-[11px] text-zinc-400">Room</span>
          </div>

          <p className="mt-1 text-[12px] text-white">
            {preference.roomPreference.privateRoom
              ? "Private"
              : "Shared"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/3 p-2">
          <div className="flex items-center gap-2">
            <Utensils size={13} className="text-orange-400" />
            <span className="text-[11px] text-zinc-400">Food</span>
          </div>

          <p className="mt-1 text-[12px] text-white capitalize">
            {preference.foodPreference}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/3 p-2">
          <div className="flex items-center gap-2">
            <PawPrint size={13} className="text-orange-400" />
            <span className="text-[11px] text-zinc-400">Pets</span>
          </div>

          <p className="mt-1 text-[12px] text-white">
            {preference.petFriendly ? "Allowed" : "Not Allowed"}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/3 p-2">
          <div className="flex items-center gap-2">
            {preference.transportNeeds.metroNearby ? (
              <Train size={13} className="text-orange-400" />
            ) : (
              <Car size={13} className="text-orange-400" />
            )}

            <span className="text-[11px] text-zinc-400">Transport</span>
          </div>

          <p className="mt-1 text-[12px] text-white">
            {preference.transportNeeds.metroNearby
              ? "Metro Needed"
              : preference.transportNeeds.parkingRequired
              ? "Parking Needed"
              : "Flexible"}
          </p>
        </div>
      </div>

      {preference.amenities.length > 0 && (
        <>
          <div className="h-px bg-white/5 my-4" />

          <div>
            <p className="text-[11px] text-zinc-400 mb-2">
              Required Amenities
            </p>

            <div className="flex flex-wrap gap-2">
              {preference.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-1 text-[10px] text-orange-300"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};