const fs = require("fs");

const createAFolder = (parentPath, parentName, childName) => {
  let rootFolder = parentPath + "/" + parentName;
  if (!fs.existsSync(rootFolder)) {
    fs.mkdirSync(rootFolder, {
      recursive: true,
    });
  }
  dir = rootFolder + "/" + childName;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
    return dir;
  }
};

const copyFile = (mainPath, copyPath) => {
  fs.copyFile(mainPath, copyPath, (err) => {
    if (err) throw err;
  });
};

const makeATextFile = (folderPath, fileName, data) => {
  fs.appendFileSync(`${folderPath}/${fileName}.txt`, data, (err) => {
    if (err) throw "appending error: " + err;
  });
};

const getFilesFromAFolder = (folderPath) => fs.readdirSync(folderPath);

const getSortedFilesFromAFolder = (folderPath) => {
  let filesArr = getFilesFromAFolder(folderPath);
  return filesArr.sort((f1, f2) => {
    let f1Name = f1.split(".")[0];
    let f2Name = f2.split(".")[0];
    return isNaN(+f1Name) && isNaN(+f2Name)
      ? +f1Name - f2Name
      : f1Name - f2Name;
  });
};

const sortTheFolders = (folderPath, folderNameWord = "") => {
  let folders = getFilesFromAFolder(folderPath);
  return folders.sort((fo1, fo2) => {
    return (
      parseInt(fo1.split(folderNameWord)[1]) -
      parseInt(fo2.split(folderNameWord)[1])
    );
  });
};

const sortTheFiles = (files, fileNameWord = "") => {
  return files.sort((f1, f2) => {
    return (
      parseInt(f1.split(fileNameWord)[1].slice(0, -4)) -
      parseInt(f2.split(fileNameWord)[1].slice(0, -4))
    );
  });
};

const findTheProperFolder = (
  folderPath,
  searchFolderFunc,
  searchText,
  folderNameWord = ""
) => {
  let folders = sortTheFolders(folderPath, folderNameWord);
  let result = searchFolderFunc(folders, searchText);
  return result || false;
};

const findTheProperFile = (
  folderPath,
  searchFolderFunc,
  searchFileFunc,
  searchTextInFolder,
  searchTextInFile
) => {
  let result = findTheProperFolder(
    folderPath,
    searchFolderFunc,
    searchTextInFile,
    searchTextInFolder
  );
  if (result) {
    const files = sortTheFolders(folderPath + "/" + result, searchTextInFolder);
    let fileResult = searchFileFunc(
      folderPath + "/" + result,
      files,
      searchTextInFile
    );
    return fileResult ? folderPath + "/" + result + "/" + fileResult : false;
  }
  return false;
};

const replaceInAFile = (file, regexPattern, changeFrom, changeTo) => {
  let data = fs.readFileSync(file, "utf-8");
  data = data.toString();
  while (data.includes(changeFrom)) {
    data = regexPattern
      ? data.replace(regexPattern, changeTo)
      : data.replace(changeFrom, changeTo);
  }
  return data;
};

const checkIfAFileIncludeAText = (file, str) => {
  const contents = fs.readFileSync(file, "utf-8");
  return contents.includes(str);
};

const findAllFilesTillNumber = (
  folderPath,
  searchFolderFunc,
  searchAllFilesFunc,
  searchTextInFolder,
  searchTextInFile
) => {
  let result = findTheProperFolder(
    folderPath,
    searchFolderFunc,
    searchTextInFile,
    searchTextInFolder
  );
  if (result) {
    const files = sortTheFolders(folderPath + "/" + result, searchTextInFolder);
    let fileResults = searchAllFilesFunc(
      folderPath + "/" + result,
      files,
      searchTextInFile
    );
    return sortTheFiles(fileResults, "/Output");
  }
  return false;
};

module.exports = {
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
};
