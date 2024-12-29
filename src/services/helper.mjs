import {
  addNumbers,
  divideNumbers,
  findMax,
  multiplyNumbers,
  subtractNumbers,
} from "./mathOperations.mjs";
import { readFileSync as fsReadFileSync } from "fs";
import {
  isPrimeFromTextFilesRecursiveUpdated,
  isPrimeUsingFiles,
  isPrimeUsingFilesUpdated,
} from "./primeChecker.mjs";
import {
  calculateDivisors,
  calculateDivisorsUpdated,
} from "./numberDivisors.mjs";
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
  generatePrimesUpToUpdated,
  generatePrimesUpToRecursive,
  generatePrimesUpToRecursiveUpdated,
  generatePrimesRecursiveUpdated,
} from "./primeGenerator.mjs";

/**
 * Generates partitions for range-based operations.
 * @param {string} limit - The upper limit for partitions.
 * @param {string} range - The range of each partition.
 * @returns {string[]} - Array of partition starting points as strings.
 */
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

/**
 * Finds the next prime candidate based on the current number.
 *
 * This function uses a mapping strategy for the smallest prime numbers
 * (2 and 3) and a mathematical approach for larger numbers to determine
 * the next potential prime candidate. It leverages modular arithmetic and
 * the 6k ± 1 rule for efficient computation of prime candidates.
 *
 * @param {string} current - The current number as a string.
 * @returns {string} - The next potential prime candidate as a string.
 */
const findNextCandidate = (current) => {
  const nextCandidateMap = {
    2: "3", // After 2, the next prime is 3.
    3: "5", // After 3, the next prime is 5.
    else: (current) => {
      const divide = divideNumbers(current, "6")
      // If current + 1 is divisible by 6, return current + 2
      if (divide[1] === "5") return addNumbers(current, "2");

      // If current - 1 is divisible by 6, return current + 4
      if (divide[1] === "1") return addNumbers(current, "4");

      // Default to 6k - 1 approach
      return subtractNumbers(
        multiplyNumbers(addNumbers(divide[0], "1"), "6"),
        "1"
      );
    },
  };

  // Return directly mapped values or compute using the "else" case
  return nextCandidateMap[current] || nextCandidateMap["else"](current);
};

/**
 * Finds the count and last element in a file.
 * @param {string} filePath - Path to the file.
 * @returns {string[]} - Array containing count and last number as strings.
 */
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

/**
 * Checks if a number is prime and provides detailed output.
 * @param {string} number - The number to check.
 * @param {string} source - Path to the folder containing prime data.
 * @param {string} partition - Partition size for prime calculations.
 * @returns {string} - A message indicating whether the number is prime or not.
 */
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
const checkAndExplainPrimeStatusUpdated = (number, source = "./output-big") => {
  const isPrimeNumber = isPrimeFromTextFilesRecursiveUpdated(number, source);

  if (typeof isPrimeNumber !== "boolean") return isPrimeNumber; // Message from `findMatchingFolder` if folder not found
  if (isPrimeNumber === true)
    return `\n------\n${number} is a prime number.\n------\n`;

  const divisors = calculateDivisorsUpdated(number);
  return `\n------\n${number} is not a prime number.\n\nIt has these divisors: ${divisors.join(
    ", "
  )}\n------\n`;
};

/**
 * Filters data from the last file based on the target number.
 * @param {string} filePath - Path to the file.
 * @param {string} targetNumber - The target number for filtering.
 * @returns {string} - Filtered data as a string.
 */
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

/**
 * Copies prime data from a source folder to a target folder.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} folderNumber - Number representing the source folder.
 * @param {string} targetNumber - Number for the target folder.
 * @param {Function} getDirsFunc - Function to retrieve directory contents.
 * @param {string} fileToSearch - File name to search in the source folder.
 */
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

/**
 * Retrieves data from a selected file and filters it based on a number.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} selectedFile - The selected file name.
 * @param {string} num - Target number for filtering.
 * @returns {string} - Filtered data as a string.
 */
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

/**
 * Filters a single line of data based on the target number.
 * @param {string} line - Line of data to filter.
 * @param {string} num - Target number for filtering.
 * @param {string} [lastCount=""] - Last count from the previous line.
 * @returns {[string, boolean]} - Filtered line and a flag indicating if more processing is needed.
 */
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

/**
 * Formats data from a selected file and filters it based on a number.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} selectedFile - The selected file name.
 * @param {string} num - Target number for filtering.
 * @returns {string} - Filtered data as a string.
 */
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

/**
 * Copies all prime outputs from the largest folder to a new folder.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} num - Target number for creating the folder.
 * @param {Function} getDirsFunc - Function to retrieve directory contents.
 * @returns {Object} - Contains filtered data, folder path, and target file name.
 */
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

/**
 * Generates a scientific representation of divisors.
 * @param {string[]} divisors - Array of divisors.
 * @returns {string} - Scientific representation of the divisors.
 */
const generateScientificRepresentation = (divisors) => {
  const counts = divisors.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => (count === 1 ? `${key}` : `${key}**${count}`))
    .join(" * ");
};

/**
 * Formats the last file in a folder for recursive prime generation.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} lastFile - Name of the last file.
 * @param {string} lastNumber - Last processed number.
 * @param {string} sqrtNum - Square root number for prime generation.
 */
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
  generatePrimesUpToUpdated(
    sqrtNum,
    lastNumber,
    dataBuffer,
    +lastCount,
    +pageIndex
  );
};

/**
 * Formats the last file in a folder for recursive prime generation.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} lastFile - Name of the last file.
 * @param {string} lastNumber - Last processed number.
 * @param {string} sqrtNum - Square root number for prime generation.
 */
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
  generatePrimesUpToRecursiveUpdated(
    sqrtNum,
    lastNumber,
    dataBuffer,
    +lastCount,
    +pageIndex
  );
};
const formatLastFileInLastFolderRecursiveUpdated = (
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
  lastNumber = findNextCandidate(lastNumber);
  generatePrimesRecursiveUpdated(
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
  checkAndExplainPrimeStatusUpdated,
  filterLastFileData,
  copyPrimeDataToTarget,
  dataFromSelectedFile,
  filterLineData,
  formattedDataFromSelectedFile,
  copyAllPrimeOutputs,
  generateScientificRepresentation,
  formatLastFileInLastFolder,
  formatLastFileInLastFolderRecursive,
  findNextCandidate,
  formatLastFileInLastFolderRecursiveUpdated,
};
