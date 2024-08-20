const defaultDataSet = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random string of the specified length using the provided data set.
 *
 * @param {number} length - The length of the random string to be generated (default is 5).
 * @param {string} dataSet - The set of characters to be used for generating the random string (default is 'abcdefghijklmnopqrstuvwxyz0123456789').
 * @returns {string} - The randomly generated string.
 */
export function generateRandomString(length: number = 5, dataSet: string = defaultDataSet): string {
  let result = '';
  const dataSetLength = dataSet.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * dataSetLength);
    result += dataSet.charAt(randomIndex);
  }

  return result;
}
