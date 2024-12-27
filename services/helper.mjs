import { addNumbers, divideNumbers, findMax } from "./mathOperations.mjs";
import { readFileSync as fsReadFileSync } from "fs";
import { isPrimeUsingFiles } from "./primeChecker.mjs";
import { calculateDivisors } from "./numberDivisors.mjs";
import {
  copyFilesToFolder,
  copySelectedFiles,
  createOutputFolder,
  parseAndSortFiles,
  primesInFile,
  writeDataToFile,
} from "./fileOperations.mjs";
import {
  generatePrimesUpTo,
  generatePrimesUpToRecursive,
} from "./primeGenerator.mjs";
// Generate partitions for range-based operations
const generatePartitions = (limit, range) => {
  if (divideNumbers(range, "1")[0] === "0")
    throw new Error("Range must be greater than 0.");

  const partitions = [];
  let current = "0";

  // Loop until the current partition exceeds the limit
  while (findMax(current, limit) !== current || current === limit) {
    partitions.push(current);
    current = addNumbers(current, range);
  }

  return partitions;
};

const findCountsInFile = (filePath) => {
  const data = fsReadFileSync(filePath, "utf-8")
    .split("\n")
    .slice(-2)
    .map((line) => {
      return line
        .replace(/\|.*/, "")
        .replace("(", "")
        .replace(")", "")
        .replace(" ", "");
    });

  return data;
};

// Main method 6: Main function to check if a number is prime and return detailed output
const checkAndExplainPrimeStatus = (
  number,
  source = "./output-big",
  partition = "1"
) => {
  const isPrimeNumber = isPrimeUsingFiles(number, source, partition);

  if (typeof isPrimeNumber !== "boolean") return isPrimeNumber; // Message from `findMatchingFolder` if folder not found
  if (isPrimeNumber === true)
    return `\n------\n${number} is a prime number.\n------\n`;

  const divisors = calculateDivisors(number, partition);
  return `\n------\n${number} is not a prime number.\n\nIt has these divisors: ${divisors.join(
    ", "
  )}\n------\n`;
};

// Extract data from the last file and filter based on the target number
const filterLastFileData = (filePath, targetNumber) => {
  const data = primesInFile(filePath);

  let count = 0;
  const filteredData = [];
  for (const item of data) {
    if (findMax(item, targetNumber) === targetNumber || item === targetNumber) {
      filteredData.push(
        count % 20 === 0 ? `\n(${count}) | ${item},` : `${item},`
      );
      count++;
    } else {
      break;
    }
  }
  return filteredData.join("");
};

// Copy prime data from source to target folder
const copyPrimeDataToTarget = (
  sourceFolder,
  folderNumber,
  targetNumber,
  getDirsFunc,
  fileToSearch
) => {
  if (folderNumber === targetNumber) {
    return `Output for ${targetNumber} already exists.`;
  }

  const targetFolder = createOutputFolder(targetNumber);
  const files = parseAndSortFiles(getDirsFunc(sourceFolder));

  const fileIndex = files.indexOf(fileToSearch.split(`${sourceFolder}/`)[1]);
  if (fileIndex === -1) throw new Error(`File ${fileToSearch} not found.`);

  const filesToCopy = files.slice(0, fileIndex);
  copyFilesToFolder(sourceFolder, targetFolder, filesToCopy);

  const dataBuffer = filterLastFileData(fileToSearch, targetNumber);
  writeDataToFile(targetFolder, files[fileIndex], dataBuffer);
};

const dataFromSelectedFile = (sourceFolder, selectedFile, num) => {
  const lastFileData = fsReadFileSync(
    `${sourceFolder}/${selectedFile}`,
    "utf-8"
  )
    .replace(/\n.*\| /g, "")
    .replace(/\n(.*)/g, "")
    .split(",");

  return lastFileData
    .filter((item) => findMax(item, num) !== item || item === num)
    .join(", ");
};

const filterLineData = (line, num, lastCount = "") => {
  const lineElements = line.split(",");
  const lineElementsSize = lineElements.length;
  const lastPrime = lineElements[lineElementsSize - 2];
  if (findMax(lastPrime, num) !== lastPrime)
    return lastPrime !== num
      ? [line, true]
      : [line + `,\n(${lastCount})`, false];

  const firstElementArray = lineElements[0].split(" | ");
  lineElements[0] = firstElementArray[1];
  const countToLastLine = firstElementArray[0]
    .replace("(", "")
    .replace(")", "");
  let count = countToLastLine;
  if (findMax(lineElements[0], num) === lineElements[0])
    return [`(${count})`, false];

  const filteredLastLine = lineElements.slice(0, -1).filter((item) => {
    if (findMax(item, num) !== item || item === num) {
      count = addNumbers(count, "1");
      return true;
    }
  });
  filteredLastLine[0] = `(${countToLastLine}) | ${filteredLastLine[0]}`;
  return [filteredLastLine.join(",") + `,\n(${count})`, false];
};

const formattedDataFromSelectedFile = (sourceFolder, selectedFile, num) => {
  const fileLines = fsReadFileSync(
    `${sourceFolder}/${selectedFile}`,
    "utf-8"
  ).split("\n");

  const lastCount = fileLines.pop();
  const lastFilteredData = [];
  for (const line of fileLines) {
    const lineResult = filterLineData(line, num, lastCount);
    lastFilteredData.push(lineResult[0]);
    if (!lineResult[1]) break;
  }
  return lastFilteredData.join("\n");
};

// Copy all prime outputs from the largest folder
const copyAllPrimeOutputs = (sourceFolder, num, getDirsFunc) => {
  const files = parseAndSortFiles(getDirsFunc(sourceFolder));
  const targetFolder = createOutputFolder(num);
  const selectedFile = copySelectedFiles(
    sourceFolder,
    targetFolder,
    files,
    num
  );

  const lastFilteredData = formattedDataFromSelectedFile(
    sourceFolder,
    selectedFile,
    num
  );
  return {
    lastFilteredData,
    folder: targetFolder,
    targetFileName: selectedFile,
  };
};

const generateScientificRepresentation = (divisors) => {
  const counts = divisors.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => (count === 1 ? `${key}` : `${key}**${count}`))
    .join(" * ");
};

const formatLastFileInLastFolder = (
  sourceFolder,
  lastFile,
  lastNumber,
  sqrtNum
) => {
  const fileLines = fsReadFileSync(
    `${sourceFolder}/${lastFile}`,
    "utf-8"
  ).split("\n");
  const lastCount = fileLines.pop().replace("(", "").replace(")", "");
  const dataBuffer = fileLines.join("\n");
  const pageIndex = lastFile.replace("Output", "").replace(".txt", "");
  lastNumber = addNumbers(lastNumber, "1");
  generatePrimesUpTo(sqrtNum, lastNumber, dataBuffer, +lastCount, +pageIndex);
};

const formatLastFileInLastFolderRecursive = (
  sourceFolder,
  lastFile,
  lastNumber,
  sqrtNum
) => {
  const fileLines = fsReadFileSync(
    `${sourceFolder}/${lastFile}`,
    "utf-8"
  ).split("\n");
  const lastCount = fileLines.pop().replace("(", "").replace(")", "");
  const dataBuffer = fileLines.join("\n");
  const pageIndex = lastFile.replace("Output", "").replace(".txt", "");
  lastNumber = addNumbers(lastNumber, "1");
  generatePrimesUpToRecursive(
    sqrtNum,
    lastNumber,
    dataBuffer,
    +lastCount,
    +pageIndex
  );
};

export {
  generatePartitions,
  findCountsInFile,
  checkAndExplainPrimeStatus,
  filterLastFileData,
  copyPrimeDataToTarget,
  dataFromSelectedFile,
  filterLineData,
  formattedDataFromSelectedFile,
  copyAllPrimeOutputs,
  generateScientificRepresentation,
  formatLastFileInLastFolder,
  formatLastFileInLastFolderRecursive,
};
