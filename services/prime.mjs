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
  isDivisibleBy5,
} from "./mathOperation.mjs";

import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";

import { execSync } from "child_process";

// Check if the folder already exist
const numFolderExist = (number) => {
  const rootFolder = "./output-big";
  const dir = `${rootFolder}/output-${number}`;
  return fsExistsSync(dir)
    ? (() => {
        console.log(`${dir} already exists...`);
        return dir;
      })()
    : false;
};

// Create output folder
const createOutputFolder = (number) => {
  const rootFolder = "./output-big";
  if (!fsExistsSync(rootFolder)) fsMkdirSync(rootFolder, { recursive: true });

  const dir = `./output-big/output-${number}`;
  fsMkdirSync(dir, { recursive: true });
  return dir;
};

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

// Check if a candidate is a divisor of a number
const isDivisor = (number, candidate) => {
  if (!candidate) return false;
  return divideNumbers(number, candidate)[1] === "0" && number !== candidate;
};

// Find a prime factor of a number
const findPrimeFactor = (num, factor) => {
  if (isDivisor(num, factor)) return factor;
  const nextFactor = addNumbers(factor, "2");
  return isDivisor(num, nextFactor) ? nextFactor : -1;
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

// Main method 2: Calculate all divisors of a number
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

///////////////////////////////////////////////////
// Write data to a file
const writeDataToFile = (folderName, filename, data) => {
  const filePath = ("" + filename).includes("Output")
    ? `${folderName}/${filename}`
    : `${folderName}/Output${filename}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
};

// Main method 3: Generate all primes up to a number
const generatePrimesUpTo = (
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
    current = addNumbers(current, "1");
  }

  writeDataToFile(folderName, pageIndex, dataBuffer + `\n(${count})`);

  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};

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
// Main method 4: Generate primes within a range
const generatePrimesInRange = (start, end) => {
  const primesInRange = [];
  let current = start;
  while (findMax(current, end) !== current || current === end) {
    if (isPrime(current)) {
      console.log(`${current} is a prime number`);
      primesInRange.push(current);
    }
    current = addNumbers(current, "1");
  }
  return primesInRange;
};

/////////////////////////////
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

/////////////////////////////
// Retrieve all files/directories from a specified source
const getAllFromDirectory = (source) => fsReadDirSync(source);

// Parse and sort files based on numerical suffix in their names
const parseAndSortFiles = (files) =>
  files
    .map((file) => ({
      name: file,
      number: parseInt(file.split("Output")[1], 10) || 0,
    }))
    .sort((a, b) => a.number - b.number)
    .map((file) => file.name);

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

  return result
    ? `${source}/${result}`
    : `\n${number} is larger than the available outputs.\nUse isPrime method.`;
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

// Find the appropriate file within a folder for a given number
const findMatchingFile = (folder, number) => {
  const files = getAllFromDirectory(folder);
  const sortedFiles = files
    .filter((file) => file.startsWith("Output"))
    .sort(
      (a, b) => parseInt(a.split("Output")[1]) - parseInt(b.split("Output")[1])
    );

  const matchingFile = sortedFiles.find((file) => {
    const primes = primesInFile(`${folder}/${file}`);
    const firstPrime = primes[1]?.trim() || "";
    const lastPrime = primes[primes.length - 2]?.trim() || "";
    return (
      findMax(firstPrime, number) === number &&
      findMax(lastPrime, number) === lastPrime
    );
  });

  return matchingFile ? `${folder}/${matchingFile}` : null;
};

const primesInFile = (filePath) => {
  const data = fsReadFileSync(filePath, "utf-8")
    .replace(/\n.*\| /g, "")
    .replace(/\n(.*)/g, "")
    .split(",");
  return data;
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
const isPrimeUsingFiles = (number, source = "./output-big") => {
  const folder = findMatchingFolder(source, number);
  if (typeof folder === "string" && folder.includes("is larger")) {
    return isPrime(number);
  }

  const file = findMatchingFile(folder, number);
  return file ? checkNumberInFile(number, folder, file) : isPrime(number);
};

// Main method 6: Main function to check if a number is prime and return detailed output
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

///////////////////////////////
// Copy specified files from one folder to another
const copyFilesToFolder = (sourceFolder, targetFolder, files) => {
  files.forEach((file) => {
    const data = fsReadFileSync(`${sourceFolder}/${file}`, "utf-8");
    writeDataToFile(targetFolder, file, data);
  });
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

const checkDivisorsFromFiles = (num, folder, divisors = []) => {
  if (checkPrimeInFiles(num)) {
    divisors.push(num);
    return divisors;
  }
  const files = parseAndSortFiles(getAllFromDirectory(folder));
  for (const file of files) {
    const primes = primesInFile(`${folder}/${file}`);
    const divisor = primes.find(
      (prime) => divideNumbers(num, prime)[1] === "0"
    );

    if (divisor) {
      divisors.push(divisor);
      const reducedNum = divideNumbers(num, divisor)[0];
      return checkDivisorsFromFiles(reducedNum, folder, divisors);
    }
  }
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

const generateScientificRepresentation = (divisors) => {
  const counts = divisors.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([key, count]) => (count === 1 ? `${key}` : `${key}**${count}`))
    .join(" * ");
};

/////////////////////////////////
const findLastExistingFolderNumber = (source = "./output-big") => {
  const outputs = getAllFromDirectory(source);
  const sortedOutputs = outputs
    .filter((folder) => folder.startsWith("output-"))
    .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
  return sortedOutputs[sortedOutputs.length - 1];
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

const copyAllFiles = (files, sourcePath, targetFolder) => {
  files
    .slice(0, -1)
    .forEach((f) => execSync(`cp -r ${sourcePath}/${f} ${targetFolder}/${f}`));
  return files[files.length - 1];
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

const buildOrFindPrimeFolder = (num) => {
  const source = "./output-big";
  const sqrtNum = sqrtFloor(num);
  let folder = findMatchingFolder(source, sqrtNum);
  if (folder && !folder.includes("larger than")) return folder;
  folder = findLargestOutputFolder(source, getAllFromDirectory);
  console.log(folder);
};

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
  console.log(lastNumber);
  return checkDivisorNotExistOnTextFiles(
    num,
    sqrtNum,
    addNumbers(lastNumber, "1")
  );
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
