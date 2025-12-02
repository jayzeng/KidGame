export enum PlayerId {
  ONE = 1,
  TWO = 2,
}

export enum GamePhase {
  SETUP = 'SETUP',
  ROLL_DICE = 'ROLL_DICE',
  MOVING_STEPS = 'MOVING_STEPS',
  SPIN_WHEEL = 'SPIN_WHEEL',
  MOVING_LEAPS = 'MOVING_LEAPS',
  TURN_END = 'TURN_END',
  GAME_OVER = 'GAME_OVER',
}

export enum Difficulty {
  EASY = 'EASY',
  HARD = 'HARD',
}

export interface Player {
  id: PlayerId;
  name: string;
  position: number;
  color: string;
  avatar: string;
}

export interface GameState {
  players: Record<PlayerId, Player>;
  currentPlayerId: PlayerId;
  phase: GamePhase;
  diceValues: [number, number];
  spinValue: number; // 0, 10, 20, 30
  winner: PlayerId | null;
  logs: string[];
  difficulty: Difficulty;
}
