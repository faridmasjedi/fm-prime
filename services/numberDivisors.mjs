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

// Main method 2: Calculate all divisors of a number
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

    while (
      findMax(currentDivisor, sqrtNum) !== currentDivisor ||
      currentDivisor === sqrtNum
    ) {
      if (isDivisor(num, currentDivisor)) {
        divisors.push(currentDivisor);
        num = divideNumbers(num, currentDivisor)[0];
        divisorFound = true;
        break;
      }
      currentDivisor = addNumbers(currentDivisor, "1");
    }

    if (!divisorFound) {
      divisors.push(num);
      break;
    }
  }

  // Sort the divisors as strings numerically
  return divisors.sort((a, b) => (findMax(a, b) === a ? 1 : -1));
};


// Main method 8: find divisors from existing text files
const calculateDivisorsUsingText = (num) => {
  const folder = findMatchingFolder("./output-big", sqrtFloor(num));
  if (!folder || folder.includes("larger than"))
    return `No suitable folder found for number ${num}`;
  const divisors = checkDivisorsFromFiles(num, folder);
  divisors.unshift("1");
  return divisors;
};

export {
  checkDivisorFromFiles,
  checkDivisorsFromFiles,
  findPrimeFactor,
  calculateDivisors,
  calculateDivisorsUsingText,
};
