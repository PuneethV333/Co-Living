import { CheckCircle2, Flame } from "lucide-react";

export const Badge = ({
  label,
  variant,
}: {
  label: string;
  variant: "verified" | "hot" | "type" | "shared" | "private" | "last" | "full";
}) => {
  const styles: Record<string, string> = {
    verified: "bg-green-500/15 text-green-400 border-green-500/20",
    hot: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    type: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    shared: "bg-purple-500/15 text-purple-400 border-purple-500/20",
    private: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
    last: "bg-red-500/15 text-red-400 border-red-500/20",
    full: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${styles[variant]}`}
    >
      {variant === "verified" && <CheckCircle2 size={9} />}
      {variant === "hot" && <Flame size={9} />}
      {label}
    </span>
  );
};