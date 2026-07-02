"use client";

import { CheckCircle2, Mic, PenTool, Play, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AgentAvatar } from "@/components/AgentAvatar";
import { ProgressBar } from "@/components/ProgressBar";
import { letters, stageLabels } from "@/lib/letters";
import type { LessonStage } from "@/types";

const stages: LessonStage[] = ["learn", "recognize", "write", "quiz"];

export function LessonScreen() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [stage, setStage] = useState<LessonStage>("learn");
  const [selected, setSelected] = useState<string | null>(null);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(4);

  const currentLetter = letters[currentLetterIndex];
  const progress = Math.round(((currentLetterIndex + 1) / letters.length) * 100);

  const choices = useMemo(() => {
    const pool = letters
      .filter((letter) => letter.character !== currentLetter.character)
      .slice(0, 3);
    return [currentLetter, ...pool].sort(() => Math.random() - 0.5);
  }, [currentLetter]);

  const submitChoice = (character: string) => {
    setSelected(character);
    if (character === currentLetter.character) {
      setXp((value) => value + 10);
      setStreak((value) => value + 1);
    }
  };

  const nextLetter = () => {
    setSelected(null);
    setCurrentLetterIndex((value) => (value + 1) % letters.length);
    setStage("learn");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <header className="glass flex flex-col gap-4 rounded-[2rem] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">
            Punjabi Teacher
          </p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">
            Learn Gurmukhi with a simple, focused lesson flow.
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <Badge icon={<Sparkles size={14} />} label="AI off for now" />
          <Badge icon={<Mic size={14} />} label="Voice later" />
          <Badge icon={<PenTool size={14} />} label="Writing later" />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <ProgressBar xp={xp} streak={streak} progress={progress} />

          <div className="glass rounded-[2rem] p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                  Current lesson
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {currentLetter.character} - {currentLetter.name}
                </h2>
              </div>
              <div className="flex gap-2 rounded-full bg-black/20 p-1">
                {stageLabels.map((label, index) => (
                  <button
                    key={label}
                    onClick={() => setStage(stages[index])}
                    className={`rounded-full px-3 py-1 text-sm transition ${
                      stage === stages[index]
                        ? "bg-white text-slate-950"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 p-6">
                <div className="text-8xl font-bold leading-none text-mango md:text-[8.5rem]">
                  {currentLetter.character}
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
                  This scaffold shows the learning flow, progress, and
                  interaction states. The LLM, TTS, and STT integrations will be
                  connected later.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ActionButton icon={<Play size={16} />} label="Play sample" />
                  <ActionButton icon={<CheckCircle2 size={16} />} label="Mark learned" />
                </div>
              </div>

              <div className="min-w-[220px]">
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Pronunciation
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-mint">
                    {currentLetter.pronunciation}
                  </div>
                  <div className="mt-4 text-sm text-white/60">
                    Order #{currentLetter.order}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass rounded-[2rem] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pick the letter</h3>
                <span className="text-sm text-white/50">Local interaction only</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {choices.map((letter) => {
                  const isSelected = selected === letter.character;
                  const isCorrect = selected === currentLetter.character && isSelected;
                  return (
                    <button
                      key={letter.character}
                      onClick={() => submitChoice(letter.character)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? isCorrect
                            ? "border-mint bg-mint/15"
                            : "border-rose-400 bg-rose-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="text-3xl font-bold">{letter.character}</div>
                      <div className="mt-2 text-sm text-white/65">{letter.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6">
              <h3 className="mb-4 text-lg font-semibold">Trace area</h3>
              <div className="flex h-52 items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20">
                <div className="text-center text-white/45">
                  <PenTool className="mx-auto mb-3" size={28} />
                  Canvas placeholder for future handwriting input
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-6">
          <AgentAvatar />

          <div className="glass rounded-[2rem] p-6">
            <h3 className="mb-4 text-lg font-semibold">Lesson queue</h3>
            <div className="grid gap-3">
              {letters.map((letter, index) => (
                <button
                  key={letter.character}
                  onClick={() => {
                    setCurrentLetterIndex(index);
                    setSelected(null);
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    index === currentLetterIndex
                      ? "border-saffron bg-saffron/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div>
                    <div className="text-xl font-semibold">{letter.character}</div>
                    <div className="text-sm text-white/55">{letter.name}</div>
                  </div>
                  <div className="text-sm text-white/45">#{letter.order}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={nextLetter}
            className="rounded-2xl bg-gradient-to-r from-plum to-saffron px-5 py-4 font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            Next letter
          </button>
        </aside>
      </section>
    </main>
  );
}

function Badge({
  icon,
  label
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      {icon}
      {label}
    </span>
  );
}

function ActionButton({
  icon,
  label
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10">
      {icon}
      {label}
    </button>
  );
}
