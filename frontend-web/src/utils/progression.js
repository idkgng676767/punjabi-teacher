export function getLevelTitle(level) {
  if (level >= 501) return 'Punjab';
  if (level >= 201) return 'Garden';
  if (level >= 101) return 'Orchard';
  if (level >= 51) return 'Tree';
  if (level >= 26) return 'Sapling';
  if (level >= 11) return 'Sprout';
  return 'Seedling';
}

export function calculateLevelFromXP(xp) {
  if (xp >= 500) return Math.floor((xp - 500) / 100) + 501;
  if (xp >= 200) return Math.floor((xp - 200) / 10) + 101;
  if (xp >= 100) return Math.floor((xp - 100) / 5) + 51;
  if (xp >= 50) return Math.floor((xp - 50) / 2) + 26;
  if (xp >= 25) return Math.floor((xp - 25) / 1) + 11;
  return Math.floor(xp / 10) + 1;
}

function getLevelStartXP(level) {
  if (level >= 501) return 500 + (level - 501) * 100;
  if (level >= 101) return 200 + (level - 101) * 10;
  if (level >= 51) return 100 + (level - 51) * 5;
  if (level >= 26) return 50 + (level - 26) * 2;
  if (level >= 11) return 25 + (level - 11) * 1;
  return (level - 1) * 10;
}

export function calculateLevelProgress(xp) {
  const level = calculateLevelFromXP(xp);
  const levelStartXP = getLevelStartXP(level);
  const levelEndXP = getLevelStartXP(level + 1);
  const progressInLevel = xp - levelStartXP;
  const levelLength = levelEndXP - levelStartXP;
  return Math.min(1, Math.max(0, progressInLevel / levelLength));
}

export function calculateXPToNextLevel(currentXP) {
  const currentLevel = calculateLevelFromXP(currentXP);
  const nextLevelStartXP = getLevelStartXP(currentLevel + 1);
  return Math.max(0, nextLevelStartXP - currentXP);
}