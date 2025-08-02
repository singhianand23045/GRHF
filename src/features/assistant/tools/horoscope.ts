/**
 * Provides a set of 6 numbers based on the user's astrological sign.
 * Numbers are strictly within 1-27.
 * @param zodiacSign The astrological sign (e.g., 'Leo', 'Aries').
 * @returns A single array of 6 numbers.
 */
export function getHoroscopeNumbers(zodiacSign: string): number[] {
  const signMap: { [key: string]: number[] } = {
    aries: [3, 9, 12, 18, 21, 27],
    taurus: [2, 8, 11, 17, 20, 26],
    gemini: [5, 10, 14, 19, 23, 25],
    cancer: [4, 7, 13, 16, 22, 24],
    leo: [1, 6, 15, 20, 24, 27],
    virgo: [5, 10, 14, 19, 23, 25], // Same as Gemini for simplicity
    libra: [2, 8, 11, 17, 20, 26], // Same as Taurus for simplicity
    scorpio: [3, 9, 12, 18, 21, 27], // Same as Aries for simplicity
    sagittarius: [1, 6, 15, 20, 24, 27], // Same as Leo for simplicity
    capricorn: [4, 7, 13, 16, 22, 24], // Same as Cancer for simplicity
    aquarius: [5, 10, 14, 19, 23, 25], // Same as Gemini for simplicity
    pisces: [2, 8, 11, 17, 20, 26], // Same as Taurus for simplicity
  };

  const normalizedSign = zodiacSign.toLowerCase();
  const numbers = signMap[normalizedSign] || [];

  // Ensure numbers are sorted and within range (though hardcoded, this is a safeguard)
  return numbers.filter(n => n >= 1 && n <= 27).sort((a, b) => a - b);
}