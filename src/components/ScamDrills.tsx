import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  Award,
  Flame,
  ArrowRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { SCAM_DRILLS, DRILL_LEVELS } from '../lib/drillsData';
import { ScamDrill } from '../lib/types';

export const ScamDrills: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | 4>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const levelDrills = SCAM_DRILLS.filter(d => d.level === selectedLevel);
  const currentDrill: ScamDrill = levelDrills[currentIndex] || levelDrills[0];

  const handleAnswer = (choseScam: boolean) => {
    if (userAnswer !== null) return;
    setUserAnswer(choseScam);

    const isCorrect = choseScam === currentDrill.isScam;
    if (isCorrect) {
      setStreak(prev => prev + 1);
      setTotalScore(prev => prev + (selectedLevel * 100) + (streak * 20));
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setUserAnswer(null);
    if (currentIndex < levelDrills.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop or advance level
      setCurrentIndex(0);
    }
  };

  const handleSelectLevel = (lvl: 1 | 2 | 3 | 4) => {
    setSelectedLevel(lvl);
    setCurrentIndex(0);
    setUserAnswer(null);
  };

  const isAnswered = userAnswer !== null;
  const isCorrect = isAnswered && (userAnswer === currentDrill.isScam);

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-2">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Target className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Scam Drills: Spot the Threat
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Progressive scenario training to develop instinctual defense against real-world social engineering.
          </p>
        </div>

        {/* Gamified Score & Streak Badges */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
            <span className="tabular-nums text-xs font-semibold text-slate-700 dark:text-slate-300">
              Streak: {streak}
            </span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 dark:border-blue-900 dark:bg-blue-950 shadow-xs">
            <Award className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="tabular-nums text-xs font-semibold text-blue-700 dark:text-blue-300">
              Score: {totalScore}
            </span>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DRILL_LEVELS.map((lvl) => {
          const isSelected = selectedLevel === lvl.level;
          return (
            <button
              key={lvl.level}
              type="button"
              onClick={() => handleSelectLevel(lvl.level)}
              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 dark:border-blue-500 dark:bg-blue-950/40 dark:text-white shadow-xs font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold">Level {lvl.level}</span>
                <span className={`text-[10px] rounded px-1.5 py-0.2 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {lvl.level === 1 ? 'Beginner' : lvl.level === 2 ? 'Intermediate' : lvl.level === 3 ? 'Advanced' : 'Expert'}
                </span>
              </div>
              <span className="mt-1 text-xs line-clamp-1">
                {lvl.level === 1 ? 'Fundamentals' : lvl.level === 2 ? 'Urgent Smishing' : lvl.level === 3 ? 'Advanced Spoofing' : 'Spear & Quishing'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Drill Scenario Card: Outer rounded-xl (12px), p-6 (24px) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        {/* Scenario Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                {currentDrill.levelName}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Scenario {currentIndex + 1} of {levelDrills.length}
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {currentDrill.title}
            </h2>
          </div>
        </div>

        {/* Context / Scenario description */}
        <div className="rounded-lg bg-slate-50 p-4 text-xs font-medium text-slate-700 dark:bg-slate-850 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white">Scenario Context: </span>
          {currentDrill.scenario}
        </div>

        {/* Visual Simulated Payload Card */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
          {currentDrill.sender && (
            <div className="mb-2 pb-2 border-b border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span><strong>Sender:</strong> {currentDrill.sender}</span>
            </div>
          )}
          <div className="font-mono text-xs text-slate-900 dark:text-slate-100 break-all select-all">
            {currentDrill.content}
          </div>
        </div>

        {/* Interactive Answer Buttons */}
        {!isAnswered ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-lg border-2 border-emerald-600 bg-white px-5 py-3 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600 active:bg-emerald-100 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            >
              <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
              <span>Verify as Legitimate</span>
            </button>

            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="flex w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-600 bg-white px-5 py-3 text-xs font-bold text-red-700 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-600 active:bg-red-100 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <ShieldAlert className="h-4.5 w-4.5" aria-hidden="true" />
              <span>Flag as Malicious Scam</span>
            </button>
          </div>
        ) : (
          /* Instant Feedback & Breakdown */
          <div className="space-y-4 pt-1">
            <div
              className={`rounded-lg border p-4 ${
                isCorrect
                  ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
                  : 'border-red-300 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30'
              }`}
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                )}
                <div>
                  <h3 className={`text-sm font-bold ${isCorrect ? 'text-emerald-950 dark:text-emerald-200' : 'text-red-950 dark:text-red-200'}`}>
                    {isCorrect ? 'Correct Analysis' : 'Caution: Deceptive Lure'}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                    {currentDrill.explanation}
                  </p>
                </div>
              </div>

              {/* Red Flags or Safe Indicators */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {currentDrill.isScam ? 'Identified Red Flags' : 'Key Trust Indicators'}
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(currentDrill.isScam ? currentDrill.redFlags : currentDrill.safeIndicators).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 active:bg-blue-800"
              >
                <span>Next Scenario</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
