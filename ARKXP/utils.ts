import { LevelData, ParsedData, ConfigOutput } from './types';
import { CSV_DATA } from './constants';

export const parseCSV = (csvString: string): ParsedData => {
  const lines = csvString.trim().split('\n');
  // Remove header
  if (lines.length > 0 && lines[0].startsWith('INI')) {
    lines.shift();
  }

  const dinoData: LevelData[] = [];
  const playerData: LevelData[] = [];

  lines.forEach((line) => {
    const parts = line.split(',');
    if (parts.length >= 2) {
      // Parse Dino (col 0)
      const dinoPart = parts[0].trim().split(';');
      if (dinoPart.length === 2) {
        dinoData.push({
          level: parseInt(dinoPart[0], 10),
          xp: parseInt(dinoPart[1], 10),
        });
      }

      // Parse Player (col 1)
      const playerPart = parts[1].trim().split(';');
      if (playerPart.length === 2) {
        playerData.push({
          level: parseInt(playerPart[0], 10),
          xp: parseInt(playerPart[1], 10),
        });
      }
    }
  });

  return { dino: dinoData, player: playerData };
};

export const generateConfig = (
  maxDinoLevel: number,
  maxPlayerLevel: number,
  data: ParsedData
): ConfigOutput => {
  // Dino slice: 0 to maxDinoLevel (exclusive of end index, so 0 to maxDinoLevel - 1)
  const dinoSlice = data.dino.slice(0, maxDinoLevel);
  // Adjusted logic for Player: slice up to maxPlayerLevel - 1
  const playerSlice = data.player.slice(0, Math.max(0, maxPlayerLevel - 1));

  // Fallback to last available XP if slice is empty or user requested 0
  const dinoMaxXP = dinoSlice.length > 0 ? dinoSlice[dinoSlice.length - 1].xp : 0;
  const playerMaxXP = playerSlice.length > 0 ? playerSlice[playerSlice.length - 1].xp : 0;

  const playerRampEntries = playerSlice.map(
    (item, index) => `ExperiencePointsForLevel[${index}]=${item.xp}`
  );
  
  const dinoRampEntries = dinoSlice.map(
    (item, index) => `ExperiencePointsForLevel[${index}]=${item.xp}`
  );

  const playerRamp = `LevelExperienceRampOverrides=(${playerRampEntries.join(',')})`;
  const dinoRamp = `LevelExperienceRampOverrides=(${dinoRampEntries.join(',')})`;

  return {
    playerMaxXP,
    dinoMaxXP,
    playerRamp,
    dinoRamp,
  };
};

export const formatFullOutput = (config: ConfigOutput): string => {
  return `OverrideMaxExperiencePointsPlayer=${config.playerMaxXP}\nOverrideMaxExperiencePointsDino=${config.dinoMaxXP}\n${config.playerRamp}\n${config.dinoRamp}`;
};