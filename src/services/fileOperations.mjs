import { findMax } from "./mathOperations.mjs";
import { execSync } from "child_process";
import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";
import {
  formatLastFileInLastFolderRecursive,
  formatLastFileInLastFolderRecursiveUpdated,
} from "./helper.mjs";

/**
 * Retrieves all files and directories from a specified source folder.
 * @param {string} source - Path to the source directory.
 * @returns {string[]} - List of files and directories.
 */
const getAllFromDirectory = (source) => fsReadDirSync(source);

/**
 * Checks if a folder for a specific number already exists.
 * @param {string} number - Number for which the folder should exist.
 * @returns {string|boolean} - Returns the folder path if it exists, otherwise false.
 */
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

/**
 * Creates an output folder for a specific number.
 * @param {string} number - Number for which the folder should be created.
 * @returns {string} - Path to the created folder.
 */
const createOutputFolder = (number) => {
  const rootFolder = "./output-big";
  if (!fsExistsSync(rootFolder)) fsMkdirSync(rootFolder, { recursive: true });

  const dir = `./output-big/output-${number}`;
  fsMkdirSync(dir, { recursive: true });
  return dir;
};

/**
 * Writes data to a specified file.
 * @param {string} folderName - Path to the folder.
 * @param {string} filename - Name of the file.
 * @param {string} data - Data to be written.
 */
const writeDataToFile = (folderName, filename, data) => {
  // If filename already has an extension or starts with output/Output, use it as is
  const filePath = (filename.match(/\.txt$/) || filename.match(/^[Oo]utput/))
    ? `${folderName}/${filename}`
    : `${folderName}/Output${filename}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
};

/**
 * Parses and sorts files based on the numerical suffix in their names.
 * @param {string[]} files - List of file names.
 * @returns {string[]} - Sorted list of file names.
 */
/**
 * Parses and sorts files based on the numerical suffix in their names.
 * Handles both "OutputX.txt" and "outputX.txt" formats.
 * @param {string[]} files - List of file names.
 * @returns {string[]} - Sorted list of file names.
 */
const parseAndSortFiles = (files) =>
  files
    .map((file) => {
      // Handle both Output and output prefixes
      const match = file.match(/^[Oo]utput(\d+)\.txt$/);
      return {
        name: file,
        number: match ? parseInt(match[1], 10) : (parseInt(file.split("Output")[1], 10) || 0),
      };
    })
    .sort((a, b) => a.number - b.number)
    .map((file) => file.name);

// Not in use --> We can use this instead of parseAndSortFiles
const parseAndSortFilesString = (files) =>
  files
    .map((file) => ({
      name: file,
      number: file.split("Output")[1]?.replace(".txt", "") || "0",
    }))
    .sort((a, b) => (findMax(a.number, b.number) === a.number ? 1 : -1))
    .map((file) => file.name);

/**
 * Finds the appropriate folder for a given number.
 * @param {string} source - Path to the root directory.
 * @param {string} number - Target number.
 * @returns {string} - Path to the matching folder, or a message if not found.
 */
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
// Not in use --> We can use this instead of findMatchingFolder
const findMatchingFolderString = (source, number) => {
  const outputs = getAllFromDirectory(source);

  const sortedOutputs = outputs
    .filter((folder) => folder.startsWith("output-"))
    .sort((a, b) =>
      findMax(a.split("-")[1], b.split("-")[1]) === a.split("-")[1] ? 1 : -1
    );

  const result = sortedOutputs.find((output) => {
    const folderNumber = output.split("-")[1];
    return findMax(folderNumber, number) !== number;
  });

  return result
    ? `${source}/${result}`
    : `\n${number} is larger than the available outputs.\nUse isPrime method.`;
};

/**
 * Retrieves the prime numbers from a file.
 * @param {string} filePath - Path to the file.
 * @returns {string[]} - List of primes in the file.
 */
const primesInFile = (filePath) => {
  const data = fsReadFileSync(filePath, "utf-8")
    .replace(/(\(\d+\) \| )/g, "") // Remove (index) | prefix from all lines
    .replace(/\n/g, "") // Remove newlines
    .split(",");
  data.pop();
  return data;
};

/**
 * Finds the appropriate file within a folder for a given number.
 * @param {string} folder - Path to the folder.
 * @param {string} number - Target number.
 * @returns {string|null} - Path to the matching file, or null if not found.
 */
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
// Not in use --> We can use this instead of findMatchingFile
const findMatchingFileString = (folder, number) => {
  const files = getAllFromDirectory(folder);

  const sortedFiles = files
    .filter((file) => file.startsWith("Output"))
    .sort((a, b) =>
      findMax(a.split("Output")[1], b.split("Output")[1]) ===
        a.split("Output")[1]
        ? 1
        : -1
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

/**
 * Copies specified files from one folder to another.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} targetFolder - Path to the target folder.
 * @param {string[]} files - List of files to copy.
 */
const copyFilesToFolder = (sourceFolder, targetFolder, files) => {
  files.forEach((file) => {
    const data = fsReadFileSync(`${sourceFolder}/${file}`, "utf-8");
    writeDataToFile(targetFolder, file, data);
  });
};

/**
 * Finds the largest output folder by number.
 * @param {string} source - Path to the root directory.
 * @param {Function} getDirsFunc - Function to retrieve directories.
 * @returns {string} - Name of the largest folder.
 */
const findLargestOutputFolder = (source, getDirsFunc) => {
  const outputs = getDirsFunc(source);
  return outputs.reduce((largest, current) => {
    const largestNum = parseInt(largest.split("-")[1] || "0", 10);
    const currentNum = parseInt(current.split("-")[1] || "0", 10);
    return currentNum > largestNum ? current : largest;
  }, outputs[0]);
};
// Not in use --> We can use this instead of findLargestOutputFolder
const findLargestOutputFolderString = (source, getDirsFunc) => {
  const outputs = getDirsFunc(source);

  return outputs.reduce((largest, current) => {
    const largestNum = largest.split("-")[1] || "0";
    const currentNum = current.split("-")[1] || "0";
    return findMax(largestNum, currentNum) === currentNum ? current : largest;
  }, outputs[0]);
};

/**
 * Copies selected files from source to target folder based on a number.
 * @param {string} sourceFolder - Path to the source folder.
 * @param {string} targetFolder - Path to the target folder.
 * @param {string[]} files - List of files to evaluate and copy.
 * @param {string} num - Target number for filtering.
 * @returns {string} - Name of the last copied file.
 */
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

/**
 * Finds the last existing folder by number in the source directory.
 * @param {string} source - Path to the root directory.
 * @returns {string} - Name of the last existing folder.
 */
const findLastExistingFolderNumber = (source = "./output-big") => {
  const outputs = getAllFromDirectory(source);
  const sortedOutputs = outputs
    .filter((folder) => folder.startsWith("output-"))
    .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
  return sortedOutputs[sortedOutputs.length - 1];
};
// Not in use --> We can use this instead of findLastExistingFolderNumber
const findLastExistingFolderNumberString = (source = "./output-big") => {
  const outputs = getAllFromDirectory(source);
  const sortedOutputs = outputs
    .filter((folder) => folder.startsWith("output-"))
    .sort((a, b) =>
      findMax(a.split("-")[1], b.split("-")[1]) === a.split("-")[1] ? -1 : 1
    );
  return sortedOutputs[sortedOutputs.length - 1];
};

/**
 * Copies all files except the last one from the source to the target folder.
 * @param {string[]} files - List of files to copy.
 * @param {string} sourcePath - Path to the source folder.
 * @param {string} targetFolder - Path to the target folder.
 * @returns {string} - Name of the last file not copied.
 */
const copyAllFiles = (files, sourcePath, targetFolder) => {
  files
    .slice(0, -1)
    .forEach((f) => execSync(`cp -r ${sourcePath}/${f} ${targetFolder}/${f}`));
  return files[files.length - 1];
};

/**
 * Copies files from the last existing folder and formats the last file to create a new output folder for a specified number.
 *
 * @param {string} num - The target number for which the new folder and formatted file will be created.
 *
 * @description
 * This method performs the following steps:
 * 1. Identifies the last existing folder in the output directory.
 * 2. Parses and sorts the files from the identified folder.
 * 3. Formats the last file of the folder for the specified target number using `formatLastFileInLastFolderRecursive`.
 * 4. Creates a new folder named after the target number (`output-{num}`).
 * 5. Copies all files from the source folder into the newly created target folder.
 *
 * This method is typically used to extend the range of prime outputs or other processed data while maintaining consistency between folders.
 */
const copyFilesAndFormatLastFile = (num) => {
  const source = "./output-big";
  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  const files = parseAndSortFiles(getAllFromDirectory(lastFolderPath));
  const lastFile = files[files.length - 1];
  const lastNumber = lastFolderName.replace("output-", "");
  formatLastFileInLastFolderRecursive(
    lastFolderPath,
    lastFile,
    lastNumber,
    num
  );
  const targetFolderPath = `./output-big/output-${num}`;
  copyAllFiles(files, lastFolderPath, targetFolderPath);
};
const copyFilesAndFormatLastFileUpdated = (num) => {
  const source = "./output-big";
  const lastFolderName = findLastExistingFolderNumber(source);
  const lastFolderPath = `${source}/${lastFolderName}`;
  const files = parseAndSortFiles(getAllFromDirectory(lastFolderPath));
  const lastFile = files[files.length - 1];
  const lastNumber = lastFolderName.replace("output-", "");
  formatLastFileInLastFolderRecursiveUpdated(
    lastFolderPath,
    lastFile,
    lastNumber,
    num
  );
  const targetFolderPath = `./output-big/output-${num}`;
  copyAllFiles(files, lastFolderPath, targetFolderPath);
};

// ============================================================================
// SPLIT FILE STRUCTURE - Memory-Safe File Handling
// ============================================================================

/**
 * Write primes to folder, splitting into ~1MB files
 * Files are named by their first prime number for fast lookup
 * 
 * @param {string} folderPath - Output folder path
 * @param {bigint[]} primes - Array of prime BigInts
 * @param {number} maxFileSizeKB - Max file size in KB (default 1024 = 1MB)
 */
const writePrimesToSplitFiles = (folderPath, primes, maxFileSizeKB = 1024) => {
  if (!primes || primes.length === 0) return;

  let currentFile = [];
  let currentSize = 0;
  const maxSizeBytes = maxFileSizeKB * 1024;
  let globalIndex = 0; // Maintain cumulative index across files

  for (let i = 0; i < primes.length; i++) {
    const prime = primes[i];
    const primeStr = prime.toString() + ',';
    const primeSize = Buffer.byteLength(primeStr, 'utf8');

    // If adding this prime would exceed limit, write current file
    if (currentSize + primeSize > maxSizeBytes && currentFile.length > 0) {
      const firstPrime = currentFile[0];
      const filename = `output${firstPrime}.txt`;

      // Format: (index) | prime1,prime2,...
      let data = '';
      for (let j = 0; j < currentFile.length; j++) {
        if (j % 20 === 0) {
          data += (j === 0 ? '' : '\n') + `(${globalIndex + j}) | `;
        }
        data += currentFile[j].toString() + ',';
      }
      data += `\n(${currentFile.length})`;

      writeDataToFile(folderPath, filename, data);

      // Update global index
      globalIndex += currentFile.length;

      // Start new file
      currentFile = [];
      currentSize = 0;
    }

    currentFile.push(prime);
    currentSize += primeSize;
  }

  // Write remaining primes
  if (currentFile.length > 0) {
    const firstPrime = currentFile[0];
    const filename = `output${firstPrime}.txt`;

    let data = '';
    for (let j = 0; j < currentFile.length; j++) {
      if (j % 20 === 0) {
        data += (j === 0 ? '' : '\n') + `(${globalIndex + j}) | `;
      }
      data += currentFile[j].toString() + ',';
    }
    data += `\n(${currentFile.length})`;

    writeDataToFile(folderPath, filename, data);
  }
};

/**
 * Find which file in a folder contains a specific number
 * Uses the filename (outputXXX.txt) to quickly locate the correct file
 * 
 * @param {string} folderPath - Folder to search
 * @param {bigint} targetNumber - Number to find
 * @returns {string|null} - Filename containing the number, or null
 */
const findFileForNumber = (folderPath, targetNumber) => {
  if (!fsExistsSync(folderPath)) return null;

  const files = getAllFromDirectory(folderPath)
    .filter(f => f.match(/^output\d+\.txt$/))
    .map(f => ({
      name: f,
      startNum: BigInt(f.replace('output', '').replace('.txt', ''))
    }))
    .sort((a, b) => a.startNum > b.startNum ? 1 : -1);

  if (files.length === 0) {
    // Try old format (Output0.txt)
    const oldFile = 'Output0.txt';
    if (fsExistsSync(`${folderPath}/${oldFile}`)) {
      return oldFile;
    }
    return null;
  }

  // Find correct file using binary search logic
  for (let i = 0; i < files.length; i++) {
    const currentStart = files[i].startNum;
    const nextStart = i < files.length - 1 ? files[i + 1].startNum : null;

    if (nextStart === null) {
      // Last file - number must be in here if it exists
      if (targetNumber >= currentStart) {
        return files[i].name;
      }
    } else if (targetNumber >= currentStart && targetNumber < nextStart) {
      return files[i].name;
    }
  }

  return null;
};

/**
 * Read all primes from a folder (handles both old and new file formats)
 * 
 * @param {string} folderPath - Path to folder
 * @returns {bigint[]} - Array of all primes
 */
const readAllPrimesFromFolder = (folderPath) => {
  if (!fsExistsSync(folderPath)) return [];

  const files = getAllFromDirectory(folderPath);
  const hasSplitFormat = files.some(f => f.match(/^output\d+\.txt$/));
  const hasOldFormat = files.includes('Output0.txt');

  const allPrimes = [];

  if (hasSplitFormat) {
    // New split format - read all files
    const splitFiles = files
      .filter(f => f.match(/^output\d+\.txt$/))
      .map(f => ({
        name: f,
        startNum: BigInt(f.replace('output', '').replace('.txt', ''))
      }))
      .sort((a, b) => a.startNum > b.startNum ? 1 : -1);

    for (const fileInfo of splitFiles) {
      const primes = primesInFile(`${folderPath}/${fileInfo.name}`);
      for (const p of primes) {
        const trimmed = p.trim();
        if (trimmed && !trimmed.startsWith('(')) {
          allPrimes.push(BigInt(trimmed));
        }
      }
    }
  } else if (hasOldFormat) {
    // Old single file format
    const primes = primesInFile(`${folderPath}/Output0.txt`);
    for (const p of primes) {
      const trimmed = p.trim();
      if (trimmed && !trimmed.startsWith('(')) {
        allPrimes.push(BigInt(trimmed));
      }
    }
  }

  return allPrimes;
};

export {
  getAllFromDirectory,
  numFolderExist,
  copyFilesAndFormatLastFile,
  copyFilesAndFormatLastFileUpdated,
  createOutputFolder,
  writeDataToFile,
  parseAndSortFiles,
  findMatchingFolder,
  findMatchingFile,
  copyFilesToFolder,
  findLargestOutputFolder,
  copySelectedFiles,
  findLastExistingFolderNumber,
  copyAllFiles,
  primesInFile,
  // New split file functions
  writePrimesToSplitFiles,
  findFileForNumber,
  readAllPrimesFromFolder,
};
