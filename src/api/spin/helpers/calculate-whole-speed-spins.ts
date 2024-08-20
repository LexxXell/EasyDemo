type SpinUserData = {
  id: number | string;
  speed?: number; // Скорость начисления спинов в миллисекунду
  lastSpinTimestamp?: string; // Метка времени в миллисекундах
  bonusSpins?: number;
  flagFirstSpinReward?: boolean;
  createdAt?: Date | string; // Дата и время создания записи в формате ISO или Date
  updatedAt?: Date | string; // Дата и время последнего обновления записи в формате ISO или Date
  publishedAt?: Date | string | null;
};

export function calculateWholeSpins(spinData: SpinUserData) {
  const currentTime = Date.now(); // Текущее время в миллисекундах
  const timeElapsed = currentTime - Number(spinData.lastSpinTimestamp); // Время, прошедшее с последнего начисления спина

  // Количество накопившихся спинов за прошедшее время
  const accumulatedSpins = timeElapsed * spinData.speed;

  // Возвращаем только целое количество спинов
  return Math.floor(accumulatedSpins);
}
