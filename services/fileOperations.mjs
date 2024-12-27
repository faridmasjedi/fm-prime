import { findMax } from "./mathOperations.mjs";
import { execSync } from "child_process";
import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
  readdirSync as fsReadDirSync,
  readFileSync as fsReadFileSync,
} from "fs";

// Retrieve all files/directories from a specified source
const getAllFromDirectory = (source) => fsReadDirSync(source);

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

// Write data to a file
const writeDataToFile = (folderName, filename, data) => {
  const filePath = ("" + filename).includes("Output")
    ? `${folderName}/${filename}`
    : `${folderName}/Output${filename}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
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

const primesInFile = (filePath) => {
  const data = fsReadFileSync(filePath, "utf-8")
    .replace(/\n.*\| /g, "")
    .replace(/\n(.*)/g, "")
    .split(",");
  data.pop();
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

// Copy specified files from one folder to another
const copyFilesToFolder = (sourceFolder, targetFolder, files) => {
  files.forEach((file) => {
    const data = fsReadFileSync(`${sourceFolder}/${file}`, "utf-8");
    writeDataToFile(targetFolder, file, data);
  });
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

const findLastExistingFolderNumber = (source = "./output-big") => {
  const outputs = getAllFromDirectory(source);
  const sortedOutputs = outputs
    .filter((folder) => folder.startsWith("output-"))
    .sort((a, b) => parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]));
  return sortedOutputs[sortedOutputs.length - 1];
};

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
  primesInFile
};
