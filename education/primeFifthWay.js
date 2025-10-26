const primeFirstTrend = (n) => {
  let k = 1;
  let kk = 1;
  let indexes = { 1: true, 2: true, 3: true, 4: false };
  while (n >= 5 * k - 1) {
    while (n >= 5 * kk - 1) {
      let con = (6 * k + 1) * kk;
      for (let r = 0; r < 6 * k + 1 && r <= n - con; r++) {
        let nn = con + r;

        if (indexes[nn] !== false) {
          if (r % (6 * k + 1) !== k && (r + 2 * kk + k) % (6 * k - 1) !== 0) {
            indexes[nn] = true;
          } else {
            indexes[nn] = false;
          }
        }
      }

      con = (6 * kk + 1) * k;
      for (let r = 0; r < 6 * kk + 1 && r <= n - con; r++) {
        let nn = con + r;

        if (r % (6 * kk + 1) == kk || (r + 2 * k + kk) % (6 * kk - 1) == 0) {
          indexes[nn] = false;
        }
      }

      con = (6 * k - 1) * kk;
      for (let r = 0; r < 6 * k - 1 && r <= n - con; r++) {
        let nn = con + r;
        if (indexes[nn] !== false) {
          let cond = r - 2 * kk - k;
          while (cond < 0) cond += 6 * k + 1;

          if (r % (6 * k - 1) !== 5 * k - 1 && cond % (6 * k + 1) !== 0) {
            indexes[nn] = true;
          } else {
            indexes[nn] = false;
          }
        }
      }

      con = (6 * kk - 1) * k;
      for (let r = 0; r < 6 * kk - 1 && r <= n - con; r++) {
        let nn = con + r;

        let cond = r - 2 * k - kk;
        while (cond < 0) cond += 6 * kk + 1;

        if (indexes[nn] !== false) {
          if (r % (6 * kk - 1) == 5 * kk - 1 || cond % (6 * kk + 1) == 0) {
            indexes[nn] = false;
          }
        }
      }
      kk++;
    }
    kk = 1;
    k++;
  }

  return indexes;
};

const primeSecondTrend = (n) => {
  let k = 1;
  let kk = 1;
  let indexes = { 1: true, 2: true, 3: true, 4: true };
  while (n >= 5 * k + 1) {
    while (n >= 5 * kk + 1) {
      let con = (6 * k - 1) * kk;
      for (let r = 0; r < 6 * k - 1 && r <= n - con; r++) {
        let nn = con + r;
        if (indexes[nn] !== false) {
          let cond = r - 2 * kk + k;

          while (cond < 0) cond += 6 * k + 1;

          if (r % (6 * k - 1) !== k && cond % (6 * k + 1) !== 0) {
            indexes[nn] = true;
          } else {
            indexes[nn] = false;
          }
        }
      }

      con = (6 * kk + 1) * k;
      for (let r = 0; r < 6 * kk + 1 && r <= n - con; r++) {
        let nn = con + r;

        let cond = r + 2 * k - kk;
        while (cond < 0) cond += 6 * kk - 1;
        if (r % (6 * kk + 1) == 5 * kk + 1 || cond % (6 * kk - 1) == 0) {
          indexes[nn] = false;
        }
      }

      con = (6 * k + 1) * kk;
      for (let r = 0; r < 6 * k + 1 && r <= n - con; r++) {
        let nn = con + r;
        if (indexes[nn] !== false) {
          let cond = r + 2 * kk - k;
          while (cond < 0) cond += 6 * k - 1;
          if (r % (6 * k + 1) !== 5 * k + 1 && cond % (6 * k - 1) !== 0) {
            indexes[nn] = true;
          } else {
            indexes[nn] = true;
          }
        }
      }

      con = (6 * kk - 1) * k;
      for (let r = 0; r < 6 * kk - 1 && r <= n - con; r++) {
        let nn = con + r;

        let cond = r - 2 * k + kk;
        while (cond < 0) cond += 6 * kk + 1;
        if (r % (6 * kk - 1) == kk || cond % (6 * kk + 1) == 0) {
          indexes[nn] = false;
        }
      }

      kk++;
    }
    kk = 1;
    k++;
  }
  return indexes;
};

// console.log(primeFirstTrend(10));
// console.log(primeSecondTrend(10));
