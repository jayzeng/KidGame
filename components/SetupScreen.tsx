import React, { useState, useEffect } from 'react';
import { AvatarIcon, AvatarType } from './AvatarIcon';
import { ArrowRight, Brain, Sparkles, Bot } from 'lucide-react';
import { Difficulty } from '../types';

interface SetupScreenProps {
  onStartGame: (p1Name: string, p1Avatar: string, p2Name: string, p2Avatar: string, difficulty: Difficulty, vsComputer: boolean) => void;
}

const AVATAR_OPTIONS: AvatarType[] = ['axolotl', 'cat', 'dog', 'bunny', 'frog', 'panda'];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  // Use lazy initialization to read from localStorage reliably on first render
  const [p1Name, setP1Name] = useState(() => localStorage.getItem('sl_p1_name') || 'Player 1');
  const [p1Avatar, setP1Avatar] = useState<AvatarType>(() => {
    const saved = localStorage.getItem('sl_p1_avatar');
    return (saved && AVATAR_OPTIONS.includes(saved as AvatarType)) ? (saved as AvatarType) : 'axolotl';
  });

  const [vsComputer, setVsComputer] = useState(() => localStorage.getItem('sl_vs_computer') === 'true');

  const [p2Name, setP2Name] = useState(() => {
    const saved = localStorage.getItem('sl_p2_name');
    if (saved) return saved;
    return localStorage.getItem('sl_vs_computer') === 'true' ? 'Computer' : 'Player 2';
  });
  const [p2Avatar, setP2Avatar] = useState<AvatarType>(() => {
    const saved = localStorage.getItem('sl_p2_avatar');
    return (saved && AVATAR_OPTIONS.includes(saved as AvatarType)) ? (saved as AvatarType) : 'cat';
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('sl_difficulty');
    return (saved === Difficulty.HARD) ? Difficulty.HARD : Difficulty.EASY;
  });

  // Auto-save to localStorage whenever values change (real-time persistence)
  useEffect(() => {
    localStorage.setItem('sl_p1_name', p1Name);
    localStorage.setItem('sl_p1_avatar', p1Avatar);
    localStorage.setItem('sl_p2_name', p2Name);
    localStorage.setItem('sl_p2_avatar', p2Avatar);
    localStorage.setItem('sl_difficulty', difficulty);
    localStorage.setItem('sl_vs_computer', vsComputer ? 'true' : 'false');
  }, [p1Name, p1Avatar, p2Name, p2Avatar, difficulty, vsComputer]);

  useEffect(() => {
    if (vsComputer && (p2Name === 'Player 2' || p2Name.trim() === '')) {
      setP2Name('Computer');
    }
  }, [vsComputer]); // Only responds to toggle changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1Name && p2Name) {
      onStartGame(p1Name, p1Avatar, p2Name, p2Avatar, difficulty, vsComputer);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl overflow-hidden border-4 border-indigo-100">
        <div className="bg-indigo-400 p-6 md:p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 relative z-10">Steps & Leaps</h1>
          <p className="opacity-90 font-medium relative z-10 text-sm md:text-base">Customize your adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Player 1 Setup */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-indigo-50 pb-2">
                <span className="bg-indigo-400 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black shadow-sm transform -rotate-3 text-sm md:text-base">1</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700">Player 1</h2>
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  onFocus={handleFocus}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-bold shadow-sm"
                  placeholder="Enter name..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Choose Friend</label>
                <div className="grid grid-cols-6 md:grid-cols-3 gap-2 md:gap-3">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={`p1-${avatar}`}
                      type="button"
                      onClick={() => setP1Avatar(avatar)}
                      className={`p-2 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        p1Avatar === avatar 
                          ? 'border-indigo-400 bg-indigo-50 scale-105 shadow-md' 
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <AvatarIcon type={avatar} className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Player 2 Setup */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-indigo-50 pb-2">
                <span className="bg-pink-400 text-white w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black shadow-sm transform rotate-3 text-sm md:text-base">2</span>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700">Player 2</h2>
                {vsComputer && (
                  <span className="text-[10px] md:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    Computer
                  </span>
                )}
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  onFocus={handleFocus}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all font-bold shadow-sm"
                  placeholder="Enter name..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Choose Friend</label>
                <div className="grid grid-cols-6 md:grid-cols-3 gap-2 md:gap-3">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={`p2-${avatar}`}
                      type="button"
                      onClick={() => setP2Avatar(avatar)}
                      className={`p-2 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        p2Avatar === avatar 
                          ? 'border-pink-400 bg-pink-50 scale-105 shadow-md' 
                          : 'border-slate-100 hover:border-pink-200 hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <AvatarIcon type={avatar} className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-slate-100 pt-8">
            <label className="block text-center text-xs md:text-sm font-bold text-slate-400 mb-4 uppercase tracking-wide">Opponent</label>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => setVsComputer(false)}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 transition-all sm:w-64 ${
                  !vsComputer
                    ? 'border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full shrink-0 ${!vsComputer ? 'bg-blue-200 text-blue-700' : 'bg-slate-100'}`}>
                  <Sparkles size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm md:text-base ${!vsComputer ? 'text-blue-700' : 'text-slate-600'}`}>Two Players</div>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                    Both humans, pass-and-play
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVsComputer(true)}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 transition-all sm:w-64 ${
                  vsComputer
                    ? 'border-emerald-400 bg-emerald-50 shadow-md ring-2 ring-emerald-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full shrink-0 ${vsComputer ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-100'}`}>
                  <Bot size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm md:text-base ${vsComputer ? 'text-emerald-700' : 'text-slate-600'}`}>Single Player</div>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                    Computer auto-plays Player 2
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-slate-100 pt-8">
            <label className="block text-center text-xs md:text-sm font-bold text-slate-400 mb-4 uppercase tracking-wide">Game Difficulty</label>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                type="button"
                onClick={() => setDifficulty(Difficulty.EASY)}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 transition-all sm:w-64 ${
                  difficulty === Difficulty.EASY
                    ? 'border-green-400 bg-green-50 shadow-md ring-2 ring-green-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full shrink-0 ${difficulty === Difficulty.EASY ? 'bg-green-200 text-green-700' : 'bg-slate-100'}`}>
                  <Sparkles size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm md:text-base ${difficulty === Difficulty.EASY ? 'text-green-700' : 'text-slate-600'}`}>Easy Start</div>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                    Board: 50 squares<br/>
                    Ages 4-6<br/>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty(Difficulty.HARD)}
                className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl border-2 transition-all sm:w-64 ${
                  difficulty === Difficulty.HARD
                    ? 'border-violet-400 bg-violet-50 shadow-md ring-2 ring-violet-100'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400'
                }`}
              >
                 <div className={`p-2 rounded-full shrink-0 ${difficulty === Difficulty.HARD ? 'bg-violet-200 text-violet-700' : 'bg-slate-100'}`}>
                  <Brain size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className={`font-bold text-sm md:text-base ${difficulty === Difficulty.HARD ? 'text-violet-700' : 'text-slate-600'}`}>Big Adventure</div>
                  <div className="text-[10px] md:text-xs text-slate-500 font-medium mt-1">
                    Board: 100 squares<br/>
                    Ages 7-10<br/>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-8 md:mt-12 flex justify-center pb-8 md:pb-0">
            <button
              type="submit"
              className="w-full md:w-auto group relative px-10 py-4 md:py-5 bg-slate-800 text-white font-black text-lg md:text-xl rounded-2xl shadow-xl hover:bg-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Start Game!
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
