export const OtpBoxes = ({
        values, refs, onChange, onKeyDown,
    }: {
        values: string[];
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
        onChange: (i: number, v: string) => void;
        onKeyDown: (i: number, e: React.KeyboardEvent) => void;
    }) => (
        <div className="flex gap-2.5 justify-between">
            {values.map((digit, i) => (
                <input
                    title="otp digit"
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onChange(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    className="h-12 w-full max-w-11.5 rounded-xl border border-zinc-700/50 bg-zinc-800/60 text-center text-lg font-bold text-white outline-none focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 transition caret-orange-500"
                />
            ))}
        </div>
    );