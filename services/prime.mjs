import {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
  isDivisibleBy2,
  isDivisibleBy3,
  isDivisibleBy6,
  findMax,
} from "./mathOperation.mjs";

import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";

import { execSync } from "child_process";

// Create output folder
const createOutputFolder = (number) => {
  const rootFolder = "./output-big";
  if (!fsExistsSync(rootFolder)) fsMkdirSync(rootFolder, { recursive: true });

  const dir = `./output-big/output-${number}`;
  if (!fsExistsSync(dir)) {
    fsMkdirSync(dir, { recursive: true });
    return dir;
  }
  throw new Error(`\n-----------\n${dir} already exists!\n---------------\n`);
};

// Generate partitions for range-based operations
const generatePartitions = (limit, range) => {
  if (range <= 0) throw new Error("Range must be greater than 0.");
  return Array.from({ length: Math.ceil(+limit / range) }, (_, i) =>
    multiplyNumbers(i.toString(), range.toString())
  );
};

// Check if a candidate is a divisor of a number
const isDivisor = (number, candidate) => {
  return divideNumbers(number, candidate)[1] === "0" && number !== candidate;
};

// Find a prime factor of a number
const findPrimeFactor = (num, factor) => {
  if (isDivisor(num, factor)) return factor;
  const nextFactor = addNumbers(factor, "2");
  return isDivisor(num, nextFactor) ? nextFactor : -1;
};

// Check if a number is prime
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
    for (let k = 0; k < +partitionRange; k++) {
      const candidate = addNumbers(
        "5",
        multiplyNumbers("6", addNumbers(k.toString(), partition.toString()))
      );
      const nextCandidate = addNumbers(candidate, "2");

      if (isDivisor(number, candidate) || isDivisor(number, nextCandidate)) {
        return false;
      }
    }
  }

  return true;
};

// Calculate all divisors of a number
const calculateDivisors = (num) => {
  const divisors = ["1"];
  while (num !== "1") {
    if (isPrime(num)) {
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
  return divisors.sort((a, b) => +a - +b);
};

// Write data to a file
const writeDataToFile = (folderName, filename, data) => {
  const filePath = ("" + filename).includes("Output")
    ? `${folderName}/${filename}`
    : `${folderName}/Output${filename}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
};

// Generate all primes up to a number
const generatePrimesUpTo = (number) => {
  const startTime = Date.now();
  let pageIndex = 0;
  const folderName = createOutputFolder(number);
  let count = 0;
  let dataBuffer = "";
  let current = "2";

  while (findMax(current, number) !== current || current === number) {
    if (isPrime(current)) {
      if (count % 9000 === 0 && count !== 0) {
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

// Generate primes within a range
const generatePrimesInRange = (start, end) => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    if (isPrime(current)) {
      primesInRange.push(current);
    }
    current = addNumbers(current, "1");
  }
  return primesInRange;
};

// Write primes to file for a range
const writePrimesToFile = (start, end, folderName) => {
  const primesInRange = generatePrimesInRange(start, end);
  const dataBuffer = primesInRange.join(", ");
  writeDataToFile(folderName, 0, dataBuffer);
  return primesInRange.length;
};

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

// Retrieve all files/directories from a specified source
const getAllFromDirectory = (source) => fsReadDirSync(source);

// Find the appropriate folder for a given number
const findMatchingFolder = (source, number) => {
  const outputs = getAllFromDirectory(source);
  const sortedOutputs = outputs
      .filter((folder) => folder.startsWith("output-"))
      .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));

  const result = sortedOutputs.find((output) => {
    const folderNumber = output.split("-")[1];
    return findMax(folderNumber, number) !== number;
  });

  if (result) {
    return `${source}/${result}`;
  }

  return `\n${number} is larger than the available outputs.\nUse isPrime method.`;
};

// Find the appropriate file within a folder for a given number
const findMatchingFile = (folder, number) => {
  const files = getAllFromDirectory(folder);
  const sortedFiles = files
      .filter((file) => file.startsWith("Output"))
      .sort((a, b) => parseInt(a.split("Output")[1]) - parseInt(b.split("Output")[1]));

  const matchingFile = sortedFiles.find((file) => {
    const data = fsReadFileSync(`${folder}/${file}`, "utf-8");
    const primes = data.split("|").flatMap((chunk) => chunk.split(","));
    const firstPrime = primes[1]?.trim() || "";
    const lastPrime = primes[primes.length - 2]?.trim() || "";
    const withinRange =
      findMax(firstPrime, number) === number &&
      findMax(lastPrime, number) === lastPrime;

    return withinRange;
  });

  return matchingFile ? `${folder}/${matchingFile}` : null;
};

// Check if a number is prime using available files or fallback methods
const isPrimeUsingFiles = (number, source = "./output-big") => {
  const folder = findMatchingFolder(source, number);
  if (typeof folder === "string" && folder.includes("is larger")) {
    return isPrime(number);
  }

  const file = findMatchingFile(folder, number);

  if (file) {
    const data = fsReadFileSync(file, "utf-8").replace(/\n.*\| /g, "");
    const primes = data.split(",");
    return primes.includes(number) ? true : false;
  }

  // Fallback to direct prime checking if no matching file is found
  return isPrime(number);
};

// Main function to check if a number is prime and return detailed output
const checkAndExplainPrimeStatus = (number, source = "./output-big") => {
  const isPrimeNumber = isPrimeUsingFiles(number, source);

  if (typeof isPrimeNumber !== "boolean") return isPrimeNumber; // Message from `findMatchingFolder` if folder not found
  if (isPrimeNumber === true)
    return `\n------\n${number} is a prime number.\n------\n`;

  const divisors = calculateDivisors(number);
  return `\n------\n${number} is not a prime number.\n\nIt has these divisors: ${divisors.join(
    ", "
  )}\n------\n`;
};

// Copy specified files from one folder to another
const copyFilesToFolder = (sourceFolder, targetFolder, files) => {
  files.forEach((file) => {
    const data = fsReadFileSync(`${sourceFolder}/${file}`, "utf-8");
    writeDataToFile(targetFolder, file, data);
  });
};

// Parse and sort files based on numerical suffix in their names
const parseAndSortFiles = (files) =>
  files
    .map((file) => ({
      name: file,
      number: parseInt(file.split("Output")[1], 10) || 0,
    }))
    .sort((a, b) => a.number - b.number)
    .map((file) => file.name);

// Extract data from the last file and filter based on the target number
const filterLastFileData = (filePath, targetNumber) => {
  const data = fsReadFileSync(filePath, "utf-8")
    .replace(/\n.*\| /g, "")
    .split(",");

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

// Find the largest output folder by number
const findLargestOutputFolder = (source, getDirsFunc) => {
  const outputs = getDirsFunc(source);
  return outputs.reduce((largest, current) => {
    const largestNum = parseInt(largest.split("-")[1] || "0", 10);
    const currentNum = parseInt(current.split("-")[1] || "0", 10);
    return currentNum > largestNum ? current : largest;
  }, outputs[0]);
};

const copySelectedFiles = (sourceFolder, targetFolder, files, num) => {
  const selectedFiles = files.filter((file) => {
    const data = fsReadFileSync(`${sourceFolder}/${file}`, "utf-8");
    const firstData = data.split("| ")[1].split(",")[0];
    return findMax(firstData, num) === num;
  });

  selectedFiles
    .slice(0, -1)
    .forEach((f) =>
      execSync(`cp -r ${sourceFolder}/${f} ${targetFolder}/${f}`)
    );
  return selectedFiles[selectedFiles.length - 1];
};

const dataFromSelectedFile = (sourceFolder, selectedFile, num) => {
  const lastFileData = fsReadFileSync(
    `${sourceFolder}/${selectedFile}`,
    "utf-8"
  )
    .replace(/\n.*\| /g, "")
    .split(",");

  return lastFileData
    .filter((item) => findMax(item, num) !== item || item === num)
    .join(", ");
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

  const lastFilteredData = dataFromSelectedFile(
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

// Generate prime output from existing text files
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

  const { lastFilteredData, folder, targetFileName } = copyAllPrimeOutputs(
    sourceFolder,
    num,
    getDirsFunc
  );

  writeDataToFile(folder, targetFileName, lastFilteredData);
};

export {
  createOutputFolder,
  generatePartitions,
  isDivisor,
  findPrimeFactor,
  isPrime,
  calculateDivisors,
  writeDataToFile,
  generatePrimesUpTo,
  generatePrimesInRange,
  writePrimesToFile,
  isSophiePrime,
  isTwinPrime,
  isIsolatedPrime,
  generatePrimeOutputFromText,
  getAllFromDirectory,
  findMatchingFolder,
  findMatchingFile,
  isPrimeUsingFiles,
  copyFilesToFolder,
  parseAndSortFiles,
  filterLastFileData,
  copyPrimeDataToTarget,
  findLargestOutputFolder,
  copySelectedFiles,
  dataFromSelectedFile,
  copyAllPrimeOutputs,
};
