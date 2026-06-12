/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Camera,
  Building2,
  GraduationCap,
  Briefcase,
  Sparkles,
  Phone,
  CheckCircle2,
  RefreshCw,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

import Spinner from "../../components/Spinner";
import {
  useCompleteOnBoarding,
  useSendOtp,
  useVerifyOtp,
  useSendViaEmailOtp,
  useVerifyViaEmailOtp,
} from "../../hooks/useAuth";
import type {
  completeOnBoardingPayloadType,
  Role,
  Step1Data,
  Step2OwnerData,
  Step2TenantData,
} from "../../types/onBoarding.types";
import { getImgUrl } from "../../utils/getUrlImg";
import { Auth } from "../../config/firebase.config";
import { StepBar } from "../../components/StepVar";
import { OtpBoxes } from "./OtpBoxes";

type VerifyMethod = "phone" | "email";

const OnBoarding = () => {
  const { mutate: onBoard, isPending } = useCompleteOnBoarding();
  const { mutateAsync: sendOtp, isPending: sendingOtp } = useSendOtp();
  const { mutateAsync: verifyOtp, isPending: verifyingOtp } = useVerifyOtp();
  const { mutateAsync: sendEmailOtp, isPending: sendingEmail } =
    useSendViaEmailOtp();
  const { mutateAsync: verifyEmailOtp, isPending: verifyingEmail } =
    useVerifyViaEmailOtp();

  const [step, setStep] = useState(1);
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>("phone");

  const [s1, setS1] = useState<Step1Data>({
    profilePic: "",
    profileFile: null,
    name: "",
    dob: "",
    role: "Tenant",
    bio: "",
  });
  const [s2Tenant, setS2Tenant] = useState<Step2TenantData>({
    occupationStatus: "student",
    monthlyIncome: 30000,
  });
  const [s2Owner, setS2Owner] = useState<Step2OwnerData>({ businessName: "" });

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isVerified = verifyMethod === "phone" ? otpVerified : emailOtpVerified;
  const userEmail = Auth.currentUser?.email ?? "";

  useEffect(() => {
    const displayName = Auth.currentUser?.displayName;
    if (displayName) setS1((p) => ({ ...p, name: displayName }));
  }, []);

  const switchMethod = (method: VerifyMethod) => {
    setVerifyMethod(method);
    setOtp(["", "", "", "", "", ""]);
    setEmailOtp(["", "", "", "", "", ""]);
    setOtpSent(false);
    setEmailOtpSent(false);
    setOtpVerified(false);
    setEmailOtpVerified(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
  const formatIncome = (v: number) =>
    v >= 200000 ? "₹2L+" : `₹${v.toLocaleString("en-IN")}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setS1((p) => ({ ...p, profilePic: localPreview, profileFile: file }));
    setUploadingPhoto(true);
    try {
      const cdnUrl = await getImgUrl(file);
      setS1((p) => ({ ...p, profilePic: cdnUrl }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Failed to upload photo. Try again.");
      setS1((p) => ({ ...p, profilePic: "", profileFile: null }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateStep1 = () => {
    if (!s1.name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!s1.dob) {
      toast.error("Please enter your date of birth");
      return false;
    }
    const age = new Date().getFullYear() - new Date(s1.dob).getFullYear();
    if (age < 16) {
      toast.error("You must be at least 16 years old");
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    if (s1.role === "Owner" && !s2Owner.businessName.trim()) {
      toast.error("Please enter your business name");
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (otpSent) setOtp(["", "", "", "", "", ""]);
    try {
      const res = await sendOtp(formattedPhone);
      if (res?.success) {
        setOtpSent(true);
        toast.success("OTP sent!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  const handleOtpChange = (
    index: number,
    value: string,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
  ) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...current];
    next[index] = value.slice(-1);
    setter(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    current: string[],
  ) => {
    if (e.key === "Backspace" && !current[index] && index > 0)
      refs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Enter the full 6-digit OTP");
      return;
    }
    try {
      const res = await verifyOtp({ phone: formattedPhone, otp: code });
      if (res?.success) {
        setOtpVerified(true);
        toast.success("Phone verified!");
      }
    } catch {
      toast.error("Invalid OTP. Try again.");
    }
  };

  const handleSendEmailOtp = async () => {
    if (!userEmail) {
      toast.error("No email found on your account");
      return;
    }
    if (emailOtpSent) setEmailOtp(["", "", "", "", "", ""]);
    try {
      const res = await sendEmailOtp(userEmail);
      if (res?.success) {
        setEmailOtpSent(true);
        toast.success(`OTP sent to ${userEmail}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    const code = emailOtp.join("");
    if (code.length < 6) {
      toast.error("Enter the full 6-digit OTP");
      return;
    }
    try {
      const res = await verifyEmailOtp({ email: userEmail, otp: code });
      if (res?.success) {
        setEmailOtpVerified(true);
        toast.success("Email verified!");
      }
    } catch {
      toast.error("Invalid OTP. Try again.");
    }
  };

  const handleSubmit = () => {
    if (!isVerified) {
      toast.error("Please verify your identity");
      return;
    }
    if (uploadingPhoto) {
      toast.error("Please wait for the photo to finish uploading");
      return;
    }

    const payload: completeOnBoardingPayloadType = {
      name: s1.name,
      email: Auth.currentUser?.email ?? undefined,
      profilePic:
        s1.profilePic || "https://api.dicebear.com/7.x/thumbs/svg?seed=user",
      dob: new Date(s1.dob),
      role: s1.role,
      bio: s1.bio || undefined,
      phoneNumber: verifyMethod === "phone" ? formattedPhone : undefined,
      verified: true,
      ...(s1.role === "Tenant"
        ? {
            tenantProfile: {
              occupationStatus: s2Tenant.occupationStatus,
              monthlyIncome: s2Tenant.monthlyIncome,
            },
          }
        : { ownerProfile: { businessName: s2Owner.businessName } }),
    };

    onBoard(payload);
  };

  if (isPending) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col">
      <header className="sticky top-0 z-20 bg-[#111111]/90 backdrop-blur border-b border-zinc-800/50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-sm font-bold">C</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Co-Living
          </span>
        </div>
        <span className="text-[13px] text-zinc-500 font-medium">
          Step {step} of 3
        </span>
      </header>

      <div className="px-5 pt-3">
        <StepBar current={step} total={3} />
      </div>

      <main className="flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full">
        {/* ════ STEP 1 ════ */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Step 1 — Profile
              </p>
              <h1 className="text-2xl font-bold">Set up your profile</h1>
              <p className="mt-1 text-[13px] text-zinc-500">
                This is how other members and property owners will see you.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="relative h-14 w-14 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-zinc-600 hover:border-orange-500 transition group disabled:cursor-not-allowed"
              >
                {s1.profilePic ? (
                  <img
                    src={s1.profilePic}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera
                    size={20}
                    className="text-zinc-500 group-hover:text-orange-400 transition"
                  />
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  </div>
                )}
              </button>
              <input
                title="profile photo"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex-1">
                <p className="text-[13px] font-semibold">Profile Photo</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  JPG, PNG or WEBP · Max 2MB
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="mt-2 rounded-lg border border-zinc-700 px-3 py-1 text-[12px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingPhoto ? "Uploading…" : "Choose photo"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                Full Name
              </label>
              <input
                value={s1.name}
                onChange={(e) => setS1((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ravi Kumar"
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Date of Birth
                </label>
                <input
                  title="date of birth"
                  type="date"
                  value={s1.dob}
                  max={today}
                  onChange={(e) =>
                    setS1((p) => ({ ...p, dob: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-zinc-300 outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition scheme-dark"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Role
                </label>
                <select
                  title="role"
                  value={s1.role}
                  onChange={(e) =>
                    setS1((p) => ({ ...p, role: e.target.value as Role }))
                  }
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-zinc-300 outline-none focus:border-orange-500/70 transition scheme-dark"
                >
                  <option value="Tenant">🔥 Tenant</option>
                  <option value="Owner">🏠 Owner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                Bio{" "}
                <span className="normal-case font-normal text-zinc-600">
                  (optional)
                </span>
              </label>
              <textarea
                value={s1.bio}
                onChange={(e) => setS1((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Hey! I'm a software engineer looking for a quiet, clean space in Bengaluru..."
                rows={3}
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition resize-none"
              />
            </div>
          </div>
        )}

        {/* ════ STEP 2 TENANT ════ */}
        {step === 2 && s1.role === "Tenant" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Step 2 — Your Lifestyle
              </p>
              <h1 className="text-2xl font-bold">Tell us about yourself</h1>
              <p className="mt-1 text-[13px] text-zinc-500">
                Helps us match you with compatible roommates and properties.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 w-fit">
              <span>🔥</span>
              <span className="text-[13px] font-semibold text-orange-300">
                Tenant Profile
              </span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                Occupation Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    {
                      value: "student",
                      label: "Student",
                      icon: <GraduationCap size={22} />,
                    },
                    {
                      value: "working-professional",
                      label: "Working Professional",
                      icon: <Briefcase size={22} />,
                    },
                    {
                      value: "other",
                      label: "Other",
                      icon: <Sparkles size={22} />,
                    },
                  ] as const
                ).map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setS2Tenant((p) => ({ ...p, occupationStatus: value }))
                    }
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all duration-200 ${
                      s2Tenant.occupationStatus === value
                        ? "border-orange-500 bg-orange-500/10 text-orange-300 shadow-md shadow-orange-500/10"
                        : "border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    <span
                      className={
                        s2Tenant.occupationStatus === value
                          ? "text-orange-400"
                          : "text-zinc-500"
                      }
                    >
                      {icon}
                    </span>
                    <span className="text-[11px] font-semibold leading-tight">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                Monthly Income{" "}
                <span className="normal-case font-normal text-zinc-600">
                  (optional)
                </span>
              </label>
              <p className="text-3xl font-bold mb-1">
                {formatIncome(s2Tenant.monthlyIncome)}
              </p>
              <p className="text-[12px] text-zinc-500 mb-4">per month</p>
              <input
                title="monthly income"
                type="range"
                min={0}
                max={200000}
                step={5000}
                value={s2Tenant.monthlyIncome}
                onChange={(e) =>
                  setS2Tenant((p) => ({ ...p, monthlyIncome: +e.target.value }))
                }
                className="w-full accent-orange-500 h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-zinc-600">₹0</span>
                <span className="text-[11px] text-zinc-600">₹2L+</span>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2 OWNER ════ */}
        {step === 2 && s1.role === "Owner" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Step 2 — Your Business
              </p>
              <h1 className="text-2xl font-bold">
                Tell us about your business
              </h1>
              <p className="mt-1 text-[13px] text-zinc-500">
                This helps tenants trust your listings and builds your
                reputation.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 w-fit">
              <span>🏠</span>
              <span className="text-[13px] font-semibold text-orange-300">
                Owner Profile
              </span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold">Business Details</p>
                  <p className="text-[12px] text-zinc-500">
                    Displayed on all your property listings
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                  Business Name
                </label>
                <input
                  value={s2Owner.businessName}
                  onChange={(e) => setS2Owner({ businessName: e.target.value })}
                  placeholder="e.g. Ravi Properties Pvt. Ltd."
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 3 — VERIFY ════ */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Step 3 — Verify Account
              </p>
              <h1 className="text-2xl font-bold">Verify your identity</h1>
              <p className="mt-1 text-[13px] text-zinc-500">
                Choose how you'd like to verify your account.
              </p>
            </div>

            {/* ── Method selector ── */}
            <div className="flex gap-3">
              {[
                {
                  method: "phone" as VerifyMethod,
                  icon: <Phone size={15} />,
                  label: "Phone OTP",
                  sub: "Via SMS",
                },
                {
                  method: "email" as VerifyMethod,
                  icon: <Mail size={15} />,
                  label: "Email OTP",
                  sub: userEmail
                    ? `To ${userEmail.split("@")[0]}…`
                    : "Via email",
                },
              ].map(({ method, icon, label, sub }) => (
                <button
                  key={method}
                  onClick={() => switchMethod(method)}
                  className={`flex-1 flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                    verifyMethod === method
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/8 bg-white/3 hover:border-white/15"
                  }`}
                >
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${verifyMethod === method ? "bg-orange-500" : "bg-zinc-800"}`}
                  >
                    <span className="text-white">{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-semibold ${verifyMethod === method ? "text-white" : "text-zinc-400"}`}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] text-zinc-600 truncate">{sub}</p>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ml-auto shrink-0 ${verifyMethod === method ? "border-orange-500" : "border-zinc-600"}`}
                  >
                    {verifyMethod === method && (
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* ── PHONE flow ── */}
            {verifyMethod === "phone" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-3 py-3 shrink-0">
                      <span>🇮🇳</span>
                      <span className="text-[13px] text-zinc-400">+91</span>
                    </div>
                    <input
                      value={phone}
                      onChange={(e) => {
                        setPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        );
                        if (otpSent) {
                          setOtpSent(false);
                          setOtpVerified(false);
                          setOtp(["", "", "", "", "", ""]);
                        }
                      }}
                      placeholder="98765 43210"
                      className="flex-1 rounded-xl border border-zinc-700/50 bg-zinc-800/60 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                    <button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || phone.length < 10}
                      className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-3 text-[13px] font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50 active:scale-95 whitespace-nowrap"
                    >
                      {sendingOtp ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : otpSent ? (
                        <>
                          <RefreshCw size={14} /> Resend
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                      Enter OTP sent to +91{phone}
                    </label>
                    <OtpBoxes
                      values={otp}
                      refs={otpRefs}
                      onChange={(i, v) =>
                        handleOtpChange(i, v, otpRefs, setOtp, otp)
                      }
                      onKeyDown={(i, e) => handleOtpKeyDown(i, e, otpRefs, otp)}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      disabled={verifyingOtp || otp.join("").length < 6}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-[14px] font-semibold text-white hover:bg-zinc-700 transition disabled:opacity-50"
                    >
                      {verifyingOtp ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                )}

                {otpVerified && (
                  <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <CheckCircle2
                      size={20}
                      className="text-green-400 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-green-300">
                        Phone verified!
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        +91{phone} is confirmed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── EMAIL flow ── */}
            {verifyMethod === "email" && (
              <div className="flex flex-col gap-4">
                {/* Email display */}
                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 flex items-center gap-3">
                  <Mail size={16} className="text-orange-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-zinc-500">Sending OTP to</p>
                    <p className="text-[14px] font-semibold text-white truncate">
                      {userEmail || "No email on account"}
                    </p>
                  </div>
                  <button
                    onClick={handleSendEmailOtp}
                    disabled={sendingEmail || !userEmail || emailOtpVerified}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-[12px] font-semibold text-white hover:bg-orange-400 transition disabled:opacity-50 active:scale-95 whitespace-nowrap shrink-0"
                  >
                    {sendingEmail ? (
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : emailOtpSent ? (
                      <>
                        <RefreshCw size={12} /> Resend
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>

                {emailOtpSent && !emailOtpVerified && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                      Enter OTP sent to {userEmail}
                    </label>
                    <OtpBoxes
                      values={emailOtp}
                      refs={emailOtpRefs}
                      onChange={(i, v) =>
                        handleOtpChange(
                          i,
                          v,
                          emailOtpRefs,
                          setEmailOtp,
                          emailOtp,
                        )
                      }
                      onKeyDown={(i, e) =>
                        handleOtpKeyDown(i, e, emailOtpRefs, emailOtp)
                      }
                    />
                    <button
                      onClick={handleVerifyEmailOtp}
                      disabled={verifyingEmail || emailOtp.join("").length < 6}
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 py-3 text-[14px] font-semibold text-white hover:bg-zinc-700 transition disabled:opacity-50"
                    >
                      {verifyingEmail ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        "Verify OTP"
                      )}
                    </button>
                  </div>
                )}

                {emailOtpVerified && (
                  <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <CheckCircle2
                      size={20}
                      className="text-green-400 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-green-300">
                        Email verified!
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {userEmail} is confirmed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {s1.role === "Owner" && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 flex gap-3">
                <span className="text-orange-400 shrink-0 mt-0.5">⚠️</span>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  Bank details are used only for payout processing. Payouts
                  activate once your first listing goes live.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/60 px-5 py-3.5 text-[14px] font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition active:scale-95"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={() => {
              if (step === 1) {
                if (validateStep1()) setStep(2);
              } else if (step === 2) {
                if (validateStep2()) setStep(3);
              } else {
                handleSubmit();
              }
            }}
            disabled={step === 3 && !isVerified}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? (
              isVerified ? (
                <>
                  <CheckCircle2 size={16} /> Complete Setup
                </>
              ) : (
                "Complete Setup"
              )
            ) : (
              <>
                Continue <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnBoarding;
