import { findMatchingFolder } from "./fileOperations.mjs";
import {
  addNumbers,
  divideNumbers,
  findMax,
  sqrtFloor,
} from "./mathOperations.mjs";
import {
  checkDivisorFromFiles,
  checkDivisorsFromFiles,
  findPrimeFactor,
  isDivisor,
  isPrime,
} from "./primeChecker.mjs";

/**
 * Calculates all divisors of a given number.
 * Uses prime factorization and checks divisors up to the square root of the number.
 * @param {string} num - The number to find divisors for, as a string.
 * @param {string} partition - Optional partition size for prime checking. Defaults to "1".
 * @returns {string[]} - An array of divisors sorted as strings.
 */
const calculateDivisors = (num, partition = "1") => {
  const divisors = ["1"];

  while (num !== "1") {
    if (isPrime(num, partition)) {
      divisors.push(num);
      break;
    }

    let divisorFound = false;
    let currentDivisor = "2";
    const sqrtNum = sqrtFloor(num);

    // Check divisors up to the square root
    while (
      findMax(currentDivisor, sqrtNum) !== currentDivisor ||
      currentDivisor === sqrtNum
    ) {
      if (isDivisor(num, currentDivisor)) {
        divisors.push(currentDivisor);
        num = divideNumbers(num, currentDivisor)[0]; // Update num after division
        divisorFound = true;
        break;
      }
      currentDivisor = addNumbers(currentDivisor, "1");
    }

    // If no divisor found, the remaining number is a prime factor
    if (!divisorFound) {
      divisors.push(num);
      break;
    }
  }

  // Sort divisors numerically as strings
  return divisors.sort((a, b) => (findMax(a, b) === a ? 1 : -1));
};

/**
 * Calculates all divisors of a number using pre-generated text files.
 * Finds matching text files containing primes and uses them for divisor checks.
 * @param {string} num - The number to find divisors for, as a string.
 * @returns {string[]|string} - An array of divisors or an error message if no suitable folder is found.
 */
const calculateDivisorsUsingText = (num) => {
  const folder = findMatchingFolder("./output-big", sqrtFloor(num));
  if (!folder || folder.includes("larger than")) {
    return `No suitable folder found for number ${num}`;
  }

  // Check divisors using existing text files
  const divisors = checkDivisorsFromFiles(num, folder);
  divisors.unshift("1"); // Include '1' as a divisor
  return divisors;
};

// Export the updated methods
export {
  checkDivisorFromFiles,       // Check if a single divisor exists in files
  checkDivisorsFromFiles,      // Check all divisors for a number using files
  findPrimeFactor,             // Find the smallest prime factor of a number
  calculateDivisors,           // Calculate divisors using prime factorization
  calculateDivisorsUsingText,  // Calculate divisors using pre-generated text files
};
