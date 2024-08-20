/**
 * Generates a random integer within the specified range.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @param {() => number} randomFloatFunc - A function that returns a floating-point number in the range [0, 1).
 *                                       If the values returned by the function are outside this range,
 *                                       it will be logged to the console, and Math.random() will be used instead.
 * @returns {number} A random integer within the specified range.
 */
export function getRandomInt(min: number, max: number, randomFloatFunc: () => number = Math.random): number {
  /**
   * Maps values returned by the randomFloatFunc function to the [0, 1) interval.
   * If the value is outside this range, it logs a warning and replaces it with Math.random().
   * @returns {number} The mapped value within the [0, 1) interval.
   */
  const mappedRandom = () => {
    const value = randomFloatFunc();
    if (value < 0 || value >= 1) {
      console.warn(`Value ${value} from randomFloatFunc is outside the [0, 1) interval. Using Math.random() instead.`);
      return Math.random();
    }
    return value;
  };

  // Generates a random integer within the specified range.
  return Math.floor(mappedRandom() * (max - min) + min);
}
