export function AgentAvatar() {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl p-6 text-center">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-plum via-saffron to-mint">
        <div className="h-16 w-16 rounded-full bg-slate-950/80" />
        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-mint ring-4 ring-slate-950" />
      </div>
      <div className="text-lg font-semibold">Tutor Avatar</div>
      <p className="mt-2 text-sm text-white/65">
        A placeholder for the future AI guide, voice, and feedback loop.
      </p>
    </div>
  );
}
