const {
  findTheProperFileForPrime,
  makeATextFileForPrime,
  createAFolderForPrime,
  isPrime,
  allNumbersInFileArr,
  findAllFilesForDivision,
  findLastFolder,
  copyFiles,
  sortFilesForPrimeInFolder,
} = require("./primeTextFactory");

const {
  ifPrime,
  primeInRangeObj,
  scientificWayOfNum,
} = require("./primeFirstWay");

const folderPath = "prime-output";

const createPrimeTextFiles = (num) => {
  let dir = createAFolderForPrime(num);
  if (!dir) {
    return `Text files for primes till ${num} already exist.`;
  }
  let data = primeInRangeObj(1, num);
  for (let key in data) {
    makeATextFileForPrime(num, key, data[key]);
  }
};

const primeInRangeObjTextWay = (firstNum, lastNum, count = 0) => {
  let dir = createAFolderForPrime(lastNum);
  if (!dir) {
    return `Text files for primes till ${lastNum} already exist.`;
  }

  let counter = count;
  if (count !== 0) count = 0;
  let result = "";
  if (firstNum < 3 && lastNum >= 3) {
    result += "2, 3, ";
    count += 2;
  } else if ((firstNum >= 3 && firstNum < 5) & (lastNum >= 3)) {
    result += "3, ";
    count += 1;
  }

  let checkIndex = Math.ceil((firstNum - 1) / 6);
  let checkNum1 = 6 * checkIndex - 1;
  let checkNum2 = 6 * checkIndex + 1;
  let checkFlag = checkNum1 >= firstNum;
  let numberToInvestigate = checkFlag ? checkNum1 : checkNum2;
  let numberToAdd = checkFlag ? 2 : 4;

  while (numberToInvestigate <= lastNum) {
    if (ifPrime(numberToInvestigate)) {
      result += `${numberToInvestigate}, `;
      count++;
      if (count === 10000) {
        counter += 10000;
        makeATextFileForPrime(lastNum, counter, result);
        count = 0;
        result = "";
      }
    }

    numberToInvestigate += numberToAdd;
    numberToAdd = numberToAdd === 2 ? 4 : 2;
  }
  if (count % 10000 !== 0)
    makeATextFileForPrime(lastNum, counter + count, result);
};

const createPrimeTextFilesRange = (firstNum, lastNum) => {
  const folderPath = "prime-between-output";
  const fileName = firstNum + "-" + lastNum;
  let dir = createAFolderForPrime(fileName, folderPath);

  if (!dir) {
    return `Text files for primes till ${fileName} already exist.`;
  }

  let data = primeInRangeObj(firstNum, lastNum);
  for (let key in data) {
    makeATextFileForPrime(fileName, key, data[key], folderPath);
  }
};

const checkIfPrime = (num) => {
  return isPrime(num);
};

const division = (num) => {
  if (!(num % 2)) return 2;
  if (!(num % 3)) return 3;

  const lastNumberToCheck = Math.floor(Math.sqrt(num));
  let files = findAllFilesForDivision(lastNumberToCheck);

  for (let f of files) {
    let data = allNumbersInFileArr(f);
    for (let n of data) {
      if (num % n === 0) {
        return n;
      }
    }
  }
  return num;
};

const allDivisions = (num) => {
  let result = {};
  while (num != 1) {
    let div = division(num);
    result[div] ? result[div]++ : (result[div] = 1);
    num /= div;
  }
  return scientificWayOfNum(result);
};

// This function is working just when we have some prime text files.
const primes = (num) => {
  let files = findAllFilesForDivision(num);

  if (files.length) {
    let dir = createAFolderForPrime(num);
    if (!dir) {
      return `Text files for primes till ${num} already exist.`;
    }
    copyFiles(files, num, files, files.length - 1);
    let data = allNumbersInFileArr(files[files.length - 1]);
    let res = data.filter((n) => n <= num);
    let lastFile = files[files.length - 2];
    let lastCounter = lastFile
      ? parseInt(files[files.length - 2].split("Output")[1])
      : false;
    makeATextFileForPrime(
      num,
      lastCounter ? lastCounter + res.length : res.length,
      res.join(", ") + ", "
    );
  } else {
    let folder = findLastFolder();
    files = sortFilesForPrimeInFolder(folder);
    let lastFolderNumber = folder.split("-")[1];
    let lastFileNumber = parseInt(files[files.length - 1].split("Output")[1]);
    primeInRangeObjTextWay(+lastFolderNumber, num, +lastFileNumber);
    copyFiles(files, num, folder, files.length);
  }
};

const divisionFromText = (num) => {
  if (num === 1) return -1;
  let checkNumber = Math.floor(Math.sqrt(num));
  let files = findAllFilesForDivision(checkNumber);
  for (let f of files) {
    let data = allNumbersInFileArr(f);
    for (let n of data) {
      if (n <= num && num % n === 0) {
        return n;
      }
    }
  }
  return num;
};

const isPrimeFromText = (num) => {
  return divisionFromText(num) == num;
};

const allPrimesFromText = (firstNum, lastNum, count = 0) => {
  let dir = createAFolderForPrime(lastNum);
  if (!dir) {
    return `Text files for primes till ${lastNum} already exist.`;
  }

  let counter = count;
  if (!count) count = 0;
  let result = "";
  if (firstNum < 3 && lastNum >= 3) {
    result += "2, 3, ";
    count += 2;
  } else if ((firstNum >= 3 && firstNum < 5) & (lastNum >= 3)) {
    result += "3, ";
    count += 1;
  }

  let checkIndex = Math.ceil((firstNum - 1) / 6);
  let checkNum1 = 6 * checkIndex - 1;
  let checkNum2 = 6 * checkIndex + 1;
  let checkFlag = checkNum1 >= firstNum;
  let numberToInvestigate = checkFlag ? checkNum1 : checkNum2;
  let numberToAdd = checkFlag ? 2 : 4;
  while (numberToInvestigate <= lastNum) {
    let file = findTheProperFileForPrime(numberToInvestigate);
    if (file) {
      if (checkIfPrime(numberToInvestigate)) {
        result += `${numberToInvestigate}, `;
        count++;
      }
    } else if (isPrimeFromText(numberToInvestigate)) {
      result += `${numberToInvestigate}, `;
      count++;
      if (count === 10000) {
        counter += 10000;
        makeATextFileForPrime(lastNum, counter, result);
        count = 0;
        result = "";
      }
    }

    numberToInvestigate += numberToAdd;
    numberToAdd = numberToAdd === 2 ? 4 : 2;
  }
  if (count % 10000 !== 0)
    makeATextFileForPrime(lastNum, counter + count, result);
};

// this method used in `allPrimes` function
// if a number that we want to find all the primes till that is less -
// - than primes on existed folders, this will be run
const copyPrimeFromExistedFiles = (num, files) => {
  let dir = createAFolderForPrime(num);
  if (!dir) {
    return `Text files for primes till ${num} already exist.`;
  }
  copyFiles(files, num, files, files.length - 1);
  let data = allNumbersInFileArr(files[files.length - 1]);
  let res = data.filter((n) => n <= num);
  let lastFile = files[files.length - 2];
  let lastCounter = lastFile
    ? parseInt(files[files.length - 2].split("Output")[1])
    : false;
  makeATextFileForPrime(
    num,
    lastCounter ? lastCounter + res.length : res.length,
    res.join(", ") + ", "
  );
};

// this method used in `allPrimes` function
// if a number that we want to find all the primes till that is bigger -
// - than primes on existed folders, but sqrt of that is less than existed primes, -
// - this will copy all the existed ones and will find the primes from greatest existed prime -
// till the number.
const copyAndBuildPrimes = (
  num,
  files,
  folder,
  lastFolderNumber,
  lastDivisionToCheck,
  counter
) => {
  let dir = createAFolderForPrime(num);
  if (!dir) {
    return `Text files for primes till ${num} already exist.`;
  }
  copyFiles(files, num, folder, files.length);
  let number = +lastFolderNumber + 1;
  let count = 0;
  let result = "";
  let checkIndex = Math.ceil((number - 1) / 6);
  let checkNum1 = 6 * checkIndex - 1;
  let checkFlag = checkNum1 >= number;
  let numberToAdd = checkFlag ? 2 : 4;
  let fs = findAllFilesForDivision(lastDivisionToCheck);
  while (number <= num) {
    let flag = true;
    for (let file of fs) {
      let data = allNumbersInFileArr(file);
      if (data[data.length - 1] > lastDivisionToCheck) {
        data = data.filter((n) => n <= lastDivisionToCheck);
      }
      for (let n of data) {
        if (number % n === 0) {
          flag = false;
          break;
        }
      }

      if (!flag) break;
    }
    if (flag) {
      result += `${number}, `;
      count++;
      if (count === 10000) {
        counter += 10000;
        makeATextFileForPrime(num, counter, result);
        count = 0;
        result = "";
      }
    }

    number += numberToAdd;
    numberToAdd = numberToAdd === 2 ? 4 : 2;
  }
  if (count % 10000 !== 0) makeATextFileForPrime(num, counter + count, result);
};

// this method used in `allPrimes` function
// if a number that we want to find all the primes till that is bigger -
// - than primes on existed folders, and sqrt of that is bigger than existed primes, -
// - this will copy all the existed ones and will build all the primes till (existed maximum prime)**2, -
// - and then will repeat this process till the folders to build the primes for number are existed.
const buildPrimes = (
  num,
  numberToCreateFiles,
  files,
  folder,
  lastFolderNumber,
  counter
) => {
  while (numberToCreateFiles <= num) {
    let dir = createAFolderForPrime(numberToCreateFiles);
    if (!dir) {
      return `Text files for primes till ${numberToCreateFiles} already exist.`;
    }
    copyFiles(files, numberToCreateFiles, folder, files.length);
    let number = +lastFolderNumber + 1;
    let count = 0;
    let result = "";
    let checkIndex = Math.ceil((number - 1) / 6);
    let checkNum1 = 6 * checkIndex - 1;
    let checkFlag = checkNum1 >= number;
    let numberToAdd = checkFlag ? 2 : 4;

    while (number <= numberToCreateFiles) {
      let flag = true;
      let lastDivisionToCheck = Math.floor(Math.sqrt(number));
      let fs = findAllFilesForDivision(lastDivisionToCheck);

      for (let file of fs) {
        let data = allNumbersInFileArr(file);
        if (data[data.length - 1] > number) {
          data = data.filter((n) => n <= number);
        }
        for (let n of data) {
          if (number % n === 0) {
            flag = false;
            break;
          }
        }

        if (!flag) break;
      }
      if (flag) {
        result += `${number}, `;
        count++;
        if (count === 10000) {
          counter += 10000;
          makeATextFileForPrime(numberToCreateFiles, counter, result);
          count = 0;
          result = "";
        }
      }

      number += numberToAdd;
      numberToAdd = numberToAdd === 2 ? 4 : 2;
    }
    if (count % 10000 !== 0)
      makeATextFileForPrime(numberToCreateFiles, counter + count, result);
    folder = findLastFolder();
    files = sortFilesForPrimeInFolder(folder);
    lastFolderNumber = folder.split("-")[1];
    counter = parseInt(files[files.length - 1].split("Output")[1]);

    numberToCreateFiles = lastFolderNumber ** 2;
  }
  if (numberToCreateFiles > num) {
    allPrimes(num);
  }
};

const allPrimes = (num) => {
  let files = findAllFilesForDivision(num);
  if (files.length) {
    copyPrimeFromExistedFiles(num, files);
  } else {
    let lastDivisionToCheck = Math.floor(Math.sqrt(num));

    let folder = findLastFolder();
    files = sortFilesForPrimeInFolder(folder);
    let lastFolderNumber = folder.split("-")[1];
    let counter = parseInt(files[files.length - 1].split("Output")[1]);

    if (lastDivisionToCheck <= lastFolderNumber) {
      copyAndBuildPrimes(
        num,
        files,
        folder,
        lastFolderNumber,
        lastDivisionToCheck,
        counter
      );
    } else {
      let numberToCreateFiles = lastFolderNumber ** 2;
      buildPrimes(
        num,
        numberToCreateFiles,
        files,
        folder,
        lastFolderNumber,
        counter
      );
    }
  }
};

const allPrimesSecondWay = (num) => {
  let files = findAllFilesForDivision(num);
  if (files.length) {
    copyPrimeFromExistedFiles(num, files);
  } else {
    let folder = findLastFolder();
    files = sortFilesForPrimeInFolder(folder);
    let lastFolderNumber = folder.split("-")[1];
    let counter = parseInt(files[files.length - 1].split("Output")[1]);
    primeInRangeObjTextWay(+lastFolderNumber + 1, num, counter);
    copyFiles(files, num, folder, files.length);
  }
};

module.exports = {
  primeInRangeObjTextWay,
  checkIfPrime,
  division,
  allDivisions,
  primes,
  divisionFromText,
  isPrimeFromText,
  allPrimesFromText,
  allPrimes,
  isPrime,
  ifPrime,
  primeInRangeObj,
  allPrimesSecondWay,
};
