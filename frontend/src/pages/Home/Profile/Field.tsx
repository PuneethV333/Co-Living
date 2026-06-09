export const Field = ({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            {label}
        </label>
        {children}
        {hint && <p className="text-[11px] text-zinc-700">{hint}</p>}
    </div>
);