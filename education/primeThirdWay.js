const isDividable = (lastIndexFloor, index, trend) => {
  let x1 = lastIndexFloor - index;
  let x2 = lastIndexFloor + index;
  let y1 = 6 * index + 1;
  let y2 = 6 * index - 1;
  if (trend === "firstTrend") {
    let kk = x1 / y1;
    let kkFloor = Math.floor(kk);
    if (kk === kkFloor) return y1;

    kk = x2 / y2;
    kkFloor = Math.floor(kk);
    if (kk === kkFloor) return y2;
  } else {
    let kk = x2 / y1;
    let kkFloor = Math.floor(kk);
    if (kk === kkFloor) return y1;

    kk = x1 / y2;
    kkFloor = Math.floor(kk);
    if (kk === kkFloor) return y2;
  }
  return -1;
};

const division = (num) => {
  if (!(num % 2)) return 2;
  if (!(num % 3)) return 3;
  const lastIndex = (num + 1) / 6;
  const lastIndexFloor = Math.floor(lastIndex);
  const trend = lastIndex === lastIndexFloor ? "secondTrend" : "firstTrend";
  let k = 1;

  while (5 * k - 1 <= lastIndexFloor) {
    let factor = isDividable(lastIndexFloor, k, trend);
    if (factor !== -1) return factor;
    k++;
  }
  return num;
};

const scientificWayOfNum = (obj) => {
  let str = "";
  for (let k in obj) {
    let power = obj[k];

    str += power == 1 ? `${k} x ` : `${k} ** ${obj[k]} x `;
  }
  return str.slice(0, -2);
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

const isPrime = (num) => {
  if (num % 6 !== 1 && num % 6 !== 5) {
    return false;
  }
  return num === division(num);
};

const primesOrCounts = (num, countFlag = false) => {
  if (num === 2) return countFlag ? 1 : "2";
  if (num === 3) return countFlag ? 2 : "2, 3";
  let result = "2, 3, ";
  let count = 2;
  let numberToAdd = 4;

  let numberToInvestigate = 5;
  while (numberToInvestigate <= num) {
    if (isPrime(numberToInvestigate)) {
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

// console.log(primesOrCounts(1000000, true));
