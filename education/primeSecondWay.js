const nonPrimeIndexes = (num) => {
  let result = { firstTrend: {}, secondTrend: {} };
  let numIndex = Math.ceil((num + 1) / 6);
  let kk = 1;
  let k = 1;

  while (6 * k * kk - k - kk <= numIndex) {
    while (6 * k * kk - k - kk <= numIndex) {
      let nonPrimeInd1 = 6 * k * kk + k + kk;
      let nonPrimeInd2 = 6 * k * kk - k - kk;
      let nonPrimeInd3 = 6 * k * kk + k - kk;
      let nonPrimeInd4 = 6 * k * kk - k + kk;
      if (nonPrimeInd1 <= numIndex) result["firstTrend"][nonPrimeInd1] = true;
      if (nonPrimeInd2 <= numIndex) result["firstTrend"][nonPrimeInd2] = true;
      if (nonPrimeInd3 <= numIndex) result["secondTrend"][nonPrimeInd3] = true;
      if (nonPrimeInd4 <= numIndex) result["secondTrend"][nonPrimeInd4] = true;
      kk++;
    }

    if (/* 6*(k+1)*1 - (k+1) - 1 = */ 5 * k + 4 <= numIndex) {
      kk = 1;
      k++;
    }
  }
  return result;
};

// This is quicker
const nonPrimeIndex = (num) => {
  let result = { firstTrend: {}, secondTrend: {} };
  let kk = 1;
  let k = 1;

  let numIndex = Math.ceil((num + 1) / 6);
  let lastTrendIndex = 6 * k * kk - k - kk;
  while (lastTrendIndex <= numIndex) {
    if (lastTrendIndex <= numIndex) {
      let nonPrimeInd1 = 6 * k * kk + k + kk;
      let nonPrimeInd2 = 6 * k * kk - k - kk;
      let nonPrimeInd3 = 6 * k * kk + k - kk;
      let nonPrimeInd4 = 6 * k * kk - k + kk;
      if (nonPrimeInd1 <= numIndex) result["firstTrend"][nonPrimeInd1] = true;
      if (nonPrimeInd2 <= numIndex) result["firstTrend"][nonPrimeInd2] = true;
      if (nonPrimeInd3 <= numIndex) result["secondTrend"][nonPrimeInd3] = true;
      if (nonPrimeInd4 <= numIndex) result["secondTrend"][nonPrimeInd4] = true;
      kk++;
      lastTrendIndex = 6 * k * kk - k - kk;
    }
    k++;
    kk = 1;
    lastTrendIndex = 5 * k - 1;
  }
  return result;
};

const checkIndex = (trendString, index) => {
  return (
    trendString.includes(`, ${index},`) || trendString.includes(`|${index},`)
  );
};

const nonPrimeIndexString = (num) => {
  let firstTrend = "|";
  let secondTrend = "|";
  let kk = 1;
  let k = 1;

  let numIndex = Math.ceil((num + 1) / 6);
  let lastTrendIndex = 6 * k * kk - k - kk;
  while (lastTrendIndex <= numIndex) {
    if (lastTrendIndex <= numIndex) {
      let nonPrimeInd1 = 6 * k * kk + k + kk;
      let nonPrimeInd2 = 6 * k * kk - k - kk;
      let nonPrimeInd3 = 6 * k * kk + k - kk;
      let nonPrimeInd4 = 6 * k * kk - k + kk;

      if (nonPrimeInd1 <= numIndex && !checkIndex(firstTrend, nonPrimeInd1))
        firstTrend += `${nonPrimeInd1}, `;
      if (nonPrimeInd2 <= numIndex && !checkIndex(firstTrend, nonPrimeInd2))
        firstTrend += `${nonPrimeInd2}, `;
      if (nonPrimeInd3 <= numIndex && !checkIndex(secondTrend, nonPrimeInd3))
        secondTrend += `${nonPrimeInd3}, `;
      if (nonPrimeInd4 <= numIndex && !checkIndex(secondTrend, nonPrimeInd4))
        secondTrend += `${nonPrimeInd4}, `;
      kk++;
      lastTrendIndex = 6 * k * kk - k - kk;
    }
    k++;
    kk = 1;
    lastTrendIndex = 5 * k - 1;
  }
  return [firstTrend.slice(1, -2), secondTrend.slice(1, -2)];
};

const isPrime = (num) => {
  if (num === 2 || num === 3) return true;
  if (num % 6 !== 1 && num % 6 !== 5) return false;

  let k = 1;
  let kk = 1;
  let numIndex = (num + 1) / 6;
  let numIndexFloor = Math.floor(numIndex);
  let trend = numIndex === numIndexFloor ? "secondTrend" : "firstTrend";
  while (5 * k - 1 <= numIndexFloor) {
    let lastTrendIndex = 6 * k * kk - k - kk;
    while (lastTrendIndex <= numIndexFloor) {
      if (trend === "firstTrend") {
        let nonPrimeInd1 = 6 * k * kk + k + kk;
        let nonPrimeInd2 = 6 * k * kk - k - kk;

        if (numIndexFloor === nonPrimeInd1 || numIndexFloor === nonPrimeInd2) {
          return false;
        }
      } else {
        let nonPrimeInd3 = 6 * k * kk + k - kk;
        let nonPrimeInd4 = 6 * k * kk - k + kk;

        if (numIndexFloor === nonPrimeInd3 || numIndexFloor === nonPrimeInd4) {
          return false;
        }
      }
      kk++;
      lastTrendIndex = 6 * k * kk - k - kk;
    }
    kk = 1;
    k++;
  }
  return true;
};

const primesOrCounts = (num, countFlag = false) => {
  if (num === 2) return countFlag ? 1 : "2";
  if (num === 3) return countFlag ? 2 : "2, 3";
  let result = "2, 3, ";
  let count = 2;
  let numberToInvestigate = 5;
  let numberToAdd = 4;
  let addNumberToFindIndex = +1;
  let [firstTrend, secondTrend] = nonPrimeIndexString(num);

  while (numberToInvestigate <= num) {
    let index = (numberToInvestigate + addNumberToFindIndex) / 6;

    if (
      (addNumberToFindIndex === 1 &&
        !checkIndex("|" + secondTrend + ",", index)) ||
      (addNumberToFindIndex === -1 &&
        !checkIndex("|" + firstTrend + ",", index))
    ) {
      count++;
      countFlag ? (result = count) : (result += `${numberToInvestigate}, `);
    }

    numberToAdd = numberToAdd === 4 ? 2 : 4;
    addNumberToFindIndex = addNumberToFindIndex === 1 ? -1 : 1;
    numberToInvestigate += numberToAdd;
  }
  return countFlag ? result : result.slice(0, -2);
};

const primes = (num) => primesOrCounts(num);
const primeCount = (num) => primesOrCounts(num, true);

// console.log(nonPrimeIndexString(100));
// console.log(nonPrimeIndex(100));
// console.log(nonPrimeIndexString(100));
