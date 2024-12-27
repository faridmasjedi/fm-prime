import {
  addNumbers,
  findMax,
  multiplyNumbers,
  subtractNumbers,
} from "./mathOperations.mjs";

import {
  getAllFromDirectory,
  numFolderExist,
  createOutputFolder,
  writeDataToFile,
  findLargestOutputFolder,
} from "./fileOperations.mjs";

import { readFileSync as fsReadFileSync } from "fs";
import { isPrime, isPrimeFromTextFilesRecursive } from "./primeChecker.mjs";
import { copyAllPrimeOutputs } from "./helper.mjs";
///////////////////////////////////////////////////

// Main method 3: Generate all primes up to a number
const generatePrimesUpTo = (
  number,
  current = "2",
  dataBuffer = "",
  count = 0,
  pageIndex = 0,
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
    current = addNumbers(current, "1");
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);

  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};

// Main method 4: Generate primes within a range
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

// Main method 7: Generate prime output from existing text files
const generatePrimeOutputFromText = (
  num,
  getDirsFunc = getAllFromDirectory
) => {
  const source = "./output-big";
  const largestOutput = findLargestOutputFolder(source, getDirsFunc);
  const sourceFolder = `${source}/${largestOutput}`;
  const folderNumber = largestOutput.split("-")[1];
  if (folderNumber === num) {
    return `Output for ${num} already exists.`;
  }
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
//console.log(generatePrimeOutputFromText("100000"))

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

export {
    generatePrimesUpTo,
    generatePrimesInRange,
    generatePrimeOutputFromText,
    generatePrimesUpToRecursive
};
