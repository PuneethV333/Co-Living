import {
  Camera,
  CheckCircle2,
  LogOut,
  Bell,
  Shield,
  SlidersHorizontal,
  Heart,
  BookOpen,
  Star,
  Building2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit3,
  Mail,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import toast from "react-hot-toast";
import { useGetMe } from "../../../hooks/useAuth";
import { Auth } from "../../../config/firebase.config";
import { ProfileSkeleton } from "./ProfileSkeleton";
import type { UserType } from "../../../types/auth.types";
import { StatCard } from "./StatCard";
import { SectionLabel } from "./SectionLabel";
import { MenuItem } from "./MenuItem";
import { useGetSavedProperty } from "../../../hooks/useUser";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetMe();
  const { data: saved } = useGetSavedProperty();

  const handleLogout = async () => {
    try {
      await signOut(Auth);
      navigate("/login", { replace: true });
      toast.success("Logged out");
    } catch {
      toast.error("Failed to log out");
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (!user) return null;

  const isTenant = user.role === "Tenant";
  const isOwner = user.role === "Owner";

  const age = user.dob
    ? new Date().getFullYear() - new Date(user.dob).getFullYear()
    : null;

  const occupationIcon =
    user.tenantProfile?.occupationStatus === "student" ? (
      <GraduationCap size={13} />
    ) : user.tenantProfile?.occupationStatus === "working-professional" ? (
      <Briefcase size={13} />
    ) : (
      <Sparkles size={13} />
    );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="rounded-2xl border border-white/5 bg-white/3 p-5 flex flex-col items-center gap-4 text-center relative">
        <button
          onClick={() => navigate("/home/profile/edit")}
          className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <Edit3 size={14} />
        </button>

        <div className="relative">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.role}
              className="h-24 w-24 rounded-3xl object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="h-24 w-24 rounded-3xl bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400 ring-2 ring-white/10">
              {user.role[0]}
            </div>
          )}
          {user.verified && (
            <span className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-xl bg-[#0A0F1C] border border-white/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-green-400" />
            </span>
          )}
          <button
            onClick={() => navigate("/home/profile/edit")}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            <Camera size={11} className="text-white" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-[20px] font-bold text-white">
              {(user as UserType).email ?? "User"}
            </h1>
            {user.verified && (
              <CheckCircle2 size={15} className="text-green-400" />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold ${
                isOwner
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-300"
              }`}
            >
              {user.role}
            </span>
            {age && (
              <span className="text-[12px] text-zinc-500">{age} years old</span>
            )}
            {isTenant && user.tenantProfile && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                {occupationIcon}
                {user.tenantProfile.occupationStatus?.replace("-", " ")}
              </span>
            )}
            {isOwner && user.ownerProfile && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                <Building2 size={11} />
                {user.ownerProfile.businessName}
              </span>
            )}
          </div>
        </div>

        {(user as UserType).bio && (
          <p className="text-[13px] text-zinc-500 leading-relaxed max-w-xs">
            {(user as UserType).bio}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 flex-wrap w-full">
          {user.email && (
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
              <Mail size={12} className="text-zinc-600" /> {user.email}
            </div>
          )}

          {user.dob && (
            <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
              <Calendar size={12} className="text-zinc-600" />
              {new Date(user.dob).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {isTenant && (
          <>
            <StatCard
              label="Saved"
              value={saved?.length ?? 0}
              icon={<Heart size={16} />}
            />
            <StatCard
              label="Reviews"
              value={saved?.length ?? 0}
              icon={<Star size={16} />}
            />
          </>
        )}
        {isOwner && (
          <>
            <StatCard
              label="Properties"
              value={user.ownerProfile?.propertiesCount ?? 0}
              icon={<Building2 size={16} />}
            />
            <StatCard label="Reviews" value={0} icon={<Star size={16} />} />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel label="Account" />
        <MenuItem
          icon={<Edit3 size={16} />}
          label="Edit Profile"
          sub="Update your name, photo and bio"
          onClick={() => navigate("/home/profile/edit")}
        />
        {isTenant && (
          <MenuItem
            icon={<SlidersHorizontal size={16} />}
            label="Property Preferences"
            sub="Update your roommate & property survey"
            onClick={() => navigate("/home/survey")}
          />
        )}
        {isOwner && (
          <MenuItem
            icon={<Building2 size={16} />}
            label="My Properties"
            sub="Manage your listings"
            onClick={() => navigate("/home/properties")}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel label="Activity" />
        {isTenant && (
          <>
            <MenuItem
              icon={<Heart size={16} />}
              label="Saved Properties"
              sub="Your saved listings"
              onClick={() => navigate("/home/saved")}
            />
            <MenuItem
              icon={<BookOpen size={16} />}
              label="My Bookings"
              sub="View booking history"
              onClick={() => navigate("/home/messages")}
            />
          </>
        )}
        <MenuItem
          icon={<Bell size={16} />}
          label="Notifications"
          sub="Manage your alerts"
          onClick={() => navigate("/home/messages")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel label="Security" />
        <MenuItem
          icon={<Shield size={16} />}
          label="Account Security"
          sub="Verification and privacy settings"
          onClick={() => {}}
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel label="Session" />
        <MenuItem
          icon={<LogOut size={16} />}
          label="Log Out"
          onClick={handleLogout}
          danger
        />
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-zinc-700">Co-Living · v1.0.0</p>
        <p className="text-[10px] text-zinc-800 mt-0.5">
          Member since{" "}
          {new Date(user.createdAt).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default Profile;
