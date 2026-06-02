export const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <h2 className="text-[16px] font-bold text-white">{title}</h2>
      <div className="flex-1 h-px bg-white/5" />
    </div>
    {children}
  </div>
);