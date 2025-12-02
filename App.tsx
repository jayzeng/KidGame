import React, { useState, useEffect, useRef } from 'react';
import { Dice } from './components/Dice';
import { Spinner } from './components/Spinner';
import { Board } from './components/Board';
import { SetupScreen } from './components/SetupScreen';
import { AvatarIcon } from './components/AvatarIcon';
import { GameState, GamePhase, Player, PlayerId, Difficulty } from './types';
import { getMathFact } from './services/geminiService';
import { audioService } from './services/audioService';
import { Award, RefreshCcw, MessageSquare, Volume2 } from 'lucide-react';

const INITIAL_STATE: GameState = {
  players: {
    [PlayerId.ONE]: { id: PlayerId.ONE, name: 'Player 1', position: 1, color: '#3b82f6', avatar: 'axolotl' },
    [PlayerId.TWO]: { id: PlayerId.TWO, name: 'Player 2', position: 1, color: '#ef4444', avatar: 'cat' },
  },
  currentPlayerId: PlayerId.ONE,
  phase: GamePhase.SETUP,
  diceValues: [1, 1],
  spinValue: 0,
  winner: null,
  logs: [],
  difficulty: Difficulty.EASY,
};

// --- GAME CONFIGURATIONS ---

const EASY_LADDERS: Record<number, number> = {
  3: 12,
  15: 25,
  22: 38,
  34: 46
};

const EASY_MONSTERS: Record<number, number> = {
  18: 8,
  29: 13,
  42: 21,
  49: 30
};

const HARD_LADDERS: Record<number, number> = {
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  51: 67,
  71: 91,
  80: 100
};

const HARD_MONSTERS: Record<number, number> = {
  17: 7,
  36: 6,
  45: 25,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 79
};

const getGameConfig = (difficulty: Difficulty) => {
  if (difficulty === Difficulty.EASY) {
    return {
      maxScore: 50,
      ladders: EASY_LADDERS,
      monsters: EASY_MONSTERS,
    };
  }
  return {
    maxScore: 100,
    ladders: HARD_LADDERS,
    monsters: HARD_MONSTERS,
  };
};

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isRolling, setIsRolling] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Derived config
  const gameConfig = getGameConfig(gameState.difficulty);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.logs]);

  const addLog = (msg: string) => {
    setGameState(prev => ({ ...prev, logs: [...prev.logs, msg] }));
  };

  const getSpecialMoves = () => {
    const moves = [];
    for (const [start, end] of Object.entries(gameConfig.ladders)) {
      moves.push({ start: parseInt(start), end: end, type: 'ladder' as const });
    }
    for (const [start, end] of Object.entries(gameConfig.monsters)) {
      moves.push({ start: parseInt(start), end: end, type: 'monster' as const });
    }
    return moves;
  };

  const handleStartGame = (p1Name: string, p1Avatar: string, p2Name: string, p2Avatar: string, difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      players: {
        [PlayerId.ONE]: { ...prev.players[PlayerId.ONE], name: p1Name, avatar: p1Avatar, position: 1 },
        [PlayerId.TWO]: { ...prev.players[PlayerId.TWO], name: p2Name, avatar: p2Avatar, position: 1 },
      },
      phase: GamePhase.ROLL_DICE,
      logs: [`Welcome to Steps & Leaps! ${p1Name} starts.`],
      difficulty: difficulty
    }));
    audioService.playWin(); // Play a sound to start
  };

  const handleRollDice = () => {
    if (gameState.phase !== GamePhase.ROLL_DICE || isRolling || isAnimating) return;

    audioService.playRoll();
    setIsRolling(true);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const totalSteps = d1 + d2;

      setIsRolling(false);
      setGameState(prev => ({
        ...prev,
        diceValues: [d1, d2],
        phase: GamePhase.MOVING_STEPS,
      }));
      addLog(`${gameState.players[gameState.currentPlayerId].name} rolled a ${d1} and ${d2} (${totalSteps} steps).`);
      
      setTimeout(() => animateMove(totalSteps, true), 500);
    }, 1000);
  };

  const handleSpin = () => {
    if (gameState.phase !== GamePhase.SPIN_WHEEL || spinTrigger || isAnimating) return;
    setSpinTrigger(true);
    audioService.playRoll(); 
  };

  const onSpinComplete = (value: number) => {
    setSpinTrigger(false);
    addLog(`${gameState.players[gameState.currentPlayerId].name} spun a leap of ${value}!`);
    setGameState(prev => ({
      ...prev,
      spinValue: value,
      phase: GamePhase.MOVING_LEAPS,
    }));
    
    setTimeout(() => animateMove(value, false), 1000);
  };

  const animateMove = async (totalAmount: number, isSteps: boolean) => {
    setIsAnimating(true);
    const playerId = gameState.currentPlayerId;
    let currentPos = gameState.players[playerId].position;
    const targetPos = Math.min(currentPos + totalAmount, gameConfig.maxScore);
    
    const stepDelay = isSteps ? 400 : 200; 
    
    let tempPos = currentPos;
    
    while (tempPos < targetPos) {
      tempPos += 1;
      
      setGameState(prev => ({
        ...prev,
        players: {
          ...prev.players,
          [playerId]: {
            ...prev.players[playerId],
            position: tempPos
          }
        }
      }));

      audioService.playStep();
      await new Promise(resolve => setTimeout(resolve, stepDelay));
    }

    if (!isSteps) {
        audioService.playLeap();
    }

    finishMove(targetPos, isSteps);
  };

  const finishMove = async (finalPos: number, isSteps: boolean) => {
    let actualFinalPos = finalPos;
    const playerId = gameState.currentPlayerId;
    const playerName = gameState.players[playerId].name;

    // Check for Ladders or Monsters from current config
    let specialMoveHappened = false;
    
    if (gameConfig.ladders[actualFinalPos]) {
      const ladderEnd = gameConfig.ladders[actualFinalPos];
      addLog(`✨ WOW! ${playerName} found a ladder to ${ladderEnd}!`);
      audioService.playLadder();
      actualFinalPos = ladderEnd;
      specialMoveHappened = true;
    } else if (gameConfig.monsters[actualFinalPos]) {
      const monsterEnd = gameConfig.monsters[actualFinalPos];
      addLog(`👻 OOPS! A monster scared ${playerName} back to ${monsterEnd}!`);
      audioService.playMonster();
      actualFinalPos = monsterEnd;
      specialMoveHappened = true;
    }

    // If special move happened, update state directly after a brief pause
    if (specialMoveHappened) {
       await new Promise(resolve => setTimeout(resolve, 800));
       setGameState(prev => ({
        ...prev,
        players: {
          ...prev.players,
          [playerId]: {
            ...prev.players[playerId],
            position: actualFinalPos
          }
        }
      }));
    }

    setIsAnimating(false);

    const hasWon = actualFinalPos >= gameConfig.maxScore;

    setGameState(prev => ({
      ...prev,
      winner: hasWon ? prev.currentPlayerId : null,
      phase: hasWon ? GamePhase.GAME_OVER : (isSteps ? GamePhase.SPIN_WHEEL : GamePhase.TURN_END),
    }));

    if (hasWon) {
      audioService.playWin();
      addLog(`!!! ${playerName} WINS !!!`);
    } else if (!isSteps) {
      // Only get AI message at end of turn (after spinner)
      setLoadingAi(true);
      setAiMessage(null);
      
      const fact = await getMathFact(actualFinalPos, gameState.difficulty);
      if (fact) setAiMessage(fact);
      setLoadingAi(false);

      setTimeout(() => {
        setAiMessage(null);
        switchTurn();
      }, 4000);
    }
  };

  const switchTurn = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayerId: prev.currentPlayerId === PlayerId.ONE ? PlayerId.TWO : PlayerId.ONE,
      phase: GamePhase.ROLL_DICE,
      spinValue: 0,
      diceValues: [1, 1],
    }));
    addLog(`--- ${gameState.players[gameState.currentPlayerId === PlayerId.ONE ? PlayerId.TWO : PlayerId.ONE].name}'s turn ---`);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...INITIAL_STATE,
      // Persist players and difficulty
      players: {
          [PlayerId.ONE]: { ...prev.players[PlayerId.ONE], position: 1 },
          [PlayerId.TWO]: { ...prev.players[PlayerId.TWO], position: 1 },
      },
      difficulty: prev.difficulty,
      phase: GamePhase.ROLL_DICE, 
    }));
    setAiMessage(null);
    setLoadingAi(false);
    setIsAnimating(false);
    audioService.playWin();
    addLog("Game Reset! Good luck!");
  };

  if (gameState.phase === GamePhase.SETUP) {
    return <SetupScreen onStartGame={handleStartGame} />;
  }

  const currentPlayer = gameState.players[gameState.currentPlayerId];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* LEFT COLUMN: Controls & Game State */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 order-2 md:order-1">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-blue-500">Steps</span> & <span className="text-green-500">Leaps</span>
          </h1>
          <p className="text-slate-500 text-sm">Race to {gameConfig.maxScore}! Watch out for monsters!</p>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
             Mode: {gameState.difficulty === Difficulty.EASY ? 'Easy (50 squares)' : 'Hard (100 squares)'}
          </div>
        </div>

        {/* Current Player Status */}
        <div className={`p-6 rounded-2xl shadow-md border-2 transition-colors duration-300 ${currentPlayer.id === PlayerId.ONE ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm border-4 border-white" style={{ backgroundColor: currentPlayer.color }}>
                <AvatarIcon type={currentPlayer.avatar} className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{currentPlayer.name}</h2>
                <div className="text-sm font-semibold text-slate-500">
                  Currently at <span className="text-lg text-black">{currentPlayer.position}</span>
                </div>
              </div>
            </div>
            {gameState.winner && <Award className="text-yellow-500 w-10 h-10 animate-bounce" />}
          </div>

          {/* Action Area */}
          <div className="space-y-6">
            
            {/* Phase 1: Dice */}
            <div className={`transition-opacity duration-300 ${gameState.phase === GamePhase.ROLL_DICE || (gameState.phase === GamePhase.MOVING_STEPS && isAnimating) ? 'opacity-100' : 'opacity-30 grayscale pointer-events-none'}`}>
              <div className="flex justify-center gap-4 mb-4">
                <Dice value={gameState.diceValues[0]} rolling={isRolling} />
                <Dice value={gameState.diceValues[1]} rolling={isRolling} />
              </div>
              <button
                onClick={handleRollDice}
                disabled={gameState.phase !== GamePhase.ROLL_DICE || isRolling || isAnimating}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isRolling ? 'Rolling...' : 'Roll Dice (Steps)'}
              </button>
            </div>

            <div className="w-full h-px bg-slate-200"></div>

            {/* Phase 2: Spinner */}
            <div className={`flex flex-col items-center transition-opacity duration-300 ${gameState.phase === GamePhase.SPIN_WHEEL || (gameState.phase === GamePhase.MOVING_LEAPS && isAnimating) ? 'opacity-100' : 'opacity-30 grayscale pointer-events-none'}`}>
               <Spinner 
                  onSpinComplete={onSpinComplete} 
                  disabled={gameState.phase !== GamePhase.SPIN_WHEEL || isAnimating} 
                  spinTrigger={spinTrigger}
               />
               <button
                onClick={handleSpin}
                disabled={gameState.phase !== GamePhase.SPIN_WHEEL || spinTrigger || isAnimating}
                className="mt-4 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-200 text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {spinTrigger ? 'Spinning...' : 'Spin (Leaps)'}
              </button>
            </div>

          </div>
        </div>

        {/* AI Math Buddy */}
        {(aiMessage || loadingAi) && (
           <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-4 rounded-xl border border-violet-200 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-2 text-violet-700 font-bold">
                 <MessageSquare className="w-4 h-4" /> Math Buddy says:
              </div>
              <p className="text-slate-700 italic">
                {loadingAi ? "Thinking of a fun fact..." : `"${aiMessage}"`}
              </p>
           </div>
        )}

        {/* Game Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-48 overflow-hidden">
           <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 font-semibold text-slate-500 text-xs uppercase tracking-wider">Game Log</div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm text-slate-600">
             {gameState.logs.map((log, i) => (
               <div key={i} className="border-b border-slate-50 pb-1 last:border-0">{log}</div>
             ))}
             <div ref={logsEndRef} />
           </div>
        </div>

        {gameState.winner && (
          <button onClick={resetGame} className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-2xl shadow-xl flex items-center justify-center gap-2 animate-bounce">
            <RefreshCcw /> Play Again
          </button>
        )}

      </div>

      {/* RIGHT COLUMN: The Board */}
      <div className="w-full md:w-2/3 order-1 md:order-2">
         <div className="sticky top-4">
            <Board players={gameState.players} specialMoves={getSpecialMoves()} maxScore={gameConfig.maxScore} />
            
            {/* Legend / Info */}
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm text-slate-600">Start (1)</span>
               </div>
               <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded ring-1 ring-yellow-400"></div>
                  <span className="text-sm text-slate-600">Goal ({gameConfig.maxScore})</span>
               </div>
               <div className="col-span-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                 <Volume2 className="w-3 h-3"/> Sounds enabled
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

export default App;