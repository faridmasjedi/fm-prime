const { plot, Plot } = require("nodeplotlib");

const nonPrimePoint = (n, k, kk) => {
  kkFloor = Math.floor(kk);
  return kk === kkFloor ? { n, k, kk } : "";
};

const firstTrendPoints = (n) => {
  let result = [];
  let k = 1;
  let kk = (n - k) / (6 * k + 1);
  while (kk >= 1) {
    let p = nonPrimePoint(n, k, kk);
    if (p) result.push(p);
    k++;
    kk = (n - k) / (6 * k + 1);
  }

  k = 1;
  kk = (n + k) / (6 * k - 1);
  while (kk >= 1) {
    let p = nonPrimePoint(n, k, kk);
    if (p) result.push(p);
    k++;
    kk = (n + k) / (6 * k - 1);
  }
  return result;
};

const secondTrendPoints = (n) => {
  let result = [];
  let k = 1;
  let kk = (n - k) / (6 * k - 1);
  while (kk >= 1) {
    let p = nonPrimePoint(n, k, kk);
    if (p) result.push(p);
    k++;
    kk = (n - k) / (6 * k - 1);
  }
  k = 1;
  kk = (n + k) / (6 * k + 1);
  while (kk >= 1) {
    let p = nonPrimePoint(n, k, kk);
    if (p) result.push(p);
    k++;
    kk = (n + k) / (6 * k + 1);
  }

  return result;
};

// find all the first trend points for 1, ..., n
const firstTrendPointsList = (n) => {
  let result = [];
  for (let i = 1; i <= n; i++) {
    result = [...result, ...firstTrendPoints(i)];
  }
  return result;
};

// find all the second trend points for 1, ..., n
const secondTrendPointsList = (n) => {
  let result = [];
  for (let i = 1; i <= n; i++) {
    result = [...result, ...secondTrendPoints(i)];
  }
  return result;
};

const dataForScatter = (n) => {
  let xFirstTrend = [];
  let xSecondTrend = [];
  let yFirstTrend = [];
  let ySecondTrend = [];
  let result = [];
  let firstTrendP = firstTrendPoints(n);
  if (firstTrendP.length) {
    firstTrendP.forEach((p) => {
      xFirstTrend.push(p["k"]);
      yFirstTrend.push(p["kk"]);
    });
  }
  let secondTrendp = secondTrendPoints(n);

  if (secondTrendp.length) {
    secondTrendp.forEach((p) => {
      xSecondTrend.push(p["k"]);
      ySecondTrend.push(p["kk"]);
    });
  }

  if (xFirstTrend.length)
    result.push({
      x: xFirstTrend,
      y: yFirstTrend,
      name: "" + `6n+1 | n = ${n}`,
    });
  if (xSecondTrend.length)
    result.push({
      x: xSecondTrend,
      y: ySecondTrend,
      name: "" + `6n-1 | n = ${n}`,
    });

  return result;
};

const scatter = (n) => {
  let layout = {
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
    },
  };

  let data = dataForScatter(n);
  if (data.length) plot(data, layout);
};

const scatterSeprated = (n) => {
  for (let i = 1; i <= n; i++) {
    scatter(i);
  }
};

const scatterTogether = (n) => {
  let layout = {
    showlegend: true,
    legend: {
      x: 1,
      y: 1,
    },
  };
  let data = [];
  for (let i = 1; i <= n; i++) {
    let data_ = dataForScatter(i);
    if (data_.length) data = [...data, ...data_];
  }
  if (data.length) plot(data, layout);
};

// scatterSeprated(41);
// scatterTogether(10);
// secondTrendPoints(2);
// scatter(1171728204557725);
