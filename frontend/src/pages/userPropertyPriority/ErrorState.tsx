export const ErrorState = () => (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <span className="text-4xl">⚠️</span>
    <div>
      <p className="text-[15px] font-semibold text-white">Couldn't load roommates</p>
      <p className="text-[13px] text-zinc-500 mt-1">
        Make sure you've completed the preference survey first.
      </p>
    </div>
    <a
      href="/home/survey"
      className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[13px] font-medium text-zinc-300 hover:text-white transition"
    >
      Complete Survey
    </a>
  </div>
);