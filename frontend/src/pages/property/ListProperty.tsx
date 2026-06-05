/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef } from "react";
import {
    ArrowLeft,
    ArrowRight,
    X,
    Check,
    Plus,
    MapPin,
    Building2,
    Home,
    Wifi,
    Car,
    Wind,
    Tv,
    UtensilsCrossed,
    WashingMachine,
    Zap,
    ArrowUpDown,
    Dumbbell,
    Waves,
    Shield,
    PawPrint,
    TreePine,
    Droplets,
    Thermometer,
    Sofa,
    Upload,
    Trash2,
    Save,
    Eye,
    Maximize2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateProperty } from "../../hooks/useProperty";
import { getImgUrl } from "../../utils/getUrlImg";
import type {
    AmenityEnum,
    createPropertyType,
    PropertyTypeEnum,
} from "../../types/property.types";
import { StepBar } from "../../components/StepVar";
import { Field } from "../../components/Field";
import { Counter } from "../../components/Counter";




const TOTAL_STEPS = 6;

const PROPERTY_TYPES: {
    value: PropertyTypeEnum;
    label: string;
    emoji: string;
}[] = [
        { value: "apartment", label: "Apartment", emoji: "🏢" },
        { value: "house", label: "House", emoji: "🏠" },
        { value: "villa", label: "Villa", emoji: "🏡" },
        { value: "studio", label: "Studio", emoji: "🏙️" },
        { value: "pg", label: "PG", emoji: "🏘️" },
        { value: "hostel", label: "Hostel", emoji: "🏨" },
        { value: "farmhouse", label: "Farmhouse", emoji: "🌾" },
    ];

const AMENITIES: {
    value: AmenityEnum;
    label: string;
    icon: React.ReactNode;
}[] = [
        { value: "wifi", label: "Fast WiFi", icon: <Wifi size={20} /> },
        { value: "parking", label: "Parking", icon: <Car size={20} /> },
        { value: "ac", label: "Air Conditioning", icon: <Wind size={20} /> },
        { value: "tv", label: "Smart TV", icon: <Tv size={20} /> },
        { value: "kitchen", label: "Kitchen", icon: <UtensilsCrossed size={20} /> },
        { value: "swimmingPool", label: "Pool", icon: <Waves size={20} /> },
        { value: "gym", label: "Gym", icon: <Dumbbell size={20} /> },
        {
            value: "washingMachine",
            label: "Laundry",
            icon: <WashingMachine size={20} />,
        },
        { value: "powerBackup", label: "Power Backup", icon: <Zap size={20} /> },
        { value: "lift", label: "Lift", icon: <ArrowUpDown size={20} /> },
        { value: "security", label: "Security", icon: <Shield size={20} /> },
        { value: "petFriendly", label: "Pet Friendly", icon: <PawPrint size={20} /> },
        { value: "balcony", label: "Balcony", icon: <Home size={20} /> },
        { value: "garden", label: "Garden", icon: <TreePine size={20} /> },
        { value: "waterSupply", label: "Water Supply", icon: <Droplets size={20} /> },
        { value: "geyser", label: "Geyser", icon: <Thermometer size={20} /> },
        { value: "furnished", label: "Furnished", icon: <Sofa size={20} /> },
    ];

const DEFAULT_RULES = ["No smoking", "No alcohol", "No loud music"];

const inputCls =
    "w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition";

const ListProperty = () => {
    const navigate = useNavigate();
    const { mutate: createProperty, isPending } = useCreateProperty();

    const [step, setStep] = useState(1);


    const [name, setName] = useState("");
    const [description, setDesc] = useState("");
    const [cost, setCost] = useState(0);
    const [propType, setPropType] = useState<PropertyTypeEnum | "">("");


    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [lat, setLat] = useState<number | "">("");
    const [lng, setLng] = useState<number | "">("");


    const [totalRooms, setTotalRooms] = useState(1);
    const [totalBedRooms, setBedRooms] = useState(1);
    const [totalBathrooms, setBathrooms] = useState(1);
    const [builtUpArea, setBuiltUpArea] = useState(500);


    const [amenities, setAmenities] = useState<AmenityEnum[]>([]);


    const [selectedRules, setSelectedRules] = useState<string[]>([
        "No smoking",
        "No alcohol",
    ]);
    const [customRule, setCustomRule] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [_, setUploadingIdx] = useState<number | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);


    const toggleAmenity = (a: AmenityEnum) =>
        setAmenities((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

    const toggleRule = (r: string) =>
        setSelectedRules((p) =>
            p.includes(r) ? p.filter((x) => x !== r) : [...p, r],
        );

    const addCustomRule = () => {
        if (!customRule.trim()) return;
        setSelectedRules((p) => [...p, customRule.trim()]);
        setCustomRule("");
    };

    const handlePhotoUpload = async (files: FileList | null) => {
        if (!files) return;
        for (const file of Array.from(files)) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB`);
                continue;
            }
            const idx = photos.length;
            setPhotos((p) => [...p, ""]);
            setUploadingIdx(idx);
            try {
                const url = await getImgUrl(file);
                setPhotos((p) => {
                    const n = [...p];
                    n[idx] = url;
                    return n;
                });
            } catch {
                toast.error("Upload failed");
                setPhotos((p) => p.filter((_, i) => i !== idx));
            } finally {
                setUploadingIdx(null);
            }
        }
    };


    const validate = (): boolean => {
        if (step === 1) {
            if (!name.trim()) {
                toast.error("Property name is required");
                return false;
            }
            if (!description.trim()) {
                toast.error("Description is required");
                return false;
            }
            if (!cost || cost <= 0) {
                toast.error("Enter a valid monthly cost");
                return false;
            }
            if (!propType) {
                toast.error("Select a property type");
                return false;
            }
        }
        if (step === 2) {
            if (!address.trim()) {
                toast.error("Address is required");
                return false;
            }
            if (!city.trim()) {
                toast.error("City is required");
                return false;
            }
            if (!state.trim()) {
                toast.error("State is required");
                return false;
            }
            if (!zipCode.trim()) {
                toast.error("ZIP code is required");
                return false;
            }
        }
        return true;
    };

    const next = () => {
        if (validate()) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };
    const back = () => setStep((s) => Math.max(s - 1, 1));


    const handleSubmit = () => {
        const payload: createPropertyType = {
            name,
            description,
            cost,
            address,
            city,
            state,
            zipCode,
            lat: lat === "" ? 0 : Number(lat),
            lng: lng === "" ? 0 : Number(lng),
            propertyType: propType as PropertyTypeEnum,
            totalRooms,
            totalBedRooms,
            totalBathrooms,
            builtUpArea,
            amenities,
            rules: selectedRules,
            photos: photos.filter(Boolean),
        };
        createProperty(payload, { onSuccess: () => navigate("/home") });
    };

    const STEP_TITLES = [
        "Basic Information",
        "Location Details",
        "Property Details",
        "Amenities",
        "Rules & Photos",
        "Review & Publish",
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1C] flex flex-col">
            <header className="sticky top-0 z-20 bg-[#0A0F1C] border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
                    >
                        <X size={16} />
                    </button>
                    <div>
                        <p className="text-[11px] text-zinc-500">
                            Step {step} of {TOTAL_STEPS}
                        </p>
                        <p className="text-[13px] font-semibold text-white">
                            List Your Property
                        </p>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white transition">
                    <Save size={13} /> Save Draft
                </button>
            </header>

            <div className="px-5 pt-3">
                <StepBar current={step} total={TOTAL_STEPS} />
            </div>

            <main className="flex-1 max-w-xl mx-auto w-full px-5 py-6 flex flex-col gap-6">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-1">
                        Step {step} of {TOTAL_STEPS}
                    </p>
                    <h1 className="text-2xl font-bold text-white">
                        {STEP_TITLES[step - 1]}
                    </h1>
                    <p className="text-[13px] text-zinc-500 mt-1">
                        {step === 1 && "Tell us the basic information about your property."}
                        {step === 2 &&
                            "Help tenants find your property on the map and Bengaluru's top listings."}
                        {step === 3 &&
                            "Provide the dimensions and rooms of your property to help tenants choose wisely."}
                        {step === 4 &&
                            "Select all the amenities available at your property to help guests understand what to expect."}
                        {step === 5 &&
                            "Set expectations for your guests and show off your space."}
                        {step === 6 &&
                            "Review everything carefully before creating your listing."}
                    </p>
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <Field label="Property Name" required>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sunny Loft Downtown"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Description" required>
                            <textarea
                                value={description}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Describe what makes your place unique..."
                                rows={4}
                                className={`${inputCls} resize-none`}
                            />
                        </Field>

                        <Field label="Monthly Cost (₹)" required>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[14px]">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    value={cost || ""}
                                    onChange={(e) => setCost(Number(e.target.value))}
                                    placeholder="15000"
                                    className={`${inputCls} pl-8`}
                                />
                            </div>
                        </Field>

                        <Field label="Property Type" required>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {PROPERTY_TYPES.map(({ value, label, emoji }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setPropType(value)}
                                        className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all duration-200 ${propType === value
                                                ? "border-orange-500 bg-orange-500/10 text-orange-300"
                                                : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/15"
                                            }`}
                                    >
                                        <span className="text-2xl">{emoji}</span>
                                        <span className="text-[11px] font-semibold">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-5">
                        <Field label="Street Address" required>
                            <div className="relative">
                                <MapPin
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                />
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. 12th Main, HSR Layout"
                                    className={`${inputCls} pl-10`}
                                />
                            </div>
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="City" required>
                                <input
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="e.g. Bengaluru"
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="State" required>
                                <select
                                    title="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className={`${inputCls} scheme-dark`}
                                >
                                    <option value="">Select State</option>
                                    {[
                                        "Karnataka",
                                        "Maharashtra",
                                        "Delhi",
                                        "Tamil Nadu",
                                        "Telangana",
                                        "Gujarat",
                                        "Rajasthan",
                                    ].map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="ZIP / Pin Code" required>
                            <input
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="e.g. 560102"
                                className={inputCls}
                            />
                        </Field>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={15} className="text-orange-400" />
                                <p className="text-[13px] font-semibold text-white">
                                    📍 Coordinates
                                </p>
                                <span className="ml-auto text-[11px] text-zinc-600">
                                    (optional)
                                </span>
                            </div>
                            <p className="text-[12px] text-zinc-600 -mt-2">
                                Add coordinates for a precise map pin on your listing.
                            </p>

                            {lat !== "" && lng !== "" && (
                                <div className="rounded-xl overflow-hidden border border-white/5 h-40">
                                    <iframe
                                        title="location-preview"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.01},${Number(lat) - 0.01},${Number(lng) + 0.01},${Number(lat) + 0.01}&layer=mapnik&marker=${lat},${lng}`}
                                        className="w-full h-full border-0"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Latitude">
                                    <input
                                        type="number"
                                        step="any"
                                        value={lat}
                                        onChange={(e) =>
                                            setLat(
                                                e.target.value === "" ? "" : Number(e.target.value),
                                            )
                                        }
                                        placeholder="e.g. 12.9716"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Longitude">
                                    <input
                                        type="number"
                                        step="any"
                                        value={lng}
                                        onChange={(e) =>
                                            setLng(
                                                e.target.value === "" ? "" : Number(e.target.value),
                                            )
                                        }
                                        placeholder="e.g. 77.5946"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-3">
                            <Counter
                                label="Total Rooms"
                                icon={<Building2 size={16} />}
                                value={totalRooms}
                                onChange={setTotalRooms}
                                min={1}
                            />
                            <Counter
                                label="Bed Rooms"
                                icon={<Home size={16} />}
                                value={totalBedRooms}
                                onChange={setBedRooms}
                                min={1}
                            />
                            <Counter
                                label="Bathrooms"
                                icon={<Droplets size={16} />}
                                value={totalBathrooms}
                                onChange={setBathrooms}
                                min={1}
                            />
                        </div>

                        <Field label="Built-up Area (sqft)">
                            <div className="relative">
                                <Maximize2
                                    size={14}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                                    style={{}}
                                />
                                <input
                                    type="number"
                                    value={builtUpArea}
                                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                                    placeholder="e.g. 1000"
                                    className={`${inputCls} pl-9`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-zinc-600">
                                    sqft
                                </span>
                            </div>
                        </Field>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-2">
                            <p className="text-[13px] font-semibold text-white">
                                Floor Plan Reference
                            </p>
                            <p className="text-[12px] text-zinc-600">
                                Count your rooms from any available floor plan item.
                            </p>
                            <div className="mt-1 rounded-xl bg-zinc-800/60 h-32 flex items-center justify-center">
                                <span className="text-5xl opacity-30">🏗️</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AMENITIES.map(({ value, label, icon }) => {
                                const active = amenities.includes(value);
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => toggleAmenity(value)}
                                        className={`relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 ${active
                                                ? "border-orange-500 bg-orange-500/10"
                                                : "border-white/8 bg-white/3 hover:border-white/15"
                                            }`}
                                    >
                                        {active && (
                                            <span className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                                <Check size={11} className="text-white" />
                                            </span>
                                        )}
                                        <span
                                            className={active ? "text-orange-400" : "text-zinc-500"}
                                        >
                                            {icon}
                                        </span>
                                        <span
                                            className={`text-[12px] font-semibold ${active ? "text-orange-300" : "text-zinc-400"}`}
                                        >
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {amenities.length > 0 && (
                            <p className="text-[12px] text-zinc-600 text-center">
                                {amenities.length} amenit{amenities.length === 1 ? "y" : "ies"}{" "}
                                selected
                            </p>
                        )}
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <p className="text-[13px] font-semibold text-white">
                                House Rules
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_RULES.map((r) => {
                                    const active = selectedRules.includes(r);
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => toggleRule(r)}
                                            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition ${active
                                                    ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                                                    : "border-white/8 bg-white/3 text-zinc-500 hover:border-white/15"
                                                }`}
                                        >
                                            {active ? (
                                                <Check size={11} className="text-orange-400" />
                                            ) : (
                                                <Plus size={11} />
                                            )}
                                            {r}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={customRule}
                                    onChange={(e) => setCustomRule(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addCustomRule()}
                                    placeholder="Add a custom rule..."
                                    className={`${inputCls} flex-1`}
                                />
                                <button
                                    type="button"
                                    onClick={addCustomRule}
                                    className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {selectedRules.filter((r) => !DEFAULT_RULES.includes(r)).length >
                                0 && (
                                    <div className="flex flex-col gap-2">
                                        {selectedRules
                                            .filter((r) => !DEFAULT_RULES.includes(r))
                                            .map((r) => (
                                                <div
                                                    key={r}
                                                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-3.5 py-2.5"
                                                >
                                                    <span className="text-[13px] text-zinc-300">{r}</span>
                                                    <button
                                                        onClick={() =>
                                                            setSelectedRules((p) => p.filter((x) => x !== r))
                                                        }
                                                        className="text-zinc-600 hover:text-red-400 transition"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-white">
                                    Property Photos
                                </p>
                                <span className="text-[11px] text-zinc-600">
                                    ≥ 3 photos recommended
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="rounded-2xl border-2 border-dashed border-white/10 bg-white/3 p-8 flex flex-col items-center gap-3 hover:border-orange-500/40 hover:bg-orange-500/5 transition group"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition">
                                    <Upload
                                        size={20}
                                        className="text-zinc-500 group-hover:text-orange-400 transition"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-[13px] font-semibold text-zinc-400 group-hover:text-white transition">
                                        Drag and drop photos here
                                    </p>
                                    <p className="text-[11px] text-zinc-600 mt-0.5">
                                        Only JPG, PNG or WEBP — max 5MB/file
                                    </p>
                                </div>
                                <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[12px] text-zinc-400 group-hover:text-white transition">
                                    Choose Files
                                </span>
                            </button>
                            <input
                                placeholder="upload images"
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handlePhotoUpload(e.target.files)}
                            />

                            {photos.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {photos.map((url, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800/60"
                                        >
                                            {url ? (
                                                <img
                                                    src={url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                                </div>
                                            )}
                                            {url && (
                                                <button
                                                    onClick={() =>
                                                        setPhotos((p) => p.filter((_, idx) => idx !== i))
                                                    }
                                                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center text-zinc-400 hover:text-red-400 transition"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            )}
                                            {i === 0 && url && (
                                                <span className="absolute bottom-1 left-1 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                    Cover
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                                    🏠 Basic Information
                                </p>
                                <button
                                    onClick={() => setStep(1)}
                                    className="text-[11px] text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
                                >
                                    <Eye size={11} /> Edit
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[13px]">
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Property Type</p>
                                    <p className="text-white font-medium capitalize">
                                        {propType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Monthly Cost</p>
                                    <p className="text-white font-medium">
                                        ₹{cost.toLocaleString("en-IN")}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-zinc-600 text-[11px]">Name</p>
                                    <p className="text-white font-medium">{name}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-zinc-600 text-[11px]">Address</p>
                                    <p className="text-white font-medium">
                                        {address}, {city}, {state} {zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                                    📐 Property Details
                                </p>
                                <button
                                    onClick={() => setStep(3)}
                                    className="text-[11px] text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
                                >
                                    <Eye size={11} /> Edit
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[13px]">
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Bathrooms</p>
                                    <p className="text-white font-medium">{totalBathrooms}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Bedrooms</p>
                                    <p className="text-white font-medium">{totalBedRooms}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Built-up Area</p>
                                    <p className="text-white font-medium">{builtUpArea} sqft</p>
                                </div>
                                <div>
                                    <p className="text-zinc-600 text-[11px]">Rooms</p>
                                    <p className="text-white font-medium">{totalRooms}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                                    ✨ Amenities
                                </p>
                                <button
                                    onClick={() => setStep(4)}
                                    className="text-[11px] text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
                                >
                                    <Eye size={11} /> Edit
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {amenities.length === 0 ? (
                                    <p className="text-[12px] text-zinc-600">None selected</p>
                                ) : (
                                    amenities.map((a) => (
                                        <span
                                            key={a}
                                            className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400 capitalize"
                                        >
                                            {a}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">
                                    📸 Photos
                                </p>
                                <button
                                    onClick={() => setStep(5)}
                                    className="text-[11px] text-orange-400 hover:text-orange-300 transition flex items-center gap-1"
                                >
                                    <Eye size={11} /> Edit
                                </button>
                            </div>
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                {photos.filter(Boolean).length === 0 ? (
                                    <p className="text-[12px] text-zinc-600">
                                        No photos uploaded
                                    </p>
                                ) : (
                                    photos
                                        .filter(Boolean)
                                        .map((url, i) => (
                                            <img
                                                key={i}
                                                src={url}
                                                alt=""
                                                className="h-16 w-24 rounded-xl object-cover shrink-0 border border-white/5"
                                            />
                                        ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 flex items-center justify-between">
                            <div>
                                <p className="text-[12px] text-zinc-500">Monthly Rent</p>
                                <p className="text-[24px] font-bold text-white">
                                    ₹{cost.toLocaleString("en-IN")}
                                </p>
                                <p className="text-[11px] text-zinc-600">
                                    Max 6 months advance
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[11px] text-zinc-600 mb-1">Listing type</p>
                                <span className="rounded-full bg-orange-500/15 border border-orange-500/20 px-3 py-1 text-[12px] font-semibold text-orange-300 capitalize">
                                    {propType}
                                </span>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/3 p-4 cursor-pointer group">
                            <div className="h-5 w-5 rounded-md border border-white/15 bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-orange-500/50 transition">
                                <Check size={12} className="text-orange-400" />
                            </div>
                            <p className="text-[12px] text-zinc-500 leading-relaxed">
                                I confirm that all information is accurate and true. I
                                understand that false listings may be removed and may result in
                                consequences along with being held responsible for the impact on
                                tenants.
                            </p>
                        </label>
                    </div>
                )}

                <div className="flex gap-3 mt-auto pt-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={back}
                            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-5 py-3.5 text-[14px] font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition active:scale-95"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    )}
                    {step < TOTAL_STEPS ? (
                        <button
                            type="button"
                            onClick={next}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60"
                        >
                            {isPending ? (
                                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>
                                    <Check size={16} /> Create Listing
                                </>
                            )}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ListProperty;
