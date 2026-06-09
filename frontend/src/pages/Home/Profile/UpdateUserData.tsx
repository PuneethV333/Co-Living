/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import { Camera, ArrowLeft, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";;
import toast from "react-hot-toast";
import { useGetMe } from "../../../hooks/useAuth";
import { useUpdateUser } from "../../../hooks/useUser";
import type { UserType } from "../../../types/auth.types";
import { getImgUrl } from "../../../utils/getUrlImg";
import { Field } from "./Field";

const inputCls =
    "w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-[14px] text-white placeholder-zinc-600 outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition";



const UpdateUserData = () => {
    const navigate = useNavigate();
    const { data: user } = useGetMe();
    const { mutate: updateUser, isPending } = useUpdateUser();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [uploading, setUploading] = useState(false);

    const fileRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (!user) return;
        setName((user as UserType).name ?? "");
        setBio((user as UserType).bio ?? "");
        setEmail(user.email ?? "");
        setPhoneNumber((user as UserType).phoneNumber ?? "");
        setProfilePic(user.profilePic ?? "");
    }, [user]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be under 2MB");
            return;
        }

        setProfilePic(URL.createObjectURL(file));
        setUploading(true);
        try {
            const url = await getImgUrl(file);
            setProfilePic(url);
            toast.success("Photo uploaded");
        } catch {
            toast.error("Failed to upload photo");
            setProfilePic(user?.profilePic ?? "");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) { toast.error("Name is required"); return; }
        if (uploading) { toast.error("Please wait for photo to finish uploading"); return; }

        updateUser(
            { name, profilePic, bio, email, phoneNumber },
            { onSuccess: () => navigate(-1) },
        );
    };

    const hasChanges =
        name !== ((user as UserType)?.name ?? "") ||
        bio !== ((user as UserType)?.bio ?? "") ||
        email !== (user?.email ?? "") ||
        phoneNumber !== ((user as UserType)?.phoneNumber ?? "") ||
        profilePic !== (user?.profilePic ?? "");

    return (
        <div className="flex flex-col min-h-[calc(100dvh-4rem)] bg-[#0A0F1C]">

            <div className="sticky top-16 z-10 bg-[#0A0F1C] border-b border-white/5 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition"
                    >
                        <ArrowLeft size={15} />
                    </button>
                    <div>
                        <p className="text-[13px] font-semibold text-white">Edit Profile</p>
                        <p className="text-[11px] text-zinc-600">Update your personal info</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isPending || uploading || !hasChanges}
                    className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-orange-400 transition shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending
                        ? <Loader2 size={14} className="animate-spin" />
                        : <Save size={14} />
                    }
                    {isPending ? "Saving…" : "Save"}
                </button>
            </div>


            <div className="flex-1 max-w-lg mx-auto w-full px-5 py-6 flex flex-col gap-7">


                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt="avatar"
                                className="h-24 w-24 rounded-3xl object-cover ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="h-24 w-24 rounded-3xl bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-500 ring-2 ring-white/10">
                                {name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        )}


                        {uploading && (
                            <div className="absolute inset-0 rounded-3xl bg-black/60 flex items-center justify-center">
                                <span className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 hover:bg-orange-400 transition disabled:opacity-60"
                        >
                            <Camera size={14} className="text-white" />
                        </button>
                    </div>
                    <input
                        title="file"
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="text-[12px] font-medium text-orange-400 hover:text-orange-300 transition disabled:opacity-50"
                    >
                        {uploading ? "Uploading…" : "Change photo"}
                    </button>
                </div>

                <div className="h-px bg-white/5" />


                <Field label="Full Name" hint="This is how other members will see you">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ravi Kumar"
                        className={inputCls}
                    />
                </Field>

                <Field label="Bio" hint="Optional — tell others a bit about yourself">
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Software engineer looking for a quiet co-living space in Bengaluru…"
                        rows={3}
                        className={`${inputCls} resize-none`}
                    />
                    <p className="text-[11px] text-zinc-700 text-right">{bio.length}/300</p>
                </Field>

                <Field label="Email Address">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className={inputCls}
                    />
                </Field>

                <Field label="Phone Number">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-3 shrink-0">
                            <span className="text-base">🇮🇳</span>
                            <span className="text-[13px] text-zinc-500">+91</span>
                        </div>
                        <input
                            type="tel"
                            value={phoneNumber.replace(/^\+91/, "")}
                            onChange={(e) =>
                                setPhoneNumber(`+91${e.target.value.replace(/\D/g, "").slice(0, 10)}`)
                            }
                            placeholder="98765 43210"
                            className={`${inputCls} flex-1`}
                        />
                    </div>
                </Field>

                <div className="h-px bg-white/5" />


                <button
                    onClick={handleSubmit}
                    disabled={isPending || uploading || !hasChanges}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-[14px] font-bold text-white hover:bg-orange-400 transition shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving…</>
                    ) : (
                        <><Save size={16} /> Save Changes</>
                    )}
                </button>


                {!hasChanges && !isPending && (
                    <p className="text-center text-[12px] text-zinc-700">No changes to save</p>
                )}
            </div>
        </div>
    );
};

export default UpdateUserData;