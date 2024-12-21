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
  } from "./mathOperations";
  
  import {
    existsSync as fsExistsSync,
    mkdirSync as fsMkdirSync,
    writeFileSync as fsWriteFileSync,
  } from "fs";
  
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
    const partitionRange = addNumbers(divideNumbers(sqrtLimit, partition)[0], "1");
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
  
      while (findMax(currentDivisor, sqrtNum) !== currentDivisor) {
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
  const writeDataToFile = (folderName, pageIndex, data) => {
    const filePath = `${folderName}/Output${pageIndex}.txt`;
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
    while (findMax(current, number) !== current) {
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
    console.log(`Time to finish the job: ${(finishTime - startTime) / 1000} seconds`);
    return count;
  };
  
  // Generate primes within a range
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
  
  // Write primes to file for a range
  const writePrimesToFile = (start, end, folderName) => {
    const primesInRange = generatePrimesInRange(start, end);
    const dataBuffer = primesInRange.join(", ");
    writeDataToFile(folderName, 0, dataBuffer);
    return primesInRange.length;
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
  };
  