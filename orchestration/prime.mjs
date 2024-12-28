import { 
  checkAndExplainPrimeStatus, // *Main 6 (much quicker | will check the existing files, and if number is smaller than greatest foldernumber, it will find it, otherwise will use isPrime, which is slow way)
} from "../services/helper.mjs";
import {
  calculateDivisors, // Main 2 ( take too much time | This will check divisors from first divisor which is on prime pattern )
  calculateDivisorsUsingText, // **Main 8 ( much quicker | This will check the files for sqrt and will do the job)
} from "../services/numberDivisors.mjs";
import {
  isPrime, // Main 1 ( take too much time | This will check divisors from first divisor which is on prime pattern)
  isPrimeUsingFiles, // *Main 5 (much quicker | will check the existing files, and if number is smaller than greatest foldernumber, it will find it, otherwise will use isPrime, which is slow way)
  isPrimeFromText, // **Main 9 | This is super quick | it will check:
                               // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
                               // - if no, it will find the last existing and check if the number is dividable by any prime there
                               // - if no, it will create a folder for sqrt number, by coping all the existing ones and then using generatePrimesUpTo to create the rest of the prime, from last existing prime number. Then it will check if it is dividable by any prime there or not

  isPrimeFromTextFiles, // **Main 10 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use checkDivisorNotExistOnTextFiles, will check from number lastNumber on lastfolder + 1 to the sqrtNumber, to find primes and check if the number is dividable by any of them
  // This will not create new folders.
  isPrimeFromTextFilesRecursive, // ***Main 11 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use checkDivisorNotExistOnTextFilesRecursive, which is quicker than checkDivisorNotExistOnTextFiles
  // This will not create new folders.
  isPrimeFromTextRecursive, // **Main 12 | This is super quick | it will check:
  // - if sqrt less than existing numbers on folders , it will check if the number is dividable by any prime less than that
  // - if no, it will find the last existing and check if the number is dividable by any prime there
  // - if no, it will use formatLastFileInLastFolderRecursive, which is quicker than formatLastFileInLastFolder, as it use generatePrimesUpToRecursive which will use isPrimeFromTextFilesRecursive, which is super quick one. 
} from "../services/primeChecker.mjs";

import {
  generatePrimesFiles, // ***Main 14 | Super quick 
  generatePrimesUpToRecursive, // ***Main 13 | Super quick
  generatePrimeOutputFromText, // **Main 7 ( super quick | this has a limitation which will just create the output, if the number we input is less than the greatest one that already exists)
  generatePrimesInRange, // Main 4 ( take too much time | quicker than previous ones | This will check divisors from first divisor which is on prime pattern )
  generatePrimesUpTo, // Main 3 ( take too much time | This will create primes from first prime)
} from "../services/primeGenerator.mjs";