export function getRandomElements<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) {
    return arr.slice(); // возвращаем полный массив, если запрашиваемое количество элементов больше или равно длине массива
  }

  const shuffledArray = arr.slice().sort(() => Math.random() - 0.5); // копируем массив и перемешиваем его

  return shuffledArray.slice(0, n); // возвращаем первые N элементов после перемешивания
}
