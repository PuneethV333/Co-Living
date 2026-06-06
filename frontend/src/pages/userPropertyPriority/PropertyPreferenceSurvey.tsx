/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
    ArrowLeft, ArrowRight, MapPin, X,
    Lock, Users, User, UserCheck, ArrowUpDown, PawPrint,
    Train, ParkingCircle, Utensils, Leaf,
    Monitor, Building2,
    Infinity as InfinityIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { createUserPropertyPreferencePayloadType } from "../../types/userPriority.types";
import { useCreateUserPropertyPriority, useGetUserPropertyPriority, useUpdateUserPropertyPriority } from "../../hooks/useUserPropertyPriortiy";
import type { AmenityEnum, PropertyTypeEnum } from "../../types/property.types";
import { StepDots } from "./StepDots";
import { SUGGESTIONS } from "../../constants/property.constants";
import { AMENITIES, PROPERTY_TYPES } from "../../constants/amenities.constants";
import { OptionCard } from "./OptionCard";

const TOTAL_STEPS = 8;

const PropertyPreferenceSurvey = ({ mode = "create" }: { mode?: "create" | "update" }) => {
    const navigate = useNavigate();
    const { data: existing } = useGetUserPropertyPriority();
    const { mutate: create, isPending: creating } = useCreateUserPropertyPriority();
    const { mutate: update, isPending: updating } = useUpdateUserPropertyPriority();
    const isPending = creating || updating;

    const [step, setStep] = useState(1);


    const [budget, setBudget] = useState(existing?.budget?.min ?? 12500);
    const [locations, setLocations] = useState<string[]>(existing?.preferredLocations ?? ["Bengaluru", "HSR Layout"]);
    const [locInput, setLocInput] = useState("");
    const [propertyTypes, setPropertyTypes] = useState<PropertyTypeEnum[]>((existing?.propertyTypes ?? []) as PropertyTypeEnum[]);
    const [privateRoom, setPrivateRoom] = useState(existing?.roomPreference?.privateRoom ?? true);
    const [sharedRoom, setSharedRoom] = useState(existing?.roomPreference?.sharedRoom ?? false);
    const [occupancy, setOccupancy] = useState<"single" | "double" | "triple" | "any">(existing?.occupancyPreference ?? "single");
    const [amenities, setAmenities] = useState<AmenityEnum[]>((existing?.amenities ?? []) as AmenityEnum[]);
    const [gender, setGender] = useState<"Male" | "Female" | "Other" | "any">(existing?.genderPreference ?? "any");
    const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "office" | "any">(existing?.workMode ?? "any");
    const [food, setFood] = useState<"veg" | "non-veg" | "any">(existing?.foodPreference ?? "any");
    const [pets, setPets] = useState(existing?.petFriendly ?? false);
    const [metro, setMetro] = useState(existing?.transportNeeds?.metroNearby ?? false);
    const [parking, setParking] = useState(existing?.transportNeeds?.parkingRequired ?? false);

    useEffect(() => {
        if (!existing) return;
        setBudget(existing.budget?.min ?? 12500);
        setLocations(existing.preferredLocations ?? []);
        setPropertyTypes((existing.propertyTypes ?? []) as PropertyTypeEnum[]);
        setPrivateRoom(existing.roomPreference?.privateRoom ?? false);
        setSharedRoom(existing.roomPreference?.sharedRoom ?? false);
        setOccupancy(existing.occupancyPreference ?? "any");
        setAmenities((existing.amenities ?? []) as AmenityEnum[]);
        setGender(existing.genderPreference ?? "any");
        setWorkMode(existing.workMode ?? "any");
        setFood(existing.foodPreference ?? "any");
        setPets(existing.petFriendly ?? false);
        setMetro(existing.transportNeeds?.metroNearby ?? false);
        setParking(existing.transportNeeds?.parkingRequired ?? false);
    }, [existing]);

    const toggleArr = <T,>(arr: T[], setArr: (v: T[]) => void, val: T) =>
        setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

    const addLocation = (loc: string) => {
        const clean = loc.trim();
        if (!clean || locations.includes(clean)) return;
        setLocations((p) => [...p, clean]);
        setLocInput("");
    };

    const buildPayload = (): createUserPropertyPreferencePayloadType => ({
        min: budget,
        max: budget * 2,
        preferredLocations: locations,
        propertyTypes,
        amenities,
        privateRoom,
        sharedRoom,
        genderPreference: gender,
        occupancyPreference: occupancy,
        workMode,
        foodPreference: food,
        petFriendly: pets,
        metroNearby: metro,
        parkingRequired: parking,
    });

    const handleSubmit = () => {
        const payload = buildPayload();
        if (mode === "update") {
            update(payload);
        } else {
            create(payload);
        }
    };

    const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const back = () => { if (step === 1) navigate(-1); else setStep((s) => s - 1); };

    const STEP_LABELS = [
        "BUDGET PREFERENCES", "PREFERRED LOCATIONS", "PROPERTY TYPES",
        "ROOM & OCCUPANCY", "AMENITIES", "LIFESTYLE", "TRANSPORT", "SUMMARY",
    ];

    return (
        <div className="min-h-screen bg-[#09090f] flex flex-col text-white">

            <header className="sticky top-0 z-20 bg-[#09090f] px-5 py-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-sm font-bold text-white">C</span>
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight">Co-Living</span>
                </div>
                <button
                    onClick={() => navigate("/home")}
                    className="text-[12px] text-zinc-500 hover:text-white transition flex items-center gap-1"
                >
                    Skip survey →
                </button>
            </header>


            <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 flex flex-col gap-6">

                <StepDots current={step} total={TOTAL_STEPS} label={STEP_LABELS[step - 1]} />


                {step === 1 && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">What is your monthly budget?</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">This helps us filter properties within your comfortable range.</p>
                        </div>


                        <div className="rounded-2xl border border-white/8 bg-[#0d1117] p-6 flex flex-col items-center gap-2">
                            <p className="text-[32px] font-bold text-orange-400">₹{budget.toLocaleString("en-IN")}</p>
                            <p className="text-[11px] text-zinc-600 uppercase tracking-wider">Per Month</p>
                            <input
                                title="range"
                                type="range" min={5000} max={50000} step={500}
                                value={budget} onChange={(e) => setBudget(+e.target.value)}
                                className="w-full mt-4 accent-orange-500 cursor-pointer"
                            />
                            <div className="flex justify-between w-full">
                                <span className="text-[11px] text-zinc-600">₹5,000</span>
                                <span className="text-[11px] text-zinc-600">₹50,000+</span>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "PREMIUM SUITE", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
                                { label: "SMART SPACES", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
                            ].map(({ label, img }) => (
                                <div key={label} className="relative h-28 rounded-2xl overflow-hidden">
                                    <img src={img} alt={label} className="h-full w-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                                    <span className="absolute bottom-2 left-2 text-[10px] font-bold text-zinc-300 tracking-wider">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Where do you want to live?</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">The more locations you add, the more options we'll find for your perfect urban stay.</p>
                        </div>


                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <input
                                    value={locInput}
                                    onChange={(e) => setLocInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addLocation(locInput)}
                                    placeholder="Type a city or locality..."
                                    className="w-full rounded-xl border border-white/8 bg-white/5 pl-10 pr-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 transition"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => addLocation(locInput)}
                                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[13px] font-semibold text-zinc-300 hover:bg-white/10 transition"
                            >
                                + Add
                            </button>
                        </div>


                        {locations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {locations.map((loc) => (
                                    <span key={loc} className="flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1.5 text-[12px] font-semibold text-orange-300">
                                        {loc}
                                        <button onClick={() => setLocations((p) => p.filter((x) => x !== loc))}>
                                            <X size={12} className="hover:text-white transition" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}


                        <div className="flex flex-col gap-2">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Suggestions</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.filter((s) => !locations.includes(s)).map((s) => (
                                    <button key={s} type="button" onClick={() => addLocation(s)}
                                        className="rounded-full border border-white/8 bg-white/3 px-3.5 py-1.5 text-[12px] text-zinc-400 hover:border-orange-500/40 hover:text-orange-300 transition"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>


                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] h-32 flex items-center justify-center overflow-hidden">
                            <div className="opacity-20">
                                <svg width="100%" height="120" viewBox="0 0 300 120">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <g key={i}>
                                            <line x1={i * 40} y1="0" x2={i * 40 + 60} y2="120" stroke="#f97316" strokeWidth="0.5" />
                                            <line x1="0" y1={i * 20} x2="300" y2={i * 20 - 40} stroke="#f97316" strokeWidth="0.5" />
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>
                )}


                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">What type of property?</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">Select all property types you're open to. Multi-select allowed.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {PROPERTY_TYPES.map(({ value, label, icon }) => (
                                <OptionCard
                                    key={value}
                                    icon={icon}
                                    label={label}
                                    active={propertyTypes.includes(value)}
                                    onClick={() => toggleArr(propertyTypes, setPropertyTypes, value)}
                                    multiDot
                                />
                            ))}
                        </div>


                        <div className="rounded-2xl border border-white/5 bg-[#0d1117] p-4 flex items-start gap-3">
                            <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] text-zinc-500 leading-relaxed">
                                Selecting multiple options helps us find better matches in high-demand urban centers.
                            </p>
                        </div>
                    </div>
                )}


                {step === 4 && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Room & occupancy preference</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">Pick your room type and how many people you're okay sharing with.</p>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Room Type (select all that apply)</p>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionCard icon={<Lock size={22} />} label="Private Room" active={privateRoom} onClick={() => setPrivateRoom((p) => !p)} />
                                <OptionCard icon={<Users size={22} />} label="Shared Room" active={sharedRoom} onClick={() => setSharedRoom((p) => !p)} />
                            </div>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Occupancy</p>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { v: "single", label: "Single", icon: <User size={22} /> },
                                    { v: "double", label: "Double", icon: <UserCheck size={22} /> },
                                    { v: "triple", label: "Triple", icon: <Users size={22} /> },
                                    { v: "any", label: "Any", icon: <InfinityIcon size={22} /> },
                                ] as const).map(({ v, label, icon }) => (
                                    <OptionCard key={v} icon={icon} label={label} active={occupancy === v} onClick={() => setOccupancy(v)} />
                                ))}
                            </div>
                        </div>


                        <div className="relative h-28 rounded-2xl overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=70" alt="room" className="h-full w-full object-cover opacity-50" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-green-400" />
                                <span className="text-[11px] text-zinc-300 font-medium">Verified Premium Stays</span>
                            </div>
                        </div>
                    </div>
                )}


                {step === 5 && (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Must-have amenities?</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">Select amenities that are non-negotiable for you.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {AMENITIES.map(({ value, label, icon }) => (
                                <OptionCard
                                    key={value}
                                    icon={icon}
                                    label={label}
                                    active={amenities.includes(value)}
                                    onClick={() => toggleArr(amenities, setAmenities, value)}
                                    multiDot
                                />
                            ))}
                        </div>
                    </div>
                )}


                {step === 6 && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Tell us your lifestyle</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">We use this to match you with compatible roommates.</p>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Preferred Gender Mix</p>
                            <div className="grid grid-cols-2 gap-3">
                                {(["Male", "Female", "Other", "any"] as const).map((g) => (
                                    <OptionCard key={g} icon={<User size={20} />} label={g === "any" ? "Any" : g} active={gender === g} onClick={() => setGender(g)} />
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Work Mode</p>
                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    { v: "remote", label: "Remote", icon: <Monitor size={20} /> },
                                    { v: "hybrid", label: "Hybrid", icon: <ArrowUpDown size={20} /> },
                                    { v: "office", label: "Office", icon: <Building2 size={20} /> },
                                    { v: "any", label: "Any", icon: <InfinityIcon size={20} /> },
                                ] as const).map(({ v, label, icon }) => (
                                    <OptionCard key={v} icon={icon} label={label} active={workMode === v} onClick={() => setWorkMode(v)} />
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Food Preference</p>
                            <div className="grid grid-cols-3 gap-3">
                                {([
                                    { v: "veg", label: "Veg", icon: <Leaf size={20} /> },
                                    { v: "non-veg", label: "Non-Veg", icon: <Utensils size={20} /> },
                                    { v: "any", label: "Any", icon: <InfinityIcon size={20} /> },
                                ] as const).map(({ v, label, icon }) => (
                                    <OptionCard key={v} icon={icon} label={label} active={food === v} onClick={() => setFood(v)} />
                                ))}
                            </div>
                        </div>


                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Pet Friendly</p>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionCard icon={<PawPrint size={20} />} label="Yes" active={pets} onClick={() => setPets(true)} />
                                <OptionCard icon={<X size={20} />} label="No" active={!pets} onClick={() => setPets(false)} />
                            </div>
                        </div>
                    </div>
                )}


                {step === 7 && (
                    <div className="flex flex-col gap-6">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Transport needs?</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">Tell us your commute preferences so we can prioritise nearby options.</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Metro Nearby</p>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionCard icon={<Train size={22} />} label="Yes, required" active={metro} onClick={() => setMetro(true)} />
                                <OptionCard icon={<ArrowRight size={22} />} label="Not needed" active={!metro} onClick={() => setMetro(false)} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">Parking Required</p>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionCard icon={<ParkingCircle size={22} />} label="Yes, I need it" active={parking} onClick={() => setParking(true)} />
                                <OptionCard icon={<X size={22} />} label="Not needed" active={!parking} onClick={() => setParking(false)} />
                            </div>
                        </div>
                    </div>
                )}


                {step === 8 && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1 className="text-[26px] font-bold leading-tight">Almost there!</h1>
                            <p className="text-[13px] text-zinc-500 mt-2">Review your preferences before we find your perfect space.</p>
                        </div>

                        {[
                            {
                                title: "💰 Budget", step: 1,
                                content: <p className="text-[14px] font-bold text-orange-400">Up to ₹{budget.toLocaleString("en-IN")}/mo</p>,
                            },
                            {
                                title: "📍 Locations", step: 2,
                                content: <div className="flex flex-wrap gap-1.5">{locations.map((l) => (
                                    <span key={l} className="rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 text-[11px] text-orange-300">{l}</span>
                                ))}</div>,
                            },
                            {
                                title: "🏠 Property Types", step: 3,
                                content: <div className="flex flex-wrap gap-1.5">{propertyTypes.map((p) => (
                                    <span key={p} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400 capitalize">{p}</span>
                                ))}</div>,
                            },
                            {
                                title: "🛏️ Room & Occupancy", step: 4,
                                content: <p className="text-[13px] text-zinc-300">
                                    {[privateRoom && "Private", sharedRoom && "Shared"].filter(Boolean).join(" & ")} · {occupancy} occupancy
                                </p>,
                            },
                            {
                                title: "✨ Amenities", step: 5,
                                content: <p className="text-[13px] text-zinc-400">{amenities.length} selected</p>,
                            },
                            {
                                title: "👤 Lifestyle", step: 6,
                                content: <p className="text-[13px] text-zinc-300">{gender} · {workMode} · {food} · {pets ? "Pet friendly" : "No pets"}</p>,
                            },
                            {
                                title: "🚇 Transport", step: 7,
                                content: <p className="text-[13px] text-zinc-300">{metro ? "Metro nearby" : "No metro needed"} · {parking ? "Parking required" : "No parking"}</p>,
                            },
                        ].map(({ title, step: s, content }) => (
                            <div key={title} className="rounded-2xl border border-white/5 bg-[#0d1117] p-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[12px] font-bold text-zinc-500">{title}</p>
                                    <button onClick={() => setStep(s)} className="text-[11px] text-orange-400 hover:text-orange-300 transition">Edit</button>
                                </div>
                                {content}
                            </div>
                        ))}
                    </div>
                )}


                <div className="flex gap-3 pt-2 pb-6">
                    <button type="button" onClick={back}
                        className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-5 py-3.5 text-[14px] font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition active:scale-95"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step < TOTAL_STEPS ? (
                        <button type="button" onClick={next}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/25 active:scale-[0.98]"
                        >
                            Continue <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit} disabled={isPending}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/25 active:scale-[0.98] disabled:opacity-60"
                        >
                            {isPending
                                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                : <>{mode === "update" ? "Save Changes" : "Find My Space"} <ArrowRight size={16} /></>
                            }
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PropertyPreferenceSurvey;