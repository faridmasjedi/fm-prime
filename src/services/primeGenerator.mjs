import { addNumbers, findMax } from "./mathOperations.mjs";

import {
  getAllFromDirectory,
  numFolderExist,
  copyFilesAndFormatLastFile,
  createOutputFolder,
  writeDataToFile,
  findLargestOutputFolder,
  copyFilesAndFormatLastFileUpdated,
  primesInFile,
  parseAndSortFiles,
} from "./fileOperations.mjs";

import {
  isPrime,
  isPrimeFromTextFilesRecursive,
  isPrimeFromTextFilesRecursiveUpdated,
} from "./primeChecker.mjs";
import { copyAllPrimeOutputs, findNextCandidate } from "./helper.mjs";

/**
 * Generates all prime numbers up to a given number and writes the results to a text file.
 * @param {string} number - The upper limit for prime generation.
 * @param {string} [current="2"] - The starting number for prime generation.
 * @param {string} [dataBuffer=""] - A buffer for temporarily storing generated primes.
 * @param {number} [count=0] - Counter for the total primes generated.
 * @param {number} [pageIndex=0] - Index for output file pagination.
 * @returns {number} - Total count of primes generated.
 */
const generatePrimesUpTo = (
  number,
  current = "2",
  dataBuffer = "",
  count = 0,
  pageIndex = 0
) => {
  const startTime = Date.now();
  let checkFolderName = numFolderExist(number);
  if (checkFolderName) {
    // Folder exists, read and return the primes
    const files = getAllFromDirectory(checkFolderName);
    const sortedFiles = parseAndSortFiles(files.filter(f => f.startsWith('Output') || f.startsWith('output')));

    const allPrimes = [];
    for (const file of sortedFiles) {
      const filePath = `${checkFolderName}/${file}`;
      const primes = primesInFile(filePath);
      for (const p of primes) {
        let trimmed = p.trim();
        // Handle case where first element might be "(0) | 2" - extract just the number
        if (trimmed.includes('|')) {
          const parts = trimmed.split('|');
          if (parts.length > 1) {
            trimmed = parts[1].trim();
          }
        }
        // Skip empty strings and standalone index markers like "(664579)"
        if (trimmed && trimmed !== '' && !trimmed.startsWith('(')) {
          allPrimes.push(trimmed);
        }
      }
    }
    return allPrimes;
  }
  const folderName = createOutputFolder(number);
  while (findMax(current, number) !== current || current === number) {
    if (isPrime(current)) {
      console.log("current prime:", current);
      if (count % 1000000 === 0 && count !== 0) {
        if (!dataBuffer.includes(`(${count})`)) dataBuffer += `\n(${count})`;
        writeDataToFile(folderName, pageIndex, dataBuffer);
        dataBuffer = "";
        pageIndex++;
      }
      dataBuffer +=
        count % 20 === 0 ? `\n(${count}) | ${current},` : `${current},`;
      count++;
    }
    current = addNumbers(current, "1");
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);

  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};
const generatePrimesUpToUpdated = (
  number,
  current = "2",
  dataBuffer = "",
  count = 0,
  pageIndex = 0
) => {
  const startTime = Date.now();
  let checkFolderName = numFolderExist(number);
  if (checkFolderName) return;
  const folderName = createOutputFolder(number);
  while (findMax(current, number) !== current || current === number) {
    if (isPrime(current)) {
      console.log("current prime:", current);
      if (count % 1000000 === 0 && count !== 0) {
        if (!dataBuffer.includes(`(${count})`)) dataBuffer += `\n(${count})`;
        writeDataToFile(folderName, pageIndex, dataBuffer);
        dataBuffer = "";
        pageIndex++;
      }
      dataBuffer +=
        count % 20 === 0 ? `\n(${count}) | ${current},` : `${current},`;
      count++;
    }

    current = findNextCandidate(current);
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);

  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};

/**
 * Generates prime numbers within a specified range and returns them as an array.
 * @param {string} start - The starting number for the range.
 * @param {string} end - The ending number for the range.
 * @param {string} [partition="1"] - Partitioning factor for optimized prime checking.
 * @returns {Array<string>} - An array of prime numbers within the specified range.
 */
const generatePrimesInRange = (start, end, partition = "1") => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    if (isPrime(current, partition)) {
      console.log(`${current} is a prime number`);
      primesInRange.push(current);
    }
    current = addNumbers(current, "1");
  }
  return primesInRange;
};
const generatePrimesInRangeUpdated = (start, end, partition = "1") => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    console.log(`Checking ${current} number`);
    if (isPrime(current, partition)) {
      console.log(`${current} is a prime number`);
      primesInRange.push(current);
    }
    current = findNextCandidate(current);
  }
  return primesInRange;
};
const generatePrimesInRangeTextFiles = (start, end, partition = "1") => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    if (isPrimeFromTextFilesRecursive(current, partition)) {
      console.log(`${current} is a prime number`);
      primesInRange.push(current);
    }
    current = findNextCandidate(current);
  }
  return primesInRange;
};
const generatePrimesInRangeTextFilesUpdated = (start, end, partition = "1") => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    if (isPrimeFromTextFilesRecursiveUpdated(current, partition)) {
      console.log(`${current} is a prime number`);
      primesInRange.push(current);
    }
    current = findNextCandidate(current);
  }
  return primesInRange;
};

/**
 * Generates prime output data based on existing text files.
 * @param {string} num - The upper limit for the new prime output.
 * @param {Function} [getDirsFunc=getAllFromDirectory] - Function to retrieve directories.
 * @returns {string} - Message indicating the result of the operation.
 */
const generatePrimeOutputFromText = (
  num,
  getDirsFunc = getAllFromDirectory
) => {
  if (numFolderExist(num)) return;
  const source = "./output-big";
  const largestOutput = findLargestOutputFolder(source, getDirsFunc);
  const sourceFolder = `${source}/${largestOutput}`;
  const folderNumber = largestOutput.split("-")[1];
  if (findMax(folderNumber, num) === num)
    return `${num} is greater than largest output`;
  const { lastFilteredData, folder, targetFileName } = copyAllPrimeOutputs(
    sourceFolder,
    num,
    getDirsFunc
  );

  writeDataToFile(folder, targetFileName, lastFilteredData);
};
/// Example for creating folders for each number.
/// console.log(generatePrimeOutputFromText("100000"))

/**
 * Generates all primes up to a number using a recursive primality checking method.
 * @param {string} number - The upper limit for prime generation.
 * @param {string} [current="2"] - The starting number for prime generation.
 * @param {string} [dataBuffer=""] - A buffer for temporarily storing generated primes.
 * @param {number} [count=0] - Counter for the total primes generated.
 * @param {number} [pageIndex=0] - Index for output file pagination.
 * @returns {number} - Total count of primes generated.
 */
const generatePrimesUpToRecursive = (
  number,
  current = "2",
  dataBuffer = "",
  count = 0,
  pageIndex = 0
) => {
  let checkFolderName = numFolderExist(number);
  if (checkFolderName) return;
  const folderName = createOutputFolder(number);
  while (findMax(current, number) !== current || current === number) {
    if (isPrimeFromTextFilesRecursive(current)) {
      console.log("current prime:", current);
      if (count % 1000000 === 0 && count !== 0) {
        if (!dataBuffer.includes(`(${count})`)) dataBuffer += `\n(${count})`;
        writeDataToFile(folderName, pageIndex, dataBuffer);
        dataBuffer = "";
        pageIndex++;
      }
      dataBuffer +=
        count % 20 === 0 ? `\n(${count}) | ${current},` : `${current},`;
      count++;
    }
    current = addNumbers(current, "1");
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);
  return count;
};
const generatePrimesUpToRecursiveUpdated = (
  number,
  current = "2",
  dataBuffer = "",
  count = 0,
  pageIndex = 0
) => {
  const startTime = Date.now();
  let checkFolderName = numFolderExist(number);
  if (checkFolderName) return;
  const folderName = createOutputFolder(number);
  while (findMax(current, number) !== current || current === number) {
    if (isPrimeFromTextFilesRecursive(current)) {
      console.log("current prime:", current);
      if (count % 1000000 === 0 && count !== 0) {
        if (!dataBuffer.includes(`(${count})`)) dataBuffer += `\n(${count})`;
        writeDataToFile(folderName, pageIndex, dataBuffer);
        dataBuffer = "";
        pageIndex++;
      }
      dataBuffer +=
        count % 20 === 0 ? `\n(${count}) | ${current},` : `${current},`;
      count++;
    }
    current = findNextCandidate(current);
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);
  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};
const generatePrimesRecursiveUpdated = (
  startNum,
  endNum,
  current = startNum,
  primesArray = []
) => {
  // Return cached primes if folder exists
  let checkFolderName = numFolderExist(endNum.toString());
  if (checkFolderName) {
    // Folder exists, read and return the primes in range
    const files = getAllFromDirectory(checkFolderName);
    const sortedFiles = parseAndSortFiles(files.filter(f => f.startsWith('Output') || f.startsWith('output')));

    const allPrimes = [];
    for (const file of sortedFiles) {
      const filePath = `${checkFolderName}/${file}`;
      const primes = primesInFile(filePath);
      for (const p of primes) {
        let trimmed = p.trim();
        if (trimmed.includes('|')) {
          const parts = trimmed.split('|');
          if (parts.length > 1) {
            trimmed = parts[1].trim();
          }
        }
        if (trimmed && trimmed !== '' && !trimmed.startsWith('(')) {
          const primeNum = parseInt(trimmed);
          if (primeNum >= startNum && primeNum <= endNum) {
            allPrimes.push(trimmed);
          }
        }
      }
    }
    return allPrimes;
  }

  // Generate primes without recursion to avoid stack overflow
  const start = typeof startNum === 'string' ? parseInt(startNum) : startNum;
  const end = typeof endNum === 'string' ? parseInt(endNum) : endNum;

  for (let num = start; num <= end; num++) {
    // Skip even numbers except 2
    if (num > 2 && num % 2 === 0) continue;

    // Use the optimized prime checker
    if (isPrimeFromTextFilesRecursiveUpdated(num)) {
      primesArray.push(num.toString());
    }
  }

  return primesArray;
};

/**
 * Generates prime number files for a specified number using existing data and creates new output if necessary.
 *
 * @param {string} num - The target number for which prime number files will be generated.
 *
 * @description
 * This method performs the following steps:
 * 1. Attempts to generate prime data for the specified number by leveraging existing folders and files using `generatePrimeOutputFromText`.
 * 2. If the target number exceeds the range of the largest existing output, it:
 *    - Formats the last file of the current largest output folder.
 *    - Copies all relevant files to create a new output folder for the specified number using `copyFilesAndFormatLastFile`.
 *
 * This method ensures that the data generation process efficiently uses pre-existing outputs and only extends the range when required.
 */

const generatePrimesFiles = (num) => {
  const generateFromExisitingFoldersResult = generatePrimeOutputFromText(num);
  if (
    !generateFromExisitingFoldersResult?.includes(
      `is greater than largest output`
    )
  )
    return;
  copyFilesAndFormatLastFile(num);
};
const generatePrimesFilesUpdated = (num) => {
  const generateFromExisitingFoldersResult = generatePrimeOutputFromText(num);
  if (
    !generateFromExisitingFoldersResult?.includes(
      `is greater than largest output`
    )
  )
    return;
  copyFilesAndFormatLastFileUpdated(num);
};

export {
  generatePrimesUpTo,
  generatePrimesUpToUpdated,
  generatePrimesFiles,
  generatePrimesFilesUpdated,
  generatePrimesInRange,
  generatePrimesInRangeUpdated,
  generatePrimeOutputFromText,
  generatePrimesUpToRecursive,
  generatePrimesUpToRecursiveUpdated,
  generatePrimesInRangeTextFiles,
  generatePrimesInRangeTextFilesUpdated,
  generatePrimesRecursiveUpdated,
};
