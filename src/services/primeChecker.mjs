import {
  copyAllFiles,
  findLastExistingFolderNumber,
  findMatchingFile,
  findMatchingFolder,
  getAllFromDirectory,
  parseAndSortFiles,
  primesInFile,
  findFileForNumber,
} from "./fileOperations.mjs";
import {
  findNextCandidate,
  formatLastFileInLastFolder,
  formatLastFileInLastFolderRecursive,
  formatLastFileInLastFolderRecursiveUpdated,
  generatePartitions,
} from "./helper.mjs";
import {
  isDivisibleBy2,
  isDivisibleBy3,
  isDivisibleBy5,
  isDivisibleBy6,
  findMax,
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
} from "./mathOperations.mjs";

import {
  readFileSync as fsReadFileSync,
  statSync as fsStatSync,
  openSync as fsOpenSync,
  readSync as fsReadSync,
  closeSync as fsCloseSync
} from "fs";

/**
 * Checks if a candidate is a divisor of a number.
 * @param {string} number - The number to check divisors for.
 * @param {string} candidate - The potential divisor.
 * @returns {boolean} - True if the candidate is a divisor; false otherwise.
 */
const isDivisor = (number, candidate) => {
  if (!candidate) return false;
  return divideNumbers(number, candidate)[1] === "0" && number !== candidate;
};

/**
 * Finds the smallest prime factor of a number starting from a given factor.
 * @param {string} num - The number to factorize.
 * @param {string} factor - The starting factor to check.
 * @returns {string|boolean} - The prime factor if found; false otherwise.
 */
const findPrimeFactor = (num, factor) => {
  if (isDivisor(num, factor)) return factor;
  const nextFactor = addNumbers(factor, "2");
  return isDivisor(num, nextFactor) ? nextFactor : false;
};

/**
 * Checks if a number exists in a specified file and logs its status.
 * @param {string} num - The number to check.
 * @param {string} folder - The folder path.
 * @param {string} file - The file to search within.
 * @returns {boolean} - True if the number exists in the file; false otherwise.
 */
/**
 * Checks if a number exists in a specified file and logs its status.
 * MEMORY-SAFE: Uses efficient file lookup and small file reading.
 * @param {string} num - The number to check.
 * @param {string} folder - The folder path.
 * @param {string} [file] - Optional file to search within. If not provided, finds correct file.
 * @returns {boolean} - True if the number exists in the file; false otherwise.
 */
const checkNumberInFile = (num, folder, file = null) => {
  let targetFile = file;

  // If file not provided, find the correct file for this number
  if (!targetFile) {
    targetFile = findFileForNumber(folder, BigInt(num));
    if (!targetFile) return false;
  }

  const filePath = targetFile.includes(folder) ? targetFile : `${folder}/${targetFile}`;

  // With split files, files are small (<1MB), so we can read safely
  // But we keep the size check just in case we encounter a legacy large file
  const stats = fsStatSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);

  // For small files (< 1MB), use the fast in-memory approach
  if (fileSizeMB < 1) {
    const fileData = fsReadFileSync(filePath, "utf-8");
    const pattern1 = `| ${num},`;
    const pattern2 = `,${num},`;
    if (fileData.includes(pattern1) || fileData.includes(pattern2)) {
      console.log(`${num} is prime ---> ref: ${filePath}`);
      return true;
    }
    return false;
  }

  // For large files (legacy), use streaming
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const pattern1 = `| ${num},`;
  const pattern2 = `,${num},`;

  const fd = fsOpenSync(filePath, "r");
  const buffer = Buffer.alloc(CHUNK_SIZE);
  let position = 0;
  let previousChunk = "";

  try {
    while (position < stats.size) {
      const bytesRead = fsReadSync(fd, buffer, 0, CHUNK_SIZE, position);
      if (bytesRead === 0) break;

      const chunk = previousChunk + buffer.toString("utf-8", 0, bytesRead);

      if (chunk.includes(pattern1) || chunk.includes(pattern2)) {
        console.log(`${num} is prime ---> ref: ${filePath}`);
        fsCloseSync(fd);
        return true;
      }

      previousChunk = chunk.slice(-100);
      position += bytesRead;
    }

    fsCloseSync(fd);
    return false;
  } catch (error) {
    fsCloseSync(fd);
    throw error;
  }
};

/**
 * Checks if a number is prime using basic divisibility rules and partitions.
 * @param {string} number - The number to check.
 * @param {string} partition - The partition size for optimization. Default is "1".
 * @returns {boolean} - True if the number is prime; false otherwise.
 */
const isPrime = (number, partition = "1") => {
  if (number === "2" || number === "3") return true;
  if (
    number === "1" ||
    isDivisibleBy2(number) ||
    isDivisibleBy3(number) ||
    (!isDivisibleBy6(subtractNumbers(number, "7")) &&
      !isDivisibleBy6(subtractNumbers(number, "5")))
  ) {
    return false;
  }

  const sqrtLimit = sqrtFloor(number);
  const partitionRange = addNumbers(
    divideNumbers(sqrtLimit, partition)[1],
    "1"
  );
  const partitions = generatePartitions(sqrtLimit, partitionRange);

  for (const partition of partitions) {
    let k = "0";
    while (findMax(k, partitionRange) === partitionRange) {
      const candidate = addNumbers(
        "5",
        multiplyNumbers("6", addNumbers(k.toString(), partition.toString()))
      );

      const nextCandidate = addNumbers(candidate, "2");
      if (isDivisor(number, candidate) || isDivisor(number, nextCandidate))
        return false;
      k = addNumbers(k, "1");
    }
  }

  return true;
};

/**
 * Determines if a number is a Sophie prime.
 * @param {string} number - The number to check.
 * @returns {string} - The Sophie prime status of the number.
 */
const isSophiePrime = (number) => {
  if (!isPrime(number)) {
    return `${number} is not a prime.`;
  }

  const sophieNumber = addNumbers("1", multiplyNumbers("2", number));
  return isPrime(sophieNumber)
    ? `${number} is a Sophie prime.`
    : `${number} is not a Sophie prime.`;
};

/**
 * Determines if a number is a twin prime.
 * @param {string} number - The number to check.
 * @returns {string} - The twin prime status of the number.
 */
const isTwinPrime = (number) => {
  if (!isPrime(number)) {
    return `${number} is not a prime.`;
  }

  const twinFirst = subtractNumbers(number, "2");
  const twinSecond = addNumbers(number, "2");

  const twinResults = [];
  if (isPrime(twinFirst)) twinResults.push(`${number} & ${twinFirst} : Twins`);
  if (isPrime(twinSecond))
    twinResults.push(`${number} & ${twinSecond} : Twins`);

  return twinResults.length > 0 ? twinResults.join("\n") : "No Twins";
};

/**
 * Determines if a number is an isolated prime.
 * @param {string} number - The number to check.
 * @returns {string} - The isolated prime status of the number.
 */
const isIsolatedPrime = (number) => {
  if (!isPrime(number)) {
    return `${number} is not a prime number.`;
  }

  const isolatedFirst = addNumbers(number, "2");
  const isolatedSecond = subtractNumbers(number, "2");

  const isFirstIsolated = !isPrime(isolatedFirst);
  const isSecondIsolated = !isPrime(isolatedSecond);

  return isFirstIsolated && isSecondIsolated
    ? `${number} is an isolated prime.`
    : `${number} is prime, but not an isolated one.`;
};

/**
 * Checks if a number is a prime by verifying divisors up to its square root.
 * @param {string} number - The number to check for primality.
 * @param {string} sqrtNumber - The square root of the number, used as the upper bound for divisor checks.
 * @param {string} [current="2"] - The current potential divisor to start checking from (defaults to "2").
 * @returns {string} - A message indicating whether the number is prime or the divisor that makes it composite.
 */
const checkDivisorNotExistOnTextFiles = (number, sqrtNumber, current = "2") => {
  while (findMax(current, sqrtNumber) !== current || current === sqrtNumber) {
    if (isPrime(current)) {
      console.log("current prime:", current);
      if (isDivisor(number, current))
        return `${number} is dividable by ${current}.\n${number} is not prime.`;
    }
    current = addNumbers(current, "1");
  }
  return `${number} is a prime number.`;
};

/**
 * Checks if a number is a prime using a folder containing prime data.
 * @param {string} num - The number to check.
 * @param {string} specificFolder - Optional specific folder to check.
 * @returns {boolean} - True if the number is prime; false otherwise.
 */
const checkPrimeInFiles = (num, specificFolder = null) => {
  const folder = specificFolder || findMatchingFolder("./output-big", num);
  if (typeof folder === 'string' && folder.includes("is larger than")) return false;

  return checkNumberInFile(num, folder);
};

/**
 * Checks if a number is prime using available files or fallback to direct computation.
 * @param {string} number - The number to check.
 * @param {string} source - The folder containing prime data. Default is "./output-big".
 * @param {string} partition - The partition size for optimization. Default is "1".
 * @returns {boolean} - True if the number is prime; false otherwise.
 */
const isPrimeUsingFiles = (
  number,
  source = "./output-big",
  partition = "1"
) => {
  const folder = findMatchingFolder(source, number);
  if (typeof folder === "string" && folder.includes("is larger")) {
    return isPrime(number, partition);
  }

  return checkNumberInFile(number, folder)
    ? true
    : isPrime(number, partition);
};

/**
 * Finds all divisors of a number using available files.
 * @param {string} num - The number to find divisors for.
 * @param {string} folder - The folder containing prime data.
 * @param {Array<string>} divisors - The list of divisors found so far. Default is an empty array.
 * @returns {Array<string>} - The list of divisors.
 */
const checkDivisorsFromFiles = (num, folder, divisors = []) => {
  if (checkPrimeInFiles(num, folder)) {
    divisors.push(num);
    return divisors;
  }
  const files = parseAndSortFiles(getAllFromDirectory(folder));
  for (const file of files) {
    let reducedNum = num;
    const primes = primesInFile(`${folder}/${file}`);
    const divisor = primes.find(
      (prime) => divideNumbers(num, prime)[1] === "0"
    );

    if (divisor) {
      divisors.push(divisor);
      reducedNum = divideNumbers(num, divisor)[0];
      return checkDivisorsFromFiles(reducedNum, folder, divisors);
    }

    if (reducedNum === num) {
      divisors.push(num);
      return divisors;
    }
  }
};

/**
 * Checks if a number has a divisor in the provided folder's files.
 * @param {string} num - The number to check for divisors.
 * @param {string} folder - The folder containing files with prime numbers.
 * @returns {boolean} - True if a divisor is found; false otherwise.
 */
const checkDivisorFromFiles = (num, folder) => {
  // Check if number is already cached as prime
  // Now safe because checkPrimeInFiles uses findFileForNumber (no huge file reads)
  if (checkPrimeInFiles(num, folder)) return false;

  const files = parseAndSortFiles(getAllFromDirectory(folder));
  for (const file of files) {
    const primes = primesInFile(`${folder}/${file}`);
    const divisor = primes.find((prime) => isDivisor(num, prime));

    if (divisor) {
      console.log(`${num} is dividable by ${divisor}`);
      return true;
    }
  }
  return false;
};

/**
 * Determines if a number is a prime using existing text files or by generating new data if necessary.
 * @param {string} num - The number to check for primality.
 * @returns {string} - A message indicating whether the number is prime or not.
 */
const isPrimeFromText = (num) => {
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);
  if (folder && !folder.includes("larger than")) {
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is a prime number.`;
  }
  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log("Checking divisors in the last existing folder...");
  if (checkDivisorFromFiles(num, lastFolderPath)) {
    return `${num} is not a prime number.`;
  }

  console.log("Generating new prime data for", sqrtNum);
  // Generate a new folder for sqrtNum and check divisors with new primes
  const files = parseAndSortFiles(getAllFromDirectory(lastFolderPath));
  const lastFile = files[files.length - 1];
  const lastNumber = lastFolderName.replace("output-", "");

  formatLastFileInLastFolder(lastFolderPath, lastFile, lastNumber, sqrtNum);

  const targetFolderPath = `./output-big/output-${sqrtNum}`;
  copyAllFiles(files, lastFolderPath, targetFolderPath);

  return checkDivisorFromFiles(num, targetFolderPath)
    ? `${num} is not a prime number.`
    : `${num} is a prime number.`;
};

/**
 * Checks if a number is a prime by verifying divisors up to its square root.
 * @param {string} number - The number to check for primality.
 * @param {string} sqrtNumber - The square root of the number, used as the upper bound for divisor checks.
 * @param {string} [current="2"] - The current potential divisor to start checking from (defaults to "2").
 * @returns {string} - A message indicating whether the number is prime or the divisor that makes it composite.
 */
const checkDivisorNotExistOnTextFilesUpdated = (
  number,
  sqrtNumber,
  current = "2"
) => {
  while (findMax(current, sqrtNumber) !== current || current === sqrtNumber) {
    if (isPrimeFromTextFilesUpdated(current)) {
      console.log("current prime:", current);
      if (isDivisor(number, current))
        return `${number} is dividable by ${current}.\n${number} is not prime.`;
    }
    current = findNextCandidate(current);
  }
  return `${number} is a prime number.`;
};

/**
 * Determines if a number is prime using available text files or performs a fallback check.
 *
 * @param {string} num - The number to check for primality.
 * @returns {string} - A detailed message indicating whether the number is prime or not.
 */
const isPrimeFromTextFiles = (num) => {
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);

  if (folder && !folder.includes("larger than")) {
    console.log(`Checking divisors in the existing ${folder}...`);
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is not dividable by any prime up to floor sqrt root of it ( ${sqrtNum} ).\n${num} is a prime number.`;
  }

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log("Checking divisors in the last existing folder...");
  if (checkDivisorFromFiles(num, lastFolderPath)) {
    return `${num} is not a prime number.`;
  }
  const lastNumber = lastFolderName.replace("output-", "");
  return checkDivisorNotExistOnTextFiles(
    num,
    sqrtNum,
    addNumbers(lastNumber, "1")
  );
};
const isPrimeFromTextFilesUpdated = (num) => {
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);

  if (folder && !folder.includes("larger than")) {
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is not dividable by any prime up to floor sqrt root of it ( ${sqrtNum} ).\n${num} is a prime number.`;
  }

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  if (checkDivisorFromFiles(num, lastFolderPath)) {
    return `${num} is not a prime number.`;
  }
  const lastNumber = lastFolderName.replace("output-", "");
  return checkDivisorNotExistOnTextFilesUpdated(
    num,
    sqrtNum,
    findNextCandidate(lastNumber)
  );
};

/**
 * Checks if a number is prime using available files or fallback to direct computation.
 * @param {string} number - The number to check.
 * @param {string} source - The folder containing prime data. Default is "./output-big".
 * @param {string} partition - The partition size for optimization. Default is "1".
 * @returns {boolean} - True if the number is prime; false otherwise.
 */
const isPrimeUsingFilesUpdated = (number, source = "./output-big") => {
  const folder = findMatchingFolder(source, number);
  if (typeof folder === "string" && folder.includes("is larger")) {
    return isPrimeFromTextFilesUpdated(number);
  }

  const file = findMatchingFile(folder, number);
  return file
    ? checkNumberInFile(number, folder, file)
    : isPrimeFromTextFilesUpdated(number);
};

/**
 * Performs a basic check to determine if a number is not a prime based on simple divisibility rules.
 *
 * @param {string} number - The number to check.
 * @returns {boolean} - Returns `true` if the number is not prime; `false` otherwise.
 *
 * @description
 * This method checks if a number fails basic primality tests, such as:
 * - If the number is `1`, it is not a prime number.
 * - Divisibility by `2`, `3`, or `5`.
 * - Whether the number fits common prime patterns.
 * If any of these conditions are met, the number is not prime.
 */
const notPrimeBasicChecker = (number) => {
  if (number === "1") {
    console.log("number 1 is not a prime number.");
    return true;
  }
  if (number === "2" || number === "3" || number === "5") {
    console.log(`${number} is a prime number.`);
    return false;
  }
  if (isDivisibleBy2(number)) {
    console.log(`${number} is dividable by 2.`);
    return true;
  }
  if (isDivisibleBy3(number)) {
    console.log(`${number} is dividable by 3.`);
    return true;
  }
  if (isDivisibleBy5(number)) {
    console.log(`${number} is dividable by 5.`);
    return true;
  }
  if (
    !isDivisibleBy6(subtractNumbers(number, "7")) &&
    !isDivisibleBy6(subtractNumbers(number, "5"))
  ) {
    console.log(`${number} is not on prime pattern.`);
    return true;
  }
  return false;
};

/**
 * Recursively checks if a number has any divisors up to its square root using text-based files.
 *
 * @param {string} number - The number to check for divisors.
 * @param {string} sqrtNumber - The square root of the number, calculated as a string.
 * @param {string} [current="2"] - The current candidate divisor to test.
 * @returns {boolean} - Returns `true` if no divisors are found; `false` if a divisor is found.
 *
 * @description
 * This method iterates through potential divisors starting from `2` up to the square root of the number.
 * - It checks if the current candidate divisor is a prime number.
 * - If the number is divisible by the candidate, it logs the divisor and confirms the number is not prime.
 * - If no divisors are found within the range, the method concludes the number is prime.
 */
const checkDivisorNotExistOnTextFilesRecursive = (
  number,
  sqrtNumber,
  current = "2"
) => {
  while (findMax(current, sqrtNumber) !== current || current === sqrtNumber) {
    if (isPrime(current) && isDivisor(number, current)) {
      console.log(
        `${number} is dividable by ${current}.\n${number} is not prime.`
      );
      return false;
    }
    current = addNumbers(current, "1");
  }
  return true;
};
const checkDivisorNotExistOnTextFilesRecursiveUpdated = (
  number,
  sqrtNumber,
  current = "2"
) => {
  while (findMax(current, sqrtNumber) !== current || current === sqrtNumber) {
    if (isPrimeFromTextFilesUpdated(current) && isDivisor(number, current)) {
      console.log(
        `${number} is dividable by ${current}.\n${number} is not prime.`
      );
      return false;
    }
    current = findNextCandidate(current);
  }
  return true;
};

/**
 * Checks if a number is a prime from text files recursively.
 * @param {string} num - The number to check.
 * @returns {boolean|string} - True if the number is prime; explanatory string otherwise.
 */
const isPrimeFromTextFilesRecursive = (num) => {
  if (notPrimeBasicChecker(num)) return false;
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);
  console.log(`Checking if ${num} is prime...`);
  if (folder && !folder.includes("larger than")) {
    console.log(`Checking divisors for ${num} in the existing ${folder}...`);
    return !checkDivisorFromFiles(num, folder);
  }

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log(`Checking divisors in the last existing folder for ${num}...`);
  if (checkDivisorFromFiles(num, lastFolderPath)) return false;
  const lastNumber = lastFolderName.replace("output-", "");

  if (
    checkDivisorNotExistOnTextFilesRecursive(
      num,
      sqrtNum,
      addNumbers(lastNumber, "1")
    )
  ) {
    return true;
  }
};
const isPrimeFromTextFilesRecursiveUpdated = (num) => {
  if (notPrimeBasicChecker(num)) return false;
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);
  console.log(`Checking if ${num} is prime...`);
  if (folder && !folder.includes("larger than")) {
    console.log(`Checking divisors for ${num} in the existing ${folder}...`);
    return !checkDivisorFromFiles(num, folder);
  }

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log(`Checking divisors in the last existing folder for ${num}...`);
  if (checkDivisorFromFiles(num, lastFolderPath)) return false;
  const lastNumber = lastFolderName.replace("output-", "");

  if (
    checkDivisorNotExistOnTextFilesRecursiveUpdated(
      num,
      sqrtNum,
      findNextCandidate(lastNumber)
    )
  ) {
    return true;
  }
};

/**
 * Recursively determines if a number is prime using existing text-based files and generates new data if needed.
 *
 * @param {string} num - The number to check for primality.
 * @returns {string} - A message indicating whether the number is prime or not.
 *
 * @description
 * This method uses a combination of existing data and recursive logic to determine if a number is prime:
 * 1. It first applies basic divisibility checks using `notPrimeBasicChecker`.
 * 2. If the number passes basic checks, it calculates the square root of the number.
 * 3. It attempts to find a suitable folder containing prime data for divisibility tests.
 * 4. If a matching folder exists, it checks divisors in the folder:
 *    - If a divisor is found, the number is confirmed as not prime.
 *    - Otherwise, it is declared as prime.
 * 5. If no suitable folder exists:
 *    - It checks divisors in the last existing folder.
 *    - If no divisors are found, it generates new prime data up to the square root of the number.
 *    - This involves formatting existing files and copying them to a newly created folder.
 * 6. The method then performs a final divisibility check using the new folder data to confirm primality.
 *
 * This method is efficient for large numbers by leveraging existing precomputed prime data and generating additional data only when necessary.
 */
const isPrimeFromTextRecursive = (num) => {
  if (notPrimeBasicChecker(num)) return false;
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);

  if (folder && !folder.includes("larger than"))
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is a prime number.`;

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log(`Checking divisors in the last existing folder for ${num}...`);
  if (checkDivisorFromFiles(num, lastFolderPath))
    return `${num} is not a prime number.`;

  console.log("Generating new prime data for", sqrtNum);
  // Generate a new folder for sqrtNum and check divisors with new primes
  const files = parseAndSortFiles(getAllFromDirectory(lastFolderPath));
  const lastFile = files[files.length - 1];
  const lastNumber = lastFolderName.replace("output-", "");

  formatLastFileInLastFolderRecursive(
    lastFolderPath,
    lastFile,
    lastNumber,
    sqrtNum
  );

  const targetFolderPath = `./output-big/output-${sqrtNum}`;
  copyAllFiles(files, lastFolderPath, targetFolderPath);

  return checkDivisorFromFiles(num, targetFolderPath)
    ? `${num} is not a prime number.`
    : `${num} is a prime number.`;
};
const isPrimeFromTextRecursiveUpdated = (num) => {
  if (notPrimeBasicChecker(num)) return false;
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);

  if (folder && !folder.includes("larger than"))
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is a prime number.`;

  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  if (checkDivisorFromFiles(num, lastFolderPath))
    return `${num} is not a prime number.`;

  // Generate a new folder for sqrtNum and check divisors with new primes
  const files = parseAndSortFiles(getAllFromDirectory(lastFolderPath));
  const lastFile = files[files.length - 1];
  const lastNumber = lastFolderName.replace("output-", "");

  formatLastFileInLastFolderRecursiveUpdated(
    lastFolderPath,
    lastFile,
    lastNumber,
    sqrtNum
  );

  const targetFolderPath = `./output-big/output-${sqrtNum}`;
  copyAllFiles(files, lastFolderPath, targetFolderPath);

  return checkDivisorFromFiles(num, targetFolderPath)
    ? `${num} is not a prime number.`
    : `${num} is a prime number.`;
};
////// console.log(isPrimeFromTextRecursiveUpdated("1990999900943"))
////// console.log(isPrimeFromTextRecursive("1000000"))
////// Quick way for checking if a number is prime or not
////// If the sqrt(number) is greater than what we have, this will create the new file for sqrt(num)

export {
  isDivisor,
  findPrimeFactor,
  isPrime,
  isSophiePrime,
  isTwinPrime,
  isIsolatedPrime,
  checkPrimeInFiles,
  isPrimeUsingFiles,
  isPrimeUsingFilesUpdated,
  checkDivisorsFromFiles,
  checkDivisorFromFiles,
  isPrimeFromText,
  isPrimeFromTextRecursive,
  isPrimeFromTextRecursiveUpdated,
  isPrimeFromTextFiles,
  isPrimeFromTextFilesUpdated,
  isPrimeFromTextFilesRecursive,
  isPrimeFromTextFilesRecursiveUpdated,
};
