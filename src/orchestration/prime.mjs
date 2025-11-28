import {
  checkAndExplainPrimeStatus, // *Main 6 (much quicker | will check the existing files, and if number is smaller than greatest foldernumber, it will find it, otherwise will use isPrime, which is slow way)
  checkAndExplainPrimeStatusUpdated, // *Main 6-1 (much quicker | quicker than checkAndExplainPrimeStatus)
} from "../services/helper.mjs";
import {
  calculateDivisors, // Main 2 ( take too much time | This will check divisors from first divisor which is on prime pattern )
  calculateDivisorsUpdated, // Main 2-1 | quicker than calculateDivisors
  calculateDivisorsUsingText, // **Main 8 ( much quicker | This will check the files for sqrt and will do the job)
} from "../services/numberDivisors.mjs";
import {
  isPrime, // Main 1 ( take too much time | This will check divisors from first divisor which is on prime pattern)
  isPrimeUsingFiles, // *Main 5 (much quicker | will check the existing files, and if number is smaller than greatest foldernumber, it will find it, otherwise will use isPrime, which is slow way)
  isPrimeUsingFilesUpdated, // *Main 5-1 (much quicker | quicker than isPrimeUsingFiles )
  isPrimeFromText, // **Main 9 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will create a folder for sqrt number, by coping all the existing ones and then using generatePrimesUpTo to create the rest of the prime, from last existing prime number. Then it will check if it is dividable by any prime there or not
  isPrimeFromTextFiles, // **Main 10 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use checkDivisorNotExistOnTextFiles, will check from number lastNumber on lastfolder + 1 to the sqrtNumber, to find primes and check if the number is dividable by any of them
  // This will not create new folders.
  isPrimeFromTextFilesUpdated, // **Main 10-1 | This is quicker than isPrimeFromTextFiles
  isPrimeFromTextFilesRecursive, // ***Main 11 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use checkDivisorNotExistOnTextFilesRecursive, which is quicker than checkDivisorNotExistOnTextFiles
  // This will not create new folders.
  isPrimeFromTextFilesRecursiveUpdated, // ***Main 11-1 | This is quicker than isPrimeFromTextFilesRecursive
  isPrimeFromTextRecursive, // **Main 12 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use formatLastFileInLastFolderRecursive, which is quicker than formatLastFileInLastFolder, as it use generatePrimesUpToRecursive which will use isPrimeFromTextFilesRecursive, which is super quick one.
  isPrimeFromTextRecursiveUpdated, // **Main 12-1 | This is quicker than isPrimeFromTextRecursive
} from "../services/primeChecker.mjs";

import {
  generatePrimesFiles, // ***Main 14 | Super quick
  generatePrimesFilesUpdated, // ***Main 14-1 | quicker than generatePrimesFiles
  generatePrimesUpToRecursive, // ***Main 13 | not that much quick | From "2"
  generatePrimesUpToRecursiveUpdated, // ***Main 13-1 | not that much quick | From "2" | quicker than generatePrimesUpToRecursive
  generatePrimesRecursiveUpdated, // ***Main 13-2 | Super quick | quicker than generatePrimesUpToRecursiveUpdated
  generatePrimeOutputFromText, // **Main 7 ( super quick | this has a limitation which will just create the output, if the number we input is less than the greatest one that already exists)
  generatePrimesInRange, // Main 4 ( take too much time | quicker than previous ones | This will check divisors from first divisor which is on prime pattern )
  generatePrimesInRangeUpdated, // Main 4-1 ( take too much time | quicker than previous ones | This will check divisors from first divisor which is on prime pattern | Quicker than generatePrimesInRange)
  generatePrimesInRangeTextFiles, // Main 4-2 | quicker than previous methods
  generatePrimesInRangeTextFilesUpdated, // Main 4-3 | quicker than generatePrimesInRangeTextFiles
  generatePrimesUpTo, // Main 3 ( take too much time | This will create primes from first prime)
  generatePrimesUpToUpdated, // Main 3-1 ( take too much time | This will create primes from first prime | quicker than generatePrimesUpTo)
} from "../services/primeGenerator.mjs";

import {
  calculatePrimesText // Quickest method
} from "../services/primeIndex.mjs";

import {
  isPrimeHyperbolicOptimized, // ***Main 16 | Super quick with caching | O(√N) complexity
  sieveHyperbolicOptimized, // ***Main 15 | Super quick with caching | Two-way search hyperbolic
  divisionHyperbolic, // **Main 17 | Finds smallest divisor using hyperbolic equations
  getHyperbolicCacheStats, // Utility to check cache status
} from "../services/primeHyperbolic.optimized.mjs";
