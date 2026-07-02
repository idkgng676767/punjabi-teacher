type ProgressBarProps = {
  xp: number;
  streak: number;
  progress: number;
};

export function ProgressBar({ xp, streak, progress }: ProgressBarProps) {
  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center justify-between text-sm text-white/70">
        <span>Daily progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-saffron via-mango to-mint"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="XP" value={xp} />
        <Stat label="Streak" value={`${streak} days`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-black/20 p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
