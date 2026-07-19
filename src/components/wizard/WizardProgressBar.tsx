interface WizardProgressBarProps {
  percent: number;
}

export function WizardProgressBar({ percent }: WizardProgressBarProps) {
  const filled = Math.round(percent / 5);
  const empty = 20 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/50">
          Production progress
        </p>
        <p className="text-sm tabular-nums text-amber-300">{percent}% complete</p>
      </div>
      <p className="mt-2 font-mono text-xs tracking-wider text-white/60">{bar}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
