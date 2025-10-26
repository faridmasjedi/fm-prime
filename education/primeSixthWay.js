const nonPrimesFirstTrend = (num, countFlag = false) => {
  let t = 1;
  let r = 0;
  let m = 6 * t + 3 * r + 1;
  let mm = m - 2;
  let n = mm ** 2 - 9 * r ** 2;
  let nn = n + 4 * mm + 4;
  let nonPrimes = {};
  let res = {};
  let count = 0;
  let sumCount = 0;

  while (n <= num) {
    while (n <= num) {
      res[n] = true;
      count++;
      if (nn <= num) {
        res[nn] = true;
        count++;
      }
      if (count >= 10000) {
        sumCount += count;
        nonPrimes[sumCount] = res;
        count = 0;
        res = {};
      }
      r++;
      m = 6 * t + 3 * r + 1;
      mm = m - 2;
      n = mm ** 2 - 9 * r ** 2;
      nn = n + 4 * mm + 4;
    }
    r = 0;
    t++;
    m = 6 * t + 3 * r + 1;
    mm = m - 2;
    n = mm ** 2 - 9 * r ** 2;
    nn = n + 4 * mm + 4;
  }
  if (count) {
    sumCount += count;
    nonPrimes[sumCount] = res;
  }
  return countFlag ? sumCount : nonPrimes;
};

const nonPrimesSecondTrend = (num, countFlag = false) => {
  let t = 1;
  let k = 0;

  let m = 3 * (t + k) - 3 * t + 1;
  let mm = m - 2;

  let n = 9 * (2 * t + k) ** 2 - mm ** 2;
  let nn = n - 4 * mm - 4;
  let nonPrimes = {};
  let res = {};
  let count = 0;
  let sumCount = 0;

  while (nn <= num) {
    while (nn <= num) {
      res[nn] = true;
      count++;
      if (n <= num) {
        res[n] = true;
        count++;
      }
      if (count >= 10000) {
        sumCount += count;
        nonPrimes[sumCount] = res;
        count = 0;
        res = {};
      }
      k++;
      m = 3 * (t + k) - 3 * t + 1;
      mm = m - 2;
      n = 9 * (2 * t + k) ** 2 - mm ** 2;
      nn = n - 4 * mm - 4;
    }
    k = 0;
    t++;
    m = 3 * (t + k) - 3 * t + 1;
    mm = m - 2;
    n = 9 * (2 * t + k) ** 2 - mm ** 2;
    nn = n - 4 * mm - 4;
  }
  if (count) {
    sumCount += count;
    nonPrimes[sumCount] = res;
  }
  return countFlag ? sumCount : nonPrimes;
};

const divisionFirstTrend = (num) => {
  if (num % 5 === 0) return 5;
  let n = (num - 1) / 6;
  let r = 0;
  while (7 * r <= n - 8) {
    let check1 = (9 * r ** 2 + 6 * n + 1) ** 0.5;
    if (check1 === Math.floor(check1)) {
      let check2 = check1 - 3 * r - 1;

      if (!(check2 % 6) && check2 >= 6 && check2 + 3 * r + 1 >= 0) {
        return check2 + 1; // r, m = check2 + 3 * r + 1 -> m - 3r = check2 + 1
      }
    }
    r++;
  }

  r = 0;
  while (5 * r <= n - 4) {
    let check1 = (9 * r ** 2 + 6 * n + 1) ** 0.5;
    if (check1 === Math.floor(check1)) {
      let check2 = check1 - 3 * r + 1;
      if (!(check2 % 6) && check2 >= 6 && check2 + 3 * r - 1 >= 0) {
        return check2 - 1; // r, m = check2 + 3 * r - 1 -> m - 3r = check2 - 1
      }
    }
    r++;
  }
  return num;
};

const divisionSecondTrend = (num) => {
  if (num % 5 === 0) return 5;
  let n = (num + 1) / 6;
  let r = 0;
  let check = Math.sqrt(num) / 3;
  while (7 * r <= n + 8 /*|| 5 * r <= n + 4*/) {
    if (r >= check) {
      let check1 = (9 * r ** 2 - 6 * n + 1) ** 0.5;
      if (check1 === Math.floor(check1)) {
        let check2 = check1 + 3 * r + 1;
        if (!(check2 % 6) && check2 >= 6 && 3 * r - check2 + 1 >= 0) {
          return check2 - 1; // r, m = 3 * r - check2 + 1 -> 3r - m = check2 - 1
        }
      }
    }

    r++;
  }
  r = 0;

  while (5 * r <= n + 4) {
    if (r >= check) {
      let check1 = (9 * r ** 2 - 6 * n + 1) ** 0.5;
      if (check1 === Math.floor(check1)) {
        let check3 = check1 + 3 * r - 1;
        if (!(check3 % 6) && check3 >= 6 && 3 * r - check3 - 1 >= 0) {
          return check3 + 1; // r, m = 3 * r - check3 - 1 -> 3r - m = check2 - 1
        }
      }
    }

    r++;
  }
  return num;
};

const isPrime = (num) => {
  if (num === 1) return false;
  if (num === 2) return true;
  if (num === 3) return true;
  if (num % 6 !== 1 && num % 6 !== 5) return false;
  return num % 6 === 1
    ? divisionFirstTrend(num) === num
    : divisionSecondTrend(num) === num;
};

const countDivision = (num, res) => {
  res[num] ? res[num]++ : (res[num] = 1);
  return res;
};

const allDivisions = (num) => {
  let res = {};
  let r = 1;
  let cc = 0;
  while (num !== 1 && cc < 10) {
    cc++;
    if (num % 2 === 0) {
      r = 2;
      res = countDivision(2, res);
    } else if (num % 3 === 0) {
      r = 3;
      res = countDivision(3, res);
    } else if (num % 6 === 1) {
      let nn = divisionFirstTrend(num);
      r = nn;
      res = countDivision(nn, res);
    } else if (num % 6 === 5) {
      let nn = divisionSecondTrend(num);
      r = nn;
      res = countDivision(nn, res);
    }
    num = num / r;
    r = 1;
  }
  return scientificWay(res);
};

const scientificWay = (obj) => {
  let str = "";
  for (let k in obj) {
    let power = obj[k];

    str += power == 1 ? `${k} x ` : `${k} ** ${obj[k]} x `;
  }
  return str.slice(0, -2);
};

// console.log(allDivisions(3549 * 25));
// console.log(isPrime(3549*25));
