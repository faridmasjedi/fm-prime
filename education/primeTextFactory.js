const fs = require("fs");

const {
  createAFolder,
  makeATextFile,
  getFilesFromAFolder,
  getSortedFilesFromAFolder,
  findTheProperFolder,
  findTheProperFile,
  replaceInAFile,
  sortTheFolders,
  checkIfAFileIncludeAText,
  findAllFilesTillNumber,
  copyFile,
} = require("./textFactory");

let folderPath = "prime-output";
const nodePath = "node_modules/fm-primes/" + folderPath;

const createAFolderForPrime = (number, folderPathway = folderPath) =>
  createAFolder(".", folderPathway, "output-" + number);

const makeATextFileForPrime = (
  folderNumber,
  fileIndex,
  data,
  folderPathway = folderPath
) =>
  makeATextFile(
    "./" + folderPathway + "/output-" + folderNumber,
    "Output" + fileIndex,
    data
  );

const getSortedFilesFromAFolderForPrime = () =>{
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;
  return getSortedFilesFromAFolder("./" + fp);
}
  

const sortFolderForPrime = () => {
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;
  return sortTheFolders("./" + fp, "output-");
}

const sortFilesForPrimeInFolder = (foldername) =>{
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;
  return sortTheFolders("./" + fp + "/" + foldername, "Output");
}
  

const searchFolderFunc = (folders, num) => {
  return folders.find((f) => {
    let folderNumber = Number(f.split("-")[1]);
    return folderNumber >= num;
  });
};

const findLastFolder = () => {
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;
  let folders = sortTheFolders(fp, "output-");
  return folders[folders.length - 1];
};

const findTheProperFolderForPrime = (num) =>{
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;

  return findTheProperFolder("./" + fp, searchFolderFunc, num, "output-");
}

const searchFileFunc = (folderPath, files, num) => {
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;

  let file = files.find((f) => {
    let data = fs.readFileSync(fp + "/" + f, "utf-8");
    data = data.toString();
    data = data.split(", ");
    let firstPrimeInFile = Number(data[0]);
    if (firstPrimeInFile > num) return false;
    let lastPrimeInFile = Number(data[data.length - 2]);
    return firstPrimeInFile <= num && lastPrimeInFile >= num;
  });
  return file;
};

const findTheProperFileForPrime = (num) => {
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;

  return findTheProperFile(
    "./" + fp,
    searchFolderFunc,
    searchFileFunc,
    "output-",
    num
  );
};

const searchAllFilesFunc = (folderPath, files, num) => {
  let result = [];
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;

  files.forEach((f) => {
    let data = fs.readFileSync(fp + "/" + f, "utf-8");
    data = data.toString();
    data = data.split(", ");
    let firstPrimeInFile = Number(data[0]);
    if (firstPrimeInFile > num) return result;
    if (firstPrimeInFile <= num) result.push(folderPath + "/" + f);
  });
  return result;
};

const findAllFilesForDivision = (num) => {
  let fp = fs.existsSync("./" + folderPath ) ? folderPath : nodePath;
  return findAllFilesTillNumber(
    "./" + fp,
    searchFolderFunc,
    searchAllFilesFunc,
    "output-",
    num
  );
};

const allNumbersInFileArr = (file, folderpath = folderPath) => {
  let data = fs.readFileSync(file, "utf-8");
  data = data.toString();
  data = data.slice(0, -2);
  return data.split(", ");
};

const isPrime = (num) => {
  let file = findTheProperFileForPrime(num);
  if (!file) return false;
  return (
    checkIfAFileIncludeAText(file, `${num}, `) ||
    checkIfAFileIncludeAText(file, `, ${num},`)
  );
};

const copyFiles = (
  files,
  newfolderNum,
  mainFolder = files,
  whichIndex = files.length
) => {
  let fp = fs.existsSync("./" + folderPath) ? folderPath : nodePath;
  let filePath =
    mainFolder === files ? "" : "./" + fp + "/" + mainFolder + "/";
  for (let i = 0; i < whichIndex; i++) {
    copyFile(
      filePath + files[i],
      "./" +
        fp +
        "/output-" +
        newfolderNum +
        "/Output" +
        files[i].split("Output")[1]
    );
  }
};

module.exports = {
  allNumbersInFileArr,
  findAllFilesForDivision,
  findTheProperFileForPrime,
  searchFileFunc,
  findTheProperFolderForPrime,
  searchFolderFunc,
  sortFolderForPrime,
  getSortedFilesFromAFolderForPrime,
  makeATextFileForPrime,
  createAFolderForPrime,
  isPrime,
  findLastFolder,
  copyFiles,
  sortFilesForPrimeInFolder,
  checkIfAFileIncludeAText,
};
