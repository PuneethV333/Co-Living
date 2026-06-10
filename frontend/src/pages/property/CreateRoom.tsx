import { useState, useRef, type Dispatch, type SetStateAction } from "react";
import {
    ArrowLeft, ArrowRight, X, Check, Plus, Droplets, Upload, Trash2, Save, Bed,
    DollarSign, Calendar, Users,
    MapPin,
    Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateRoom } from "../../hooks/useProperty";
import { getImgUrl } from "../../utils/getUrlImg";
import type {
    AmenityEnum, PropertyTypeEnum, createRoomType,
} from "../../types/property.types";
import { StepBar } from "../../components/StepVar";
import { SectionTitle } from "../../components/SectionTitle";
import { Field } from "../../components/Field";
import { PROPERTY_TYPES } from "../../constants/property.constants";
import { Counter } from "../../components/Counter";
import { AMENITIES, DEFAULT_RULES } from "../../constants/amenities.constants";


const TOTAL_STEPS = 5;
const inputCls = "w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition";

const CreateRoom = () => {
    const navigate = useNavigate();
    const { mutate: createRoom, isPending } = useCreateRoom();

    const [step, setStep] = useState(1);


    const [propName, setPropName] = useState("");
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
    const [totalBathrooms, setBaths] = useState(1);
    const [builtUpArea, setArea] = useState(500);
    const [propAmenities, setPropAmen] = useState<AmenityEnum[]>([]);
    const [rules, setRules] = useState<string[]>(["No smoking"]);
    const [customRule, setCustomRule] = useState("");
    const [propPhotos, setPropPhotos] = useState<string[]>([]);


    const [roomType, setRoomType] = useState<"shared" | "private">("private");
    const [bedType, setBedType] = useState<"single" | "double" | "bunk">("single");
    const [capacity, setCapacity] = useState(1);
    const [roomArea, setRoomArea] = useState(150);
    const [monthlyRent, setMonthlyRent] = useState(0);
    const [secDeposit, setSecDeposit] = useState(0);
    const [maintenance, setMaintenance] = useState(0);
    const [currentOccupants, setOccupants] = useState(0);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [roomAmenities, setRoomAmen] = useState<AmenityEnum[]>([]);
    const [roomPhotos, setRoomPhotos] = useState<string[]>([]);

    const [uploadingProp, setUploadingProp] = useState(false);
    const [uploadingRoom, setUploadingRoom] = useState(false);
    const propFileRef = useRef<HTMLInputElement>(null);
    const roomFileRef = useRef<HTMLInputElement>(null);

    const toggleArr = <T,>(arr: T[], setArr: (v: T[]) => void, val: T) =>
        setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);


    const handlePhotoUpload = async (
        files: FileList | null,
        photos: string[],
        setPhotos: Dispatch<SetStateAction<string[]>>,
        setUploading: (v: boolean) => void,
    ) => {
        if (!files) return;

        for (const file of Array.from(files)) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} too large (max 5MB)`);
                continue;
            }

            const idx = photos.length;
            setPhotos((prev) => [...prev, ""]);
            setUploading(true);

            try {
                const url = await getImgUrl(file);

                setPhotos((prev) => {
                    const updated = [...prev];
                    updated[idx] = url;
                    return updated;
                });
            } catch (error) {
                console.error(error);
                toast.error("Upload failed");
            } finally {
                setUploading(false);
            }
        }
    };

    const validate = (): boolean => {
        if (step === 1) {
            if (!propName.trim()) { toast.error("Property name required"); return false; }
            if (!description.trim()) { toast.error("Description required"); return false; }
            if (!cost || cost <= 0) { toast.error("Enter a valid cost"); return false; }
            if (!propType) { toast.error("Select a property type"); return false; }
        }
        if (step === 2) {
            if (!address.trim()) { toast.error("Address required"); return false; }
            if (!city.trim()) { toast.error("City required"); return false; }
            if (!state.trim()) { toast.error("State required"); return false; }
            if (!zipCode.trim()) { toast.error("ZIP code required"); return false; }
        }
        if (step === 4) {
            if (!monthlyRent || monthlyRent <= 0) { toast.error("Enter monthly rent"); return false; }
            if (!secDeposit || secDeposit <= 0) { toast.error("Enter security deposit"); return false; }
            if (!startDate) { toast.error("Enter availability start date"); return false; }
        }
        return true;
    };

    const next = () => { if (validate()) setStep(s => Math.min(s + 1, TOTAL_STEPS)); };
    const back = () => { if (step === 1) navigate(-1); else setStep(s => s - 1); };

    const handleSubmit = () => {
        if (!validate()) return;
        if (!startDate) { toast.error("Start date required"); return; }

        const payload: createRoomType = {
            createPropertySchema: {
                name: propName, description, cost,
                address, city, state, zipCode,
                lat: lat === "" ? 0 : Number(lat),
                lng: lng === "" ? 0 : Number(lng),
                propertyType: propType as PropertyTypeEnum,
                totalRooms, totalBedRooms, totalBathrooms, builtUpArea,
                amenities: propAmenities,
                rules,
                photos: propPhotos.filter(Boolean),
            },
            roomType, bedType, capacity,
            area: roomArea,
            monthlyRent, securityDeposit: secDeposit,
            maintenanceCharges: maintenance,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            currentOccupants,
        };

        createRoom(payload, { onSuccess: () => { toast.success("Property & Room created!"); navigate("/home"); } });
    };

    const STEP_TITLES = [
        "Property Info", "Location", "Property Details & Photos",
        "Room Details", "Review & Publish",
    ];

    return (
        <div className="min-h-screen bg-[#0A0F1C] flex flex-col">
            <header className="sticky top-0 z-20 bg-[#0A0F1C] border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)}
                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition">
                        <X size={16} />
                    </button>
                    <div>
                        <p className="text-[11px] text-zinc-500">Step {step} of {TOTAL_STEPS}</p>
                        <p className="text-[13px] font-semibold text-white">Create Property & Room</p>
                    </div>
                </div>
                <button className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white transition">
                    <Save size={13} /> Draft
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
                    <h1 className="text-2xl font-bold text-white">{STEP_TITLES[step - 1]}</h1>
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-5">
                        <SectionTitle step={1} label="Property Information" />

                        <Field label="Property Name" required>
                            <input value={propName} onChange={e => setPropName(e.target.value)}
                                placeholder="e.g. Skyline Apartments" className={inputCls} />
                        </Field>

                        <Field label="Description" required>
                            <textarea value={description} onChange={e => setDesc(e.target.value)}
                                placeholder="Describe your property…" rows={3}
                                className={`${inputCls} resize-none`} />
                        </Field>

                        <Field label="Monthly Cost (₹)" required>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                <input type="number" value={cost || ""} onChange={e => setCost(Number(e.target.value))}
                                    placeholder="15000" className={`${inputCls} pl-8`} />
                            </div>
                        </Field>

                        <Field label="Property Type" required>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {PROPERTY_TYPES.map(({ value, label, emoji }) => (
                                    <button key={value} type="button" onClick={() => setPropType(value)}
                                        className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${propType === value
                                            ? "border-orange-500 bg-orange-500/10 text-orange-300"
                                            : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/15"
                                            }`}>
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
                        <SectionTitle step={2} label="Property Location" />

                        <Field label="Street Address" required>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                                <input value={address} onChange={e => setAddress(e.target.value)}
                                    placeholder="e.g. 12th Main, HSR Layout" className={`${inputCls} pl-10`} />
                            </div>
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="City" required>
                                <input value={city} onChange={e => setCity(e.target.value)}
                                    placeholder="Bengaluru" className={inputCls} />
                            </Field>
                            <Field label="State" required>
                                <select title="state" value={state} onChange={e => setState(e.target.value)}
                                    className={`${inputCls} scheme-dark`}>
                                    <option value="">Select</option>
                                    {["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Telangana", "Gujarat", "Rajasthan", "West Bengal", "Uttar Pradesh"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="ZIP / PIN Code" required>
                            <input value={zipCode} onChange={e => setZipCode(e.target.value)}
                                placeholder="560102" className={inputCls} />
                        </Field>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-orange-400" />
                                <p className="text-[13px] font-semibold text-white">Coordinates</p>
                                <span className="ml-auto text-[11px] text-zinc-600">optional</span>
                            </div>
                            {lat !== "" && lng !== "" && (
                                <div className="rounded-xl overflow-hidden border border-white/5 h-36">
                                    <iframe title="map"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.01},${Number(lat) - 0.01},${Number(lng) + 0.01},${Number(lat) + 0.01}&layer=mapnik&marker=${lat},${lng}`}
                                        className="w-full h-full border-0" />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Latitude">
                                    <input type="number" step="any" value={lat}
                                        onChange={e => setLat(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="12.9716" className={inputCls} />
                                </Field>
                                <Field label="Longitude">
                                    <input type="number" step="any" value={lng}
                                        onChange={e => setLng(e.target.value === "" ? "" : Number(e.target.value))}
                                        placeholder="77.5946" className={inputCls} />
                                </Field>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-6">
                        <SectionTitle step={3} label="Property Details" />

                        <div className="grid grid-cols-2 gap-3">
                            <Counter label="Total Rooms" icon={<Building2 size={15} />} value={totalRooms} onChange={setTotalRooms} min={1} />
                            <Counter label="Bedrooms" icon={<Bed size={15} />} value={totalBedRooms} onChange={setBedRooms} min={1} />
                            <Counter label="Bathrooms" icon={<Droplets size={15} />} value={totalBathrooms} onChange={setBaths} min={1} />
                        </div>

                        <Field label="Built-up Area (sqft)">
                            <input type="number" value={builtUpArea} onChange={e => setArea(Number(e.target.value))}
                                placeholder="1000" className={inputCls} />
                        </Field>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Property Amenities</p>
                            <div className="grid grid-cols-2 gap-2">
                                {AMENITIES.map(({ value, label, icon }) => {
                                    const active = propAmenities.includes(value);
                                    return (
                                        <button key={value} type="button" onClick={() => toggleArr(propAmenities, setPropAmen, value)}
                                            className={`relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all ${active ? "border-orange-500 bg-orange-500/10" : "border-white/8 bg-white/3 hover:border-white/15"
                                                }`}>
                                            {active && <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={9} className="text-white" /></span>}
                                            <span className={active ? "text-orange-400" : "text-zinc-500"}>{icon}</span>
                                            <span className={`text-[12px] font-medium ${active ? "text-orange-300" : "text-zinc-400"}`}>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">House Rules</p>
                            <div className="flex flex-wrap gap-2">
                                {DEFAULT_RULES.map(r => (
                                    <button key={r} type="button" onClick={() => toggleArr(rules, setRules, r)}
                                        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition ${rules.includes(r)
                                            ? "border-orange-500/40 bg-orange-500/10 text-orange-300"
                                            : "border-white/8 bg-white/3 text-zinc-500 hover:border-white/15"
                                            }`}>
                                        {rules.includes(r) ? <Check size={11} className="text-orange-400" /> : <Plus size={11} />} {r}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={customRule} onChange={e => setCustomRule(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && customRule.trim()) { setRules(p => [...p, customRule.trim()]); setCustomRule(""); } }}
                                    placeholder="Add custom rule…" className={`${inputCls} flex-1`} />
                                <button type="button" onClick={() => { if (customRule.trim()) { setRules(p => [...p, customRule.trim()]); setCustomRule(""); } }}
                                    className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Property Photos</p>
                            <button type="button" onClick={() => propFileRef.current?.click()}
                                className="rounded-2xl border-2 border-dashed border-white/10 bg-white/3 p-6 flex flex-col items-center gap-2 hover:border-orange-500/40 hover:bg-orange-500/5 transition group">
                                <Upload size={20} className="text-zinc-500 group-hover:text-orange-400 transition" />
                                <p className="text-[12px] text-zinc-500 group-hover:text-white transition">Upload property photos</p>
                                <p className="text-[11px] text-zinc-700">JPG, PNG, WEBP · Max 5MB</p>
                            </button>
                            <input title="img" ref={propFileRef} type="file" accept="image/*" multiple className="hidden"
                                onChange={e => handlePhotoUpload(e.target.files, propPhotos, setPropPhotos, setUploadingProp)} />
                            {propPhotos.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {propPhotos.map((url, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800/60">
                                            {url ? <img src={url} alt="" className="h-full w-full object-cover" />
                                                : <div className="h-full flex items-center justify-center"><span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /></div>}
                                            {url && <button onClick={() => setPropPhotos(p => p.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center text-zinc-400 hover:text-red-400 transition">
                                                <Trash2 size={10} /></button>}
                                            {i === 0 && url && <span className="absolute bottom-1 left-1 rounded-md bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-white">Cover</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-6">
                        <SectionTitle step={4} label="Room Details" />

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Room Type</p>
                            <div className="grid grid-cols-2 gap-3">
                                {(["private", "shared"] as const).map(t => (
                                    <button key={t} type="button" onClick={() => setRoomType(t)}
                                        className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all ${roomType === t ? "border-orange-500 bg-orange-500/10 text-orange-300" : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/15"
                                            }`}>
                                        <span className="text-2xl">{t === "private" ? "🔒" : "👥"}</span>
                                        <span className="text-[13px] font-semibold capitalize">{t}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Bed Type</p>
                            <div className="grid grid-cols-3 gap-3">
                                {(["single", "double", "bunk"] as const).map(b => (
                                    <button key={b} type="button" onClick={() => setBedType(b)}
                                        className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all ${bedType === b ? "border-orange-500 bg-orange-500/10 text-orange-300" : "border-white/8 bg-white/3 text-zinc-400 hover:border-white/15"
                                            }`}>
                                        <span className="text-xl">🛏️</span>
                                        <span className="text-[11px] font-semibold capitalize">{b}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Counter label="Capacity" icon={<Users size={15} />} value={capacity} onChange={setCapacity} min={1} />
                            <Counter label="Current Tenants" icon={<Users size={15} />} value={currentOccupants} onChange={setOccupants} min={0} />
                        </div>

                        <Field label="Room Area (sqft)">
                            <input type="number" value={roomArea} onChange={e => setRoomArea(Number(e.target.value))}
                                placeholder="150" className={inputCls} />
                        </Field>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <DollarSign size={15} className="text-orange-400" />
                                <p className="text-[13px] font-semibold text-white">Pricing</p>
                            </div>
                            <Field label="Monthly Rent (₹)" required>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                    <input type="number" value={monthlyRent || ""} onChange={e => setMonthlyRent(Number(e.target.value))}
                                        placeholder="8000" className={`${inputCls} pl-8`} />
                                </div>
                            </Field>
                            <Field label="Security Deposit (₹)" required>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                    <input type="number" value={secDeposit || ""} onChange={e => setSecDeposit(Number(e.target.value))}
                                        placeholder="16000" className={`${inputCls} pl-8`} />
                                </div>
                            </Field>
                            <Field label="Maintenance Charges (₹)" hint="Optional monthly maintenance fee">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                    <input type="number" value={maintenance || ""} onChange={e => setMaintenance(Number(e.target.value))}
                                        placeholder="500" className={`${inputCls} pl-8`} />
                                </div>
                            </Field>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-orange-400" />
                                <p className="text-[13px] font-semibold text-white">Availability</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Available From" required>
                                    <input title="date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                                        className={`${inputCls} scheme-dark`} />
                                </Field>
                                <Field label="Available Until" hint="Leave blank for open-ended">
                                    <input title="data" type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                        className={`${inputCls} scheme-dark`} />
                                </Field>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Room Amenities</p>
                            <div className="grid grid-cols-2 gap-2">
                                {AMENITIES.map(({ value, label, icon }) => {
                                    const active = roomAmenities.includes(value);
                                    return (
                                        <button key={value} type="button" onClick={() => toggleArr(roomAmenities, setRoomAmen, value)}
                                            className={`relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all ${active ? "border-orange-500 bg-orange-500/10" : "border-white/8 bg-white/3 hover:border-white/15"
                                                }`}>
                                            {active && <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center"><Check size={9} className="text-white" /></span>}
                                            <span className={active ? "text-orange-400" : "text-zinc-500"}>{icon}</span>
                                            <span className={`text-[12px] font-medium ${active ? "text-orange-300" : "text-zinc-400"}`}>{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Room Photos</p>
                            <button type="button" onClick={() => roomFileRef.current?.click()}
                                className="rounded-2xl border-2 border-dashed border-white/10 bg-white/3 p-6 flex flex-col items-center gap-2 hover:border-orange-500/40 hover:bg-orange-500/5 transition group">
                                <Upload size={20} className="text-zinc-500 group-hover:text-orange-400 transition" />
                                <p className="text-[12px] text-zinc-500 group-hover:text-white transition">Upload room photos</p>
                            </button>
                            <input title="file" ref={roomFileRef} type="file" accept="image/*" multiple className="hidden"
                                onChange={e => handlePhotoUpload(e.target.files, roomPhotos, setRoomPhotos, setUploadingRoom)} />
                            {roomPhotos.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {roomPhotos.map((url, i) => (
                                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800/60">
                                            {url ? <img src={url} alt="" className="h-full w-full object-cover" />
                                                : <div className="h-full flex items-center justify-center"><span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" /></div>}
                                            {url && <button onClick={() => setRoomPhotos(p => p.filter((_, idx) => idx !== i))}
                                                className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 flex items-center justify-center text-zinc-400 hover:text-red-400 transition">
                                                <Trash2 size={10} /></button>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">🏠 Property</p>
                                <button onClick={() => setStep(1)} className="text-[11px] text-orange-400 hover:text-orange-300 transition">Edit</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[13px]">
                                <div><p className="text-zinc-600 text-[11px]">Name</p><p className="text-white font-medium truncate">{propName}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Type</p><p className="text-white font-medium capitalize">{propType}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Cost</p><p className="text-white font-medium">₹{cost.toLocaleString("en-IN")}/mo</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Location</p><p className="text-white font-medium truncate">{city}, {state}</p></div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">🛏️ Room</p>
                                <button onClick={() => setStep(4)} className="text-[11px] text-orange-400 hover:text-orange-300 transition">Edit</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[13px]">
                                <div><p className="text-zinc-600 text-[11px]">Room Type</p><p className="text-white font-medium capitalize">{roomType}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Bed</p><p className="text-white font-medium capitalize">{bedType}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Rent</p><p className="text-orange-400 font-bold">₹{monthlyRent.toLocaleString("en-IN")}/mo</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Deposit</p><p className="text-white font-medium">₹{secDeposit.toLocaleString("en-IN")}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Capacity</p><p className="text-white font-medium">{capacity} person{capacity > 1 ? "s" : ""}</p></div>
                                <div><p className="text-zinc-600 text-[11px]">Available</p><p className="text-white font-medium">{startDate || "—"}</p></div>
                            </div>
                        </div>

                        {(propPhotos.filter(Boolean).length > 0 || roomPhotos.filter(Boolean).length > 0) && (
                            <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col gap-3">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500">📸 Photos</p>
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                    {[...propPhotos, ...roomPhotos].filter(Boolean).map((url, i) => (
                                        <img key={i} src={url} alt="" className="h-16 w-24 rounded-xl object-cover shrink-0 border border-white/5" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex items-start gap-3">
                            <Check size={14} className="text-orange-400 shrink-0 mt-0.5" />
                            <p className="text-[12px] text-zinc-500 leading-relaxed">
                                I confirm all information is accurate. False listings may be removed.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 mt-auto pt-4 pb-6">
                    <button type="button" onClick={back}
                        className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-5 py-3.5 text-[14px] font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition active:scale-95">
                        <ArrowLeft size={16} /> Back
                    </button>

                    {step < TOTAL_STEPS ? (
                        <button type="button" onClick={next}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button type="button" onClick={handleSubmit}
                            disabled={isPending || uploadingProp || uploadingRoom}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-60">
                            {isPending
                                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                : <><Check size={16} /> Create Property & Room</>
                            }
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CreateRoom;