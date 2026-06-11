import { useState } from "react";
import {
    Building2, Users, Clock, TrendingUp, Plus, ChevronRight, XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetMe } from "../../../hooks/useAuth";
import { useGetMyProperties } from "../../../hooks/useProperty";
import { useGetNotRepliedNotifications } from "../../../hooks/useNotification";
import type { UserType } from "../../../types/auth.types";
import { greeting } from "../../../utils/greeting";
import { StatCard2 } from "./StatCard2";
import { FilterChip } from "./FilterChip";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { OwnerPropertyCard } from "./OwnerPropertyCard";
import { BookingRow } from "./BookingRow";
import { RevenueChart } from "./RevenueChart";

type PropFilter = "all" | "active" | "inactive" | "verified" | "pending";
type BookingFilter = "all" | "pending" | "approved" | "rejected";

const Owner = () => {
    const navigate = useNavigate();
    const { data: me } = useGetMe();
    const { data: properties = [], isLoading } = useGetMyProperties();
    const { data: requests = [] } = useGetNotRepliedNotifications();

    const [propFilter, setPropFilter] = useState<PropFilter>("all");
    const [bookingFilter, setBookingFilter] = useState<BookingFilter>("all");

    const ownerName = (me as UserType)?.name?.split(" ")[0] ?? "Owner";

    const filteredProps = properties.filter(p => {
        if (propFilter === "active") return p.isActive;
        if (propFilter === "inactive") return !p.isActive;
        if (propFilter === "verified") return p.verified;
        if (propFilter === "pending") return !p.verified;
        return true;
    });

    const totalTenants = properties.reduce((s, p) => s + p.totalBedRooms, 0);
    const monthlyRev = properties.reduce((s, p) => s + p.cost, 0);
    const pendingCount = requests.filter(r => r.type === "VISIT_REQUEST").length;

    const formatRev = (v: number) =>
        v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${(v / 1000).toFixed(0)}K`;


    const MOCK_BOOKINGS = [
        { name: "Arjun Kumar", email: "arjun@gmail.com", property: "Skyline Apts", room: "Shared Room A", moveIn: "Aug 1, 2025", status: "pending" as const, initials: "AK", color: "bg-blue-600" },
        { name: "Priya Rao", email: "priya@outlook.com", property: "Green Valley PG", room: "Room B", moveIn: "Aug 5, 2025", status: "approved" as const, initials: "PR", color: "bg-purple-600" },
        { name: "Sneha Mehta", email: "sneha@gmail.com", property: "Skyline Apts", room: "Private Room B", moveIn: "Jul 1, 2025", status: "approved" as const, initials: "SM", color: "bg-green-600" },
        { name: "Rohan Gupta", email: "rohan@gmail.com", property: "Green Valley PG", room: "Shared Room", moveIn: "Jul 15, 2025", status: "rejected" as const, initials: "RG", color: "bg-red-600" },
    ];

    const filteredBookings = MOCK_BOOKINGS.filter(b => {
        if (bookingFilter === "all") return true;
        return b.status === bookingFilter;
    });

    const PROP_FILTERS: { id: PropFilter; label: string }[] = [
        { id: "all", label: `All (${properties.length})` },
        { id: "active", label: `Active (${properties.filter(p => p.isActive).length})` },
        { id: "inactive", label: `Inactive (${properties.filter(p => !p.isActive).length})` },
        { id: "verified", label: `Verified (${properties.filter(p => p.verified).length})` },
        { id: "pending", label: `Pending Verification (${properties.filter(p => !p.verified).length})` },
    ];

    const BOOKING_FILTERS: { id: BookingFilter; label: string }[] = [
        { id: "all", label: `All (${MOCK_BOOKINGS.length})` },
        { id: "pending", label: `Pending (${MOCK_BOOKINGS.filter(b => b.status === "pending").length})` },
        { id: "approved", label: `Approved (${MOCK_BOOKINGS.filter(b => b.status === "approved").length})` },
        { id: "rejected", label: `Rejected (${MOCK_BOOKINGS.filter(b => b.status === "rejected").length})` },
    ];

    return (
        <div className="flex flex-col gap-8 pb-10">

            {/* ── Header ── */}
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

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard2
                    icon={<Building2 size={22} className="text-zinc-400" />}
                    label="Total Properties"
                    value={String(properties.length)}
                    sub={`↑ ${properties.filter(p => p.isActive).length} active`}
                    subColor="text-green-400"
                />
                <StatCard2
                    icon={<Users size={22} className="text-blue-400" />}
                    label="Active Tenants"
                    value={String(totalTenants)}
                    sub="↑ 2 new joins"
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
                    sub="↑ ₹12K vs last mo"
                    subColor="text-green-400"
                />
            </div>

            {/* ── My Properties ── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-white">My Properties</h2>
                        <p className="text-[12px] text-zinc-500 mt-0.5">Manage your listings, status, and details</p>
                    </div>
                    <button
                        onClick={() => navigate("/home/create/room")}
                        className="flex items-center gap-1.5 text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition"
                    >
                        <Plus size={14} /> Add new →
                    </button>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4">
                    {PROP_FILTERS.map(({ id, label }) => (
                        <FilterChip key={id} label={label} active={propFilter === id} onClick={() => setPropFilter(id)} />
                    ))}
                </div>

                {/* Error — no properties */}
                {!isLoading && properties.length === 0 && (
                    <div className="flex flex-col items-center gap-4 py-12 text-center rounded-2xl border border-white/5 bg-white/3">
                        <Building2 size={32} className="text-zinc-600" />
                        <div>
                            <p className="text-[15px] font-semibold text-white">No properties yet</p>
                            <p className="text-[13px] text-zinc-600 mt-1">Create your first listing to get started</p>
                        </div>
                        <button
                            onClick={() => navigate("/home/create/room")}
                            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20"
                        >
                            <Plus size={14} /> Create Property
                        </button>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                        : filteredProps.map(p => <OwnerPropertyCard key={p._id} p={p} />)
                    }
                </div>
            </section>

            {/* ── Booking Requests ── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-white">Booking Requests</h2>
                        <p className="text-[12px] text-zinc-500 mt-0.5">Review and respond to tenant requests</p>
                    </div>
                    <button className="flex items-center gap-1 text-[12px] font-semibold text-orange-400 hover:text-orange-300 transition">
                        View all <ChevronRight size={14} />
                    </button>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3">
                    {BOOKING_FILTERS.map(({ id, label }) => (
                        <FilterChip key={id} label={label} active={bookingFilter === id} onClick={() => setBookingFilter(id)} />
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
                    {/* Table header — desktop only */}
                    <div className="hidden sm:grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-4 py-3 border-b border-white/5 bg-white/2">
                        {["Tenant", "Property / Room", "Move-in", "Status"].map(h => (
                            <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{h}</p>
                        ))}
                    </div>

                    {filteredBookings.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10">
                            <XCircle size={24} className="text-zinc-600" />
                            <p className="text-[13px] text-zinc-600">No {bookingFilter} requests</p>
                        </div>
                    ) : (
                        filteredBookings.map((b, i) => <BookingRow key={i} {...b} />)
                    )}
                </div>
            </section>

            {/* ── Revenue Overview ── */}
            <section>
                <div className="mb-4">
                    <h2 className="text-[18px] font-bold text-white">Revenue Overview</h2>
                    <p className="text-[12px] text-zinc-500 mt-0.5">Monthly rent collection — last 8 months</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[28px] font-bold text-white">₹1,42,000</p>
                            <p className="text-[12px] text-zinc-500 mt-0.5">Total collected this month</p>
                        </div>
                        <span className="rounded-full bg-green-500/15 border border-green-500/20 px-3 py-1 text-[11px] font-bold text-green-400 shrink-0 mt-1">
                            ↑ 9.3% vs last month
                        </span>
                    </div>
                    <RevenueChart />
                </div>
            </section>
        </div>
    );
};

export default Owner;