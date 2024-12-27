import {
  copyAllFiles,
  findLastExistingFolderNumber,
  findMatchingFile,
  findMatchingFolder,
  getAllFromDirectory,
  parseAndSortFiles,
  primesInFile,
} from "./fileOperations.mjs";
import {
  formatLastFileInLastFolder,
  formatLastFileInLastFolderRecursive,
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

import { readFileSync as fsReadFileSync } from "fs";

// Check if a candidate is a divisor of a number
const isDivisor = (number, candidate) => {
  if (!candidate) return false;
  return divideNumbers(number, candidate)[1] === "0" && number !== candidate;
};

// Find a prime factor of a number
const findPrimeFactor = (num, factor) => {
  if (isDivisor(num, factor)) return factor;
  const nextFactor = addNumbers(factor, "2");
  return isDivisor(num, nextFactor) ? nextFactor : false;
};

const checkNumberInFile = (num, folder, file) => {
  const filePath = file.includes(folder) ? file : `${folder}/${file}`;
  const fileData = fsReadFileSync(filePath, "utf-8");
  const pattern1 = `| ${num},`;
  const pattern2 = `,${num},`;
  if (fileData.includes(pattern1) || fileData.includes(pattern2)) {
    console.log(`${num} is prime ---> ref: ${filePath}`);
    return true;
  }
  return false;
};

// Main method 1: Check if a number is prime
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

////////
const isSophiePrime = (number) => {
  if (!isPrime(number)) {
    return `${number} is not a prime.`;
  }

  const sophieNumber = addNumbers("1", multiplyNumbers("2", number));
  return isPrime(sophieNumber)
    ? `${number} is a Sophie prime.`
    : `${number} is not a Sophie prime.`;
};

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

//////////
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

const checkPrimeInFiles = (num) => {
  const folder = findMatchingFolder("./output-big", num);
  if (folder.includes("is larger than")) return false;

  const files = parseAndSortFiles(getAllFromDirectory(folder));
  for (const file of files) {
    if (checkNumberInFile(num, folder, file)) return true;
  }
  return false;
};

// Main method 5: Check if a number is prime using available files or fallback methods
const isPrimeUsingFiles = (
  number,
  source = "./output-big",
  partition = "1"
) => {
  const folder = findMatchingFolder(source, number);
  if (typeof folder === "string" && folder.includes("is larger")) {
    return isPrime(number, partition);
  }

  const file = findMatchingFile(folder, number);
  return file
    ? checkNumberInFile(number, folder, file)
    : isPrime(number, partition);
};

const checkDivisorsFromFiles = (num, folder, divisors = []) => {
  if (checkPrimeInFiles(num)) {
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
      return checkDivisorsFromFiles(reducedNum, folder, divisors, firstNum);
    }
    
    if (reducedNum === num){
      divisors.push(num)
      return divisors
    }
    
  }
};

const checkDivisorFromFiles = (num, folder) => {
  if (checkPrimeInFiles(num)) return false;

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

// Main 9
const isPrimeFromText = (num) => {
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  const folder = findMatchingFolder(source, sqrtNum);
  if (folder && !folder.includes("larger than"))
    return checkDivisorFromFiles(num, folder)
      ? `${num} is not a prime number.`
      : `${num} is a prime number.`;
  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  console.log("Checking divisors in the last existing folder...");
  if (checkDivisorFromFiles(num, lastFolderPath))
    return `${num} is not a prime number.`;

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

// Main 10
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
  if (checkDivisorFromFiles(num, lastFolderPath))
    return `${num} is not a prime number.`;
  const lastNumber = lastFolderName.replace("output-", "");
  return checkDivisorNotExistOnTextFiles(
    num,
    sqrtNum,
    addNumbers(lastNumber, "1")
  );
};

const notPrimeBasicChecker = (number) => {
  if (number === "1") {
    console.log("number 1 is not a prime number.");
    return true;
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

// Main 11
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
  // return isPrimeFromTextFilesRecursive(sqrtNum);
};

// Main
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
  checkDivisorsFromFiles,
  checkDivisorFromFiles,
  isPrimeFromText,
  isPrimeFromTextRecursive,
  isPrimeFromTextFiles,
  isPrimeFromTextFilesRecursive,
};
