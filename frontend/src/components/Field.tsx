export const Field = ({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
      {label}{required && <span className="text-orange-400 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-zinc-700">{hint}</p>}
  </div>
);