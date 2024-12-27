import { findMax } from "./mathOperations.mjs";
import { execSync } from "child_process";
import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";

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
  const filePath = ("" + filename).includes("Output")
    ? `${folderName}/${filename}`
    : `${folderName}/Output${filename}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
};

/**
 * Parses and sorts files based on the numerical suffix in their names.
 * @param {string[]} files - List of file names.
 * @returns {string[]} - Sorted list of file names.
 */
const parseAndSortFiles = (files) =>
  files
    .map((file) => ({
      name: file,
      number: parseInt(file.split("Output")[1], 10) || 0,
    }))
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
    .replace(/\n.*\| /g, "")
    .replace(/\n(.*)/g, "")
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

export {
  getAllFromDirectory,
  numFolderExist,
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
};
