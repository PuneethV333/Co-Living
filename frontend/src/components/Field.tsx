export const Field = ({
  label, required, children,
}: {
  label: string; required?: boolean; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
      {label} {required && <span className="text-orange-400">*</span>}
    </label>
    {children}
  </div>
);
