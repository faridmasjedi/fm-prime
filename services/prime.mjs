import {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
  isDivisibleBy2,
  isDivisibleBy3,
  isDivisibleBy6,
  findMax
} from "./mathOperation.mjs";

import {
  existsSync as fsExistsSync,
  mkdirSync as fsMkdirSync,
  writeFileSync as fsWriteFileSync,
} from "fs";

const createOutputFolder = (number) => {
  const rootFolder = "./output-big";
  if (!fsExistsSync(rootFolder)) {
    fsMkdirSync(rootFolder, { recursive: true });
  }

  const dir = `./output-big/output-${number}`;
  if (!fsExistsSync(dir)) {
    fsMkdirSync(dir, { recursive: true });
    return dir;
  } else {
    throw new Error(`\n-----------\n${dir} already exists!\n---------------\n`);
  }
};

const generatePartitions = (limit, range) => {
  if (range <= 0) throw new Error("Range must be greater than 0.");
  return Array.from({ length: Math.ceil(+limit / range) }, (_, i) => i * range);
};

const isDivisor = (number, candidate) => {
  return number !== candidate && divideNumbers(number, candidate)[1] === "0";
};

const findPrimeFactor = (num, factor) => {
  if (isDivisor(num, factor)) return factor;
  const nextFactor = addNumbers(factor, "2");
  return isDivisor(num, nextFactor) ? nextFactor : -1;
};

const isPrime = (number, partition = "1") => {
  if (number === "2" || number === "3") {
    return true;
  }

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

    while (currentDivisor <= sqrtNum) {
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

const writeDataToFile = (folderName, pageIndex, data) => {
  const filePath = `${folderName}/Output${pageIndex}.txt`;
  fsWriteFileSync(filePath, data, { flag: "a" });
};

const generatePrimesUpTo = (number) => {
  const startTime = Date.now();
  let pageIndex = 0;
  const folderName = createOutputFolder(number);
  let count = 0;
  let dataBuffer = "";

  let current = "2";
  while ( findMax(current, number) !== current ) {
    if (isPrime(current)) {
      if (count % 9000 === 0 && count !== 0) {
        writeDataToFile(folderName, pageIndex, dataBuffer);
        dataBuffer = "";
        pageIndex++;
      }
      dataBuffer += count % 20 === 0 ? `\n(${count}) | ${current},` : `${current},`;
      count++;
    }
    current = addNumbers(current, "1");
  }

  if (dataBuffer) {
    writeDataToFile(folderName, pageIndex, dataBuffer);
  }

  const finishTime = Date.now();
  console.log(
    `Time to finish the job: ${(finishTime - startTime) / 1000} seconds`
  );
  return count;
};

const generatePrimesInRange = (start, end) => {
  const primesInRange = [];
  let current = start;

  while (findMax(current, end) !== current) {
    if (isPrime(current)) {
      primesInRange.push(current);
    }
    current = addNumbers(current, "1");
  }
  return primesInRange;
};

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
};
