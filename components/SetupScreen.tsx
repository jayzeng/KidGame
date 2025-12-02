import React, { useState, useEffect } from 'react';
import { AvatarIcon, AvatarType } from './AvatarIcon';
import { ArrowRight } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (p1Name: string, p1Avatar: string, p2Name: string, p2Avatar: string) => void;
}

const AVATAR_OPTIONS: AvatarType[] = ['axolotl', 'cat', 'dog', 'bunny', 'frog', 'panda'];

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [p1Name, setP1Name] = useState('Player 1');
  const [p1Avatar, setP1Avatar] = useState<AvatarType>('axolotl');
  
  const [p2Name, setP2Name] = useState('Player 2');
  const [p2Avatar, setP2Avatar] = useState<AvatarType>('cat');

  useEffect(() => {
    const savedP1Name = localStorage.getItem('sl_p1_name');
    const savedP1Avatar = localStorage.getItem('sl_p1_avatar') as AvatarType;
    const savedP2Name = localStorage.getItem('sl_p2_name');
    const savedP2Avatar = localStorage.getItem('sl_p2_avatar') as AvatarType;

    if (savedP1Name) setP1Name(savedP1Name);
    if (savedP1Avatar && AVATAR_OPTIONS.includes(savedP1Avatar)) setP1Avatar(savedP1Avatar);
    if (savedP2Name) setP2Name(savedP2Name);
    if (savedP2Avatar && AVATAR_OPTIONS.includes(savedP2Avatar)) setP2Avatar(savedP2Avatar);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1Name && p2Name) {
      // Persist to local storage
      localStorage.setItem('sl_p1_name', p1Name);
      localStorage.setItem('sl_p1_avatar', p1Avatar);
      localStorage.setItem('sl_p2_name', p2Name);
      localStorage.setItem('sl_p2_avatar', p2Avatar);

      onStartGame(p1Name, p1Avatar, p2Name, p2Avatar);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-indigo-100">
        <div className="bg-indigo-400 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="text-4xl font-black mb-2 relative z-10">Steps & Leaps</h1>
          <p className="opacity-90 font-medium relative z-10">Customize your adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Player 1 Setup */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-indigo-50 pb-2">
                <span className="bg-indigo-400 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm transform -rotate-3">1</span>
                <h2 className="text-2xl font-bold text-slate-700">Player 1</h2>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  onFocus={handleFocus}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-bold text-slate-700"
                  placeholder="Enter name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Choose Friend</label>
                <div className="grid grid-cols-3 gap-3">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={`p1-${avatar}`}
                      type="button"
                      onClick={() => setP1Avatar(avatar)}
                      className={`p-2 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        p1Avatar === avatar 
                          ? 'border-indigo-400 bg-indigo-50 scale-105 shadow-md' 
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                      }`}
                    >
                      <AvatarIcon type={avatar} className="w-10 h-10" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Player 2 Setup */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4 border-b-2 border-indigo-50 pb-2">
                <span className="bg-pink-400 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm transform rotate-3">2</span>
                <h2 className="text-2xl font-bold text-slate-700">Player 2</h2>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Name</label>
                <input
                  type="text"
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  onFocus={handleFocus}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all font-bold text-slate-700"
                  placeholder="Enter name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Choose Friend</label>
                <div className="grid grid-cols-3 gap-3">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <button
                      key={`p2-${avatar}`}
                      type="button"
                      onClick={() => setP2Avatar(avatar)}
                      className={`p-2 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        p2Avatar === avatar 
                          ? 'border-pink-400 bg-pink-50 scale-105 shadow-md' 
                          : 'border-slate-100 hover:border-pink-200 hover:bg-slate-50'
                      }`}
                    >
                      <AvatarIcon type={avatar} className="w-10 h-10" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              className="group relative px-10 py-5 bg-slate-800 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3"
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
