// @ts-nocheck React typings are not installed in this project.
import { useState } from 'react';
import { getCityInsight } from '../services/geminiService';

interface GeminiInsightProps {
  cityName: string;
  currentTime: string;
}

export const GeminiInsight = ({ cityName, currentTime }: GeminiInsightProps) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const text = await getCityInsight(cityName, currentTime);
    setInsight(text);
    setLoading(false);
  };

  return (
    <div className="mt-4 min-h-15">
      {!insight && !loading && (
        <button
          onClick={fetchInsight}
          className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z" clipRule="evenodd" />
          </svg>
          Ask AI: "What's the vibe?"
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
          Consulting Gemini...
        </div>
      )}

      {insight && (
        <div className="text-xs text-slate-300 italic border-l-2 border-primary-500 pl-3 py-1 bg-white/5 rounded-r">
          "{insight}"
        </div>
      )}
    </div>
  );
};
