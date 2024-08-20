export function getAvailableSpins(spinUserData): number {
  const deltaTime = Date.now() - Number(spinUserData.lastSpinTimestamp);
  return Math.floor(deltaTime * spinUserData.speed) + (spinUserData.bonusSpins || 0);
}
