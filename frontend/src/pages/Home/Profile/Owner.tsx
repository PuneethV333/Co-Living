import { useState } from "react";
import {
  Building2,
  Users,
  Clock,
  TrendingUp,
  Plus,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMe } from "../../../hooks/useAuth";
import { useGetMyProperties } from "../../../hooks/useProperty";
import {
  useGetAllNotifications,
  useReplyNotification,
} from "../../../hooks/useNotification";
import type { UserType } from "../../../types/auth.types";
import type { notificationType } from "../../../types/notification.types";
import { greeting } from "../../../utils/greeting";
import { StatCard2 } from "./StatCard2";
import { FilterChip } from "./FilterChip";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { OwnerPropertyCard } from "./OwnerPropertyCard";
import { RevenueChart } from "./RevenueChart";

type PropFilter = "all" | "active" | "inactive" | "verified" | "pending";
type BookingFilter = "all" | "pending" | "approved" | "rejected";

const RealBookingRow = ({ n }: { n: notificationType }) => {
  const { mutate: reply, isPending } = useReplyNotification();

  const isVisitRequest = n.type === "VISIT_REQUEST";
  const isAccepted = n.type === "ACCEPT_VISIT_REQUEST";
  const isRejected = n.type === "REJECT_VISIT_REQUEST";

  const status = isAccepted ? "approved" : isRejected ? "rejected" : "pending";

  const statusCfg = {
    pending: {
      label: "Pending",
      cls: "bg-yellow-500/15 border-yellow-500/20 text-yellow-400",
    },
    approved: {
      label: "Approved",
      cls: "bg-green-500/15 border-green-500/20 text-green-400",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-red-500/15 border-red-500/20 text-red-400",
    },
  }[status];

  const initials = n.senderId.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const COLORS = [
    "bg-blue-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-orange-600",
    "bg-pink-600",
  ];
  const colorIdx = n.senderId.name.charCodeAt(0) % COLORS.length;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/2 transition">
      <div className="shrink-0">
        {n.senderId.profilePic ? (
          <img
            src={n.senderId.profilePic}
            alt={n.senderId.name}
            className="h-9 w-9 rounded-xl object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://api.dicebear.com/7.x/thumbs/svg?seed=${n.senderId.name}`;
            }}
          />
        ) : (
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center text-[12px] font-bold text-white ${COLORS[colorIdx]}`}
          >
            {initials}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white truncate">
          {n.senderId.name}
        </p>
        <p className="text-[11px] text-zinc-600 truncate">
          {n.senderId.phoneNumber}
        </p>
      </div>

      <div className="hidden sm:block text-right min-w-0">
        <p className="text-[12px] font-medium text-zinc-300 capitalize">
          {n.type.replace(/_/g, " ").toLowerCase()}
        </p>
        <p className="text-[11px] text-zinc-600">
          {new Date(n.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shrink-0 ${statusCfg.cls}`}
      >
        {statusCfg.label}
      </span>

      {isVisitRequest && !n.replied && (
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() =>
              reply({
                toId: n.senderId._id,
                messageId: n._id,
                type: "ACCEPT_VISIT_REQUEST",
              })
            }
            disabled={isPending}
            className="rounded-lg bg-green-500/15 border border-green-500/20 px-2.5 py-1 text-[10px] font-bold text-green-400 hover:bg-green-500/25 transition disabled:opacity-50"
          >
            Accept
          </button>
          <button
            onClick={() =>
              reply({
                toId: n.senderId._id,
                messageId: n._id,
                type: "REJECT_VISIT_REQUEST",
              })
            }
            disabled={isPending}
            className="rounded-lg bg-red-500/15 border border-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-400 hover:bg-red-500/25 transition disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

const Owner = () => {
  const navigate = useNavigate();
  const { data: me } = useGetMe();
  const { data: properties = [], isLoading } = useGetMyProperties();
  const { data: allNotifications = [], isLoading: notifsLoading } =
    useGetAllNotifications();

  const [propFilter, setPropFilter] = useState<PropFilter>("all");
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("all");

  const ownerName =
    (me as UserType & { name?: string })?.name?.split(" ")[0] ?? "Owner";

  const totalTenants = properties.reduce((s, p) => s + p.totalBedRooms, 0);
  const monthlyRev = properties.reduce((s, p) => s + p.cost, 0);

  const visitNotifs = allNotifications.filter((n) =>
    ["VISIT_REQUEST", "ACCEPT_VISIT_REQUEST", "REJECT_VISIT_REQUEST"].includes(
      n.type,
    ),
  );
  const pendingCount = visitNotifs.filter(
    (n) => n.type === "VISIT_REQUEST" && !n.replied,
  ).length;

  const filteredBookings = visitNotifs.filter((n) => {
    if (bookingFilter === "all") return true;
    if (bookingFilter === "pending")
      return n.type === "VISIT_REQUEST" && !n.replied;
    if (bookingFilter === "approved") return n.type === "ACCEPT_VISIT_REQUEST";
    if (bookingFilter === "rejected") return n.type === "REJECT_VISIT_REQUEST";
    return true;
  });

  const filteredProps = properties.filter((p) => {
    if (propFilter === "active") return p.isActive;
    if (propFilter === "inactive") return !p.isActive;
    if (propFilter === "verified") return p.verified;
    if (propFilter === "pending") return !p.verified;
    return true;
  });

  const formatRev = (v: number) =>
    v >= 100000
      ? `₹${(v / 100000).toFixed(1)}L`
      : v > 0
        ? `₹${(v / 1000).toFixed(0)}K`
        : "₹0";

  const PROP_FILTERS: { id: PropFilter; label: string }[] = [
    { id: "all", label: `All (${properties.length})` },
    {
      id: "active",
      label: `Active (${properties.filter((p) => p.isActive).length})`,
    },
    {
      id: "inactive",
      label: `Inactive (${properties.filter((p) => !p.isActive).length})`,
    },
    {
      id: "verified",
      label: `Verified (${properties.filter((p) => p.verified).length})`,
    },
    {
      id: "pending",
      label: `Pending (${properties.filter((p) => !p.verified).length})`,
    },
  ];

  const BOOKING_FILTERS: { id: BookingFilter; label: string }[] = [
    { id: "all", label: `All (${visitNotifs.length})` },
    {
      id: "pending",
      label: `Pending (${visitNotifs.filter((n) => n.type === "VISIT_REQUEST" && !n.replied).length})`,
    },
    {
      id: "approved",
      label: `Approved (${visitNotifs.filter((n) => n.type === "ACCEPT_VISIT_REQUEST").length})`,
    },
    {
      id: "rejected",
      label: `Rejected (${visitNotifs.filter((n) => n.type === "REJECT_VISIT_REQUEST").length})`,
    },
  ];

  const revenueMonths = [
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
  ];
  const baseRev = monthlyRev > 0 ? monthlyRev : 100000;
  const revenueValues = [65, 72, 58, 80, 75, 85, 90, 100].map((pct) =>
    Math.round((pct / 100) * baseRev),
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="pt-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
          Owner Dashboard
        </p>
        <h1 className="text-[24px] font-bold text-white">
          {greeting()}, {ownerName} 👋
        </h1>
        <p className="text-[13px] text-zinc-500 mt-1">
          Here's what's happening across your properties today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard2
          icon={<Building2 size={22} className="text-zinc-400" />}
          label="Total Properties"
          value={String(properties.length)}
          sub={`↑ ${properties.filter((p) => p.isActive).length} active`}
          subColor="text-green-400"
        />
        <StatCard2
          icon={<Users size={22} className="text-blue-400" />}
          label="Active Tenants"
          value={String(totalTenants)}
          sub={
            totalTenants > 0
              ? `${properties.filter((p) => p.isActive).length} active properties`
              : "No tenants yet"
          }
          subColor="text-blue-400"
        />
        <StatCard2
          icon={<Clock size={22} className="text-yellow-400" />}
          label="Pending Requests"
          value={String(pendingCount)}
          sub={pendingCount > 0 ? "• Needs review" : "• All clear"}
          subColor={pendingCount > 0 ? "text-yellow-400" : "text-green-400"}
        />
        <StatCard2
          icon={<TrendingUp size={22} className="text-green-400" />}
          label="Monthly Revenue"
          value={formatRev(monthlyRev)}
          sub={
            monthlyRev > 0
              ? `From ${properties.length} propert${properties.length === 1 ? "y" : "ies"}`
              : "No revenue yet"
          }
          subColor="text-green-400"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">My Properties</h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Manage your listings, status, and details
            </p>
          </div>
          <button
            onClick={() => navigate("/home/create/room")}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition"
          >
            <Plus size={14} /> Add new →
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
          {PROP_FILTERS.map(({ id, label }) => (
            <FilterChip
              key={id}
              label={label}
              active={propFilter === id}
              onClick={() => setPropFilter(id)}
            />
          ))}
        </div>

        {!isLoading && properties.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-12 text-center rounded-2xl border border-white/5 bg-white/3">
            <Building2 size={32} className="text-zinc-600" />
            <div>
              <p className="text-[15px] font-semibold text-white">
                No properties yet
              </p>
              <p className="text-[13px] text-zinc-600 mt-1">
                Create your first listing to get started
              </p>
            </div>
            <button
              onClick={() => navigate("/home/create/room")}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
            >
              <Plus size={14} /> Create Property
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            : filteredProps.map((p) => <OwnerPropertyCard key={p._id} p={p} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-white">
              Booking Requests
            </h2>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Review and respond to tenant requests
            </p>
          </div>
          <button
            onClick={() => navigate("/home/messages")}
            className="flex items-center gap-1 text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
          {BOOKING_FILTERS.map(({ id, label }) => (
            <FilterChip
              key={id}
              label={label}
              active={bookingFilter === id}
              onClick={() => setBookingFilter(id)}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 border-b border-white/5 bg-white/2">
            {["Tenant", "Request Type / Date", "Status", "Actions"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-600"
              >
                {h}
              </p>
            ))}
          </div>

          {notifsLoading ? (
            <div className="flex flex-col">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 px-4 py-3.5 border-b border-white/5 animate-pulse"
                >
                  <div className="h-9 w-9 rounded-xl bg-zinc-800 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3 w-1/3 bg-zinc-700/60 rounded-full" />
                    <div className="h-2.5 w-1/2 bg-zinc-700/30 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <XCircle size={24} className="text-zinc-600" />
              <p className="text-[13px] text-zinc-600">
                No {bookingFilter === "all" ? "" : bookingFilter} requests yet
              </p>
            </div>
          ) : (
            filteredBookings.map((n) => <RealBookingRow key={n._id} n={n} />)
          )}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-[18px] font-bold text-white">Revenue Overview</h2>
          <p className="text-[12px] text-zinc-500 mt-0.5">
            Estimated monthly rent collection
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[28px] font-bold text-white">
                {monthlyRev > 0
                  ? `₹${monthlyRev.toLocaleString("en-IN")}`
                  : "—"}
              </p>
              <p className="text-[12px] text-zinc-500 mt-0.5">
                {monthlyRev > 0
                  ? `Estimated monthly from ${properties.length} propert${properties.length === 1 ? "y" : "ies"}`
                  : "No properties listed yet"}
              </p>
            </div>
            {monthlyRev > 0 && (
              <span className="rounded-full bg-green-500/15 border border-green-500/20 px-3 py-1 text-[11px] font-bold text-green-400 shrink-0 mt-1">
                {properties.filter((p) => p.isActive).length} active
              </span>
            )}
          </div>
          <RevenueChart months={revenueMonths} values={revenueValues} />
        </div>
      </section>
    </div>
  );
};

export default Owner;
