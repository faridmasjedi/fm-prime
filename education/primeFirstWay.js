const division = (num) => {
  if (!(num % 2)) return 2;
  if (!(num % 3)) return 3;

  const lastNumberToCheck = Math.floor(Math.sqrt(num));
  let index = 1;
  let trendNum = 6 * index - 1;
  let nextTrendNum = trendNum + 2;

  while (trendNum <= lastNumberToCheck) {
    if (!(num % trendNum)) {
      return trendNum;
    } else if (!(num % nextTrendNum)) {
      return nextTrendNum;
    }

    index++;
    trendNum = 6 * index - 1;
    nextTrendNum = trendNum + 2;
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

const scientificWayOfNum = (obj) => {
  let str = "";
  for (let k in obj) {
    let power = obj[k];

    str += power == 1 ? `${k} x ` : `${k} ** ${obj[k]} x `;
  }
  return str.slice(0, -2);
};

const ifPrime = (num) => {
  if (num === 1) return false;
  if (num === 2 || num === 3) return true;
  if (num % 6 !== 1 && num % 6 !== 5) {
    return false;
  }
  return num === division(num);
};

const isSophiePrime = (num) => {
  const ifPrimeCheck = ifPrime(num);
  if (ifPrimeCheck) {
    const isSophie = ifPrime(2 * num + 1);
    if (isSophie) {
      return `${num} is a Sophie Prime.`;
    } else {
      return `${num} is not a Sophie Prime.`;
    }
  }
  return `${num} is not a Prime.`;
};

const isMersennePrime = (num) => {
  const ifPrimeCheck = ifPrime(num);

  if (ifPrimeCheck) {
    let numberSize = Math.ceil(Math.log10(2 ** num - 1));
    if (numberSize > 17) {
      return `The size of the number (${numberSize}) is bigger than 17 and can not find if it is mersenne or not.`;
    }
    const mersennePrime = 2 ** num - 1;
    const isMersenne = ifPrime(mersennePrime);
    if (isMersenne) {
      return `${num} is a Mersenne prime`;
    } else {
      return `${num} is not a Mersenne number`;
    }
  }
  return `${num} is not a prime number.`;
};

const isTwinPrime = (num) => {
  let str = "";

  const ifPrimeCheck = ifPrime(num);
  if (ifPrimeCheck) {
    let twinFirst = num - 2;
    let twinSecond = num + 2;

    const isTwinFirst = ifPrime(twinFirst);
    const isTwinSecond = ifPrime(twinSecond);

    if (isTwinFirst) {
      str += `${num} & ${twinFirst} : Twins\n`;
    }

    if (isTwinSecond) {
      str += `${num} & ${twinSecond} : Twins\n`;
    }
  } else {
    return `${num} is not a prime number.`;
  }

  return str ? str : `No Twins`;
};

const isIsolatedPrime = (num) => {
  const ifPrimeCheck = ifPrime(num);

  if (ifPrimeCheck) {
    let isolatedFirst = num + 2;
    let isolatedSecond = num - 2;

    const isIsolatedFirst = ifPrime(isolatedFirst);
    const isIsolatedSecond = ifPrime(isolatedSecond);

    if (!isIsolatedFirst && !isIsolatedSecond) {
      return `${num} is an isolated prime`;
    }
    return `${num} is prime, but not an isolated one.`;
  }

  return `${num} is not a prime number.`;
};

const primesOrCounts = (num, countFlag = false) => {
  if (num === 2) return countFlag ? 1 : "2";
  if (num === 3) return countFlag ? 2 : "2, 3";
  let result = "2, 3, ";
  let count = 2;
  let numberToAdd = 4;

  let numberToInvestigate = 5;
  while (numberToInvestigate <= num) {
    if (ifPrime(numberToInvestigate)) {
      count++;
      result = countFlag ? count : result + `${numberToInvestigate}, `;
    }
    numberToAdd = numberToAdd === 2 ? 4 : 2;
    numberToInvestigate += numberToAdd;
  }
  return countFlag ? result : result.slice(0, -2);
};

const primes = (num) => primesOrCounts(num);
const primesCount = (num) => primesOrCounts(num, true);

const primesInRange = (firstNum, lastNum, countFlag = false) => {
  let result = countFlag ? 0 : "";
  if (firstNum < 3 && lastNum >= 3) {
    result += countFlag ? 2 : "2, 3, ";
  } else if ((firstNum >= 3 && firstNum < 5) & (lastNum >= 3)) {
    result += countFlag ? 1 : "3, ";
  }

  let checkIndex = Math.ceil((firstNum - 1) / 6);
  let checkNum1 = 6 * checkIndex - 1;
  let checkNum2 = 6 * checkIndex + 1;
  let checkFlag = checkNum1 >= firstNum;
  let numberToInvestigate = checkFlag ? checkNum1 : checkNum2;
  let numberToAdd = checkFlag ? 2 : 4;

  while (numberToInvestigate <= lastNum) {
    if (ifPrime(numberToInvestigate)) {
      result += countFlag ? 1 : `${numberToInvestigate}, `;
    }
    numberToInvestigate += numberToAdd;
    numberToAdd = numberToAdd === 2 ? 4 : 2;
  }
  return countFlag ? result : result.slice(0, -2);
};

const primeInRangeObj = (firstNum, lastNum) => {
  let count = 0;
  let counter = count;
  let res = {};
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
    }
    if (count === 10000) {
      counter += 10000;
      res[counter] = result;
      count = 0;
      result = "";
    }
    numberToInvestigate += numberToAdd;
    numberToAdd = numberToAdd === 2 ? 4 : 2;
  }
  if (count % 10000 !== 0) res[counter + count] = result;
  return res;
};

// console.log(primes(10000000));
// console.log(primesCount(100000));
// console.log(primes(100000));
// console.log(primesOrCounts(1000000, true));
// console.log(allDivisions(354922545745));
// console.log(isIsolatedPrime(47));
// console.log(ifPrime(3));
// console.log(primeInRangeObj(99000000, 100000000));

module.exports = {
  primeInRangeObj,
  primesInRange,
  primesCount,
  primes,
  ifPrime,
  allDivisions,
  division,
  isSophiePrime,
  isMersennePrime,
  isTwinPrime,
  isIsolatedPrime,
  scientificWayOfNum,
};
