import { Briefcase, GraduationCap, Sparkles } from "lucide-react";

export const OccupationIcon = ({ status }: { status?: string }) => {
  if (!status) return null;
  const icons: Record<string, React.ReactNode> = {
    student:              <GraduationCap size={11} />,
    "working-professional": <Briefcase size={11} />,
    other:                <Sparkles size={11} />,
  };
  return (
    <span className="flex items-center gap-1 text-[11px] text-zinc-500">
      {icons[status] ?? <Sparkles size={11} />}
      <span className="capitalize">{status?.replace("-", " ")}</span>
    </span>
  );
};