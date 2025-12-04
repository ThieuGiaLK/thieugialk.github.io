export interface LevelData {
  level: number;
  xp: number;
}

export interface ParsedData {
  dino: LevelData[];
  player: LevelData[];
}

export interface ConfigOutput {
  playerMaxXP: number;
  dinoMaxXP: number;
  playerRamp: string;
  dinoRamp: string;
}