import {
  addNumbers,
  divideNumbers,
  findMax,
  multiplyNumbers,
  power,
  sqrtFloor,
  subtractNumbers,
} from "./mathOperations.mjs";
import {
  findLargestOutputFolder,
  findMatchingFolder,
  getAllFromDirectory,
  writeDataToFile,
} from "./fileOperations.mjs";
import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";
import { execSync } from "child_process";

const multiplyBy6 = (p) => multiplyNumbers(p, "6");

/**
 * Calculate indices for non-prime numbers based on given k2 and t.
 * @param {string} k2 - Current k2 value.
 * @param {string} t - Incremental value for t.
 * @returns {Object} - An object containing the calculated not-prime indexes.
 */
const calculateNonPrimeIndices = (k2, t) => {
  const k1 = addNumbers(k2, t);

  const doubleK1 = multiplyNumbers(k1, "2");
  const p = subtractNumbers(power(k1, "2"), power(k2, "2"));
  const doubleK2 = multiplyNumbers(k2, "2");

  const indices = {
    s: doubleK1,
    k: doubleK2,
    ss: addNumbers(doubleK1, "1"),
    kk: addNumbers(doubleK2, "1"),
    patternOne: multiplyBy6(p),
    patternTwo: multiplyBy6(addNumbers(p, t)),
  };

  return {
    1: subtractNumbers(indices.patternOne, indices.s),
    2: subtractNumbers(indices.patternTwo, indices.ss),
    3: addNumbers(indices.patternOne, indices.s),
    4: addNumbers(indices.patternTwo, indices.ss),
    5: subtractNumbers(indices.patternOne, indices.k),
    6: subtractNumbers(indices.patternTwo, indices.kk),
    7: addNumbers(indices.patternOne, indices.k),
    8: addNumbers(indices.patternTwo, indices.kk),
  };
};

/**
 * Reads stored not-prime indexes from text files.
 * @param {string} filePath - Path to the file containing stored indexes.
 * @returns {Set<string>} - A set of stored indexes.
 */
const readNotPrimeIndexesFromFile = (filePath) => {
  if (!fsExistsSync(filePath)) return new Set();
  const data = fsReadFileSync(filePath, "utf-8");
  return new Set(data.split(","));
};

/**
 * Creates an output folder for a specific number.
 * @param {string} number - Number for which the folder should be created.
 * @returns {string} - Path to the created folder.
 */
const createOutputFolder = (number) => {
  const rootFolder = "./not-prime-indexes";
  if (!fsExistsSync(rootFolder)) fsMkdirSync(rootFolder, { recursive: true });

  const dir = `${rootFolder}/output-${number}`;
  fsMkdirSync(dir, { recursive: true });
  return dir;
};

/**
 * Write indices to a file.
 * @param {string} number - Folder number to check if foldername exists.
 * @param {string} folderName - Folder to store the file.
 * @param {string} fileName - Name of the file.
 * @param {Set<string>} indices - Indices to write.
 */
const writeToFile = (number, foldername, indexes, filename) => {
  if (!fsExistsSync(foldername)) createOutputFolder(number);
  const data = Array.from(indexes).join(",");
  writeDataToFile(foldername, filename, data);
};

const sortAndFilterFileContext = (numbers, filterNumber) =>
  Array.from(numbers)
    .sort((a, b) => (findMax(a, b) === a ? 1 : -1))
    .filter((num) => findMax(num, filterNumber) === filterNumber);

const writeSortedIndexesToFile = (number, foldername, indexes, filename) => {
  if (!fsExistsSync(foldername)) createOutputFolder(number);
  const sortedData = Array.from(indexes)
    .sort((a, b) => (findMax(a, b) === a ? 1 : -1))
    .join(","); // Sort numerically for large numbers
  writeDataToFile(foldername, filename, sortedData);
};

const sortFileAnRewriteToFile = (number, filename) => {
  const numFolder = `./not-prime-indexes/output-${number}`;
  const filepath = `${numFolder}/${filename}.txt`;
  let pattern = readNotPrimeIndexesFromFile(filepath);
  const sortedData = Array.from(pattern)
    .sort((a, b) => (findMax(a, b) === a ? 1 : -1))
    .join(","); // Sort numerically for large numbers
  writeDataToFile(numFolder, filename, sortedData);
};

const findDuplication = (number, filename) => {
  const numFolder = `./not-prime-indexes/output-${number}`;
  const filepath = `${numFolder}/${filename}`;
  let pattern = readNotPrimeIndexesFromFile(filepath);
  const result = {};
  Array.from(pattern).forEach((el) => {
    result[el] = result[el] ? result[el] + 1 : 1;
  });
  for (let key in result) {
    if (result[key] > 1) console.log(key);
  }
  return result;
};

/**
 * Generate non-prime indices up to a given number.
 * @param {string} number - Upper limit for indices generation.
 * @returns {Object} - Contains indices for patterns one and two.
 */
const generateNotPrimeIndexes = (number, k2 = "0", t = "1") => {
  const numFolder = `./not-prime-indexes/output-${number}`;
  const patternOneFile = `${numFolder}/OutputPattern1.txt`;
  const patternTwoFile = `${numFolder}/OutputPattern2.txt`;

  let patternOneIndex = readNotPrimeIndexesFromFile(patternOneFile);
  let patternTwoIndex = readNotPrimeIndexesFromFile(patternTwoFile);

  let indices = calculateNonPrimeIndices(k2, t);
  let minIndex = indices["1"];
  const maxIndex = divideNumbers(addNumbers(number, "1"), "6")[0];

  while (findMax(k2, maxIndex) === maxIndex) {
    for (const key in indices) {
      const ind = indices[key];
      if (findMax(ind, maxIndex) !== maxIndex) continue;
      if (key <= 4) patternOneIndex.add(ind);
      else patternTwoIndex.add(ind);
      if (findMax(minIndex, ind) === minIndex) minIndex = ind;
    }

    if (findMax(minIndex, maxIndex) === minIndex) {
      t = "1";
      k2 = addNumbers(k2, "1");
    } else {
      t = addNumbers(t, "1");
    }

    indices = calculateNonPrimeIndices(k2, t);
    minIndex = indices["1"];
  }
  writeToFile(number, numFolder, patternOneIndex, "Pattern1");
  writeToFile(number, numFolder, patternTwoIndex, "Pattern2");

  return { patternOneIndex, patternTwoIndex, maxIndex };
};

const numFolderExist = (numFolder) => {
  if (fsExistsSync(numFolder)) {
    console.log(`${numFolder} already exists...`);
    return true;
  }
  return false;
};

/**
 * Calculate prime numbers up to a given limit.
 * @param {string} number - Upper limit for primes.
 * @param {string} index - Starting index.
 * @param {Set<string>} primes - Set of prime numbers.
 * @param {number} count - Count of primes.
 */
const calculatePrimes = (
  number,
  index = "1",
  primes = new Set(["2", "3"]),
  count = 2
) => {
  const numFolder = `./not-prime-indexes/output-${number}`;
  if (fsExistsSync(numFolder)) {
    console.log(`${numFolder} already exists...`);
    return;
  }

  const { patternOneIndex, patternTwoIndex, maxIndex } =
    generateNotPrimeIndexes(number);
  while (findMax(index, maxIndex) === maxIndex && index !== maxIndex) {
    if (!patternOneIndex.has(index)) {
      primes.add(addNumbers(multiplyBy6(index), "1"));
      count++;
    }
    if (!patternTwoIndex.has(index)) {
      primes.add(subtractNumbers(multiplyBy6(index), "1"));
      count++;
    }
    index = addNumbers(index, "1");
  }

  if (!patternOneIndex.has(maxIndex)) {
    const lastNumber = addNumbers(multiplyBy6(index), "1");
    if (findMax(lastNumber, number) === number) {
      primes.add(lastNumber);
      count++;
    }
  }

  if (!patternTwoIndex.has(maxIndex)) {
    const lastNumber = subtractNumbers(multiplyBy6(index), "1");
    if (findMax(lastNumber, number) === number) {
      primes.add(lastNumber);
      count++;
    }
  }

  writeToFile(number, numFolder, primes, `Primes-${count}`);
};

const copyFromOtherFolder = (number, rootFolder, numFolder) => {
  const maxIndex = divideNumbers(addNumbers(number, "1"), "6")[0];
  const matchedFolder = findMatchingFolder(rootFolder, number);
  if (matchedFolder.includes(`is larger`)) return false;

  const outputs = getAllFromDirectory(matchedFolder);
  let patternOneIndex, patternTwoIndex, primes;
  outputs.forEach((filename) => {
    if (filename.includes("OutputPattern1"))
      patternOneIndex = sortAndFilterFileContext(
        readNotPrimeIndexesFromFile(`${matchedFolder}/OutputPattern1.txt`),
        maxIndex
      );
    if (filename.includes("OutputPattern2"))
      patternTwoIndex = sortAndFilterFileContext(
        readNotPrimeIndexesFromFile(`${matchedFolder}/OutputPattern2.txt`),
        maxIndex
      );
    if (filename.includes("OutputPrimes"))
      primes = sortAndFilterFileContext(
        readNotPrimeIndexesFromFile(`${matchedFolder}/${filename}`),
        number
      );
  });
  writeToFile(number, numFolder, patternOneIndex, "Pattern1");
  writeToFile(number, numFolder, patternTwoIndex, "Pattern2");
  writeToFile(number, numFolder, primes, `Primes-${primes.length}`);
  return true;
};

const copyFromLastFolder = (number, rootFolder, numFolder) => {
  const lastFolder = findLargestOutputFolder(rootFolder, getAllFromDirectory);
  if (!lastFolder) return new Set(["2", "3"]);
  const filename = getAllFromDirectory(`${rootFolder}/${lastFolder}`).find(
    (filename) => filename.includes("OutputPrimes")
  );
  return readNotPrimeIndexesFromFile(`${rootFolder}/${lastFolder}/${filename}`);
};

const calculateRemainedPrimes = (number, numFolder, primes) => {
  let index = "1";
  const { patternOneIndex, patternTwoIndex, maxIndex } =
    generateNotPrimeIndexes(number);
  let count = primes.size;

  while (findMax(index, maxIndex) === maxIndex && index !== maxIndex) {
    const patternOneNumber = addNumbers(multiplyBy6(index), "1");
    const patternTwoNumber = subtractNumbers(multiplyBy6(index), "1");
    if (!patternOneIndex.has(index) && !primes.has(patternOneNumber)) {
      primes.add(patternOneNumber);
      count++;
    }
    if (!patternTwoIndex.has(index) && !primes.has(patternTwoNumber)) {
      primes.add(patternTwoNumber);
      count++;
    }
    index = addNumbers(index, "1");
  }

  if (!patternOneIndex.has(maxIndex)) {
    const lastNumber = addNumbers(multiplyBy6(index), "1");
    if (findMax(lastNumber, number) === number) {
      primes.add(lastNumber);
      count++;
    }
  }

  if (!patternTwoIndex.has(maxIndex)) {
    const lastNumber = subtractNumbers(multiplyBy6(index), "1");
    if (findMax(lastNumber, number) === number) {
      primes.add(lastNumber);
      count++;
    }
  }
  writeToFile(number, numFolder, primes, `Primes-${count}`);
};

const calculatePrimesText = (number) => {
  const rootFolder = "./not-prime-indexes";
  const numFolder = `${rootFolder}/output-${number}`;
  if (numFolderExist(numFolder)) return;
  if (copyFromOtherFolder(number, rootFolder, numFolder)) return;
  const primes = copyFromLastFolder(number, rootFolder, numFolder);
  calculateRemainedPrimes(number, numFolder, primes);
};

// console.log(calculatePrimesText("1400000"));
//////
// const arr = ["1000000", "1200000", "1400000", "1`0000000"]
// const arr = ["10", "100", "1000", "10000", "100000", "200000", "500000", "600000", "900000"]
// arr.forEach(num => console.log(num, '\n',calculatePrimesText(num), '\n=========='))
/////
// calculatePrimes("100")
// console.log(readNotPrimeIndexesFromFile(`not-prime-indexes/output-900000/OutputPrimes-71274.txt`))
