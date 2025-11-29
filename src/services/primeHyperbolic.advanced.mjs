/**
 * ADVANCED HYPERBOLIC PRIME DETECTION WITH CACHING
 * =================================================
 *
 * An experimental implementation of the hyperbolic prime detection algorithm
 * using advanced modular filtering, integrated with the full caching and
 * parallelization framework.
 *
 * METHODS:
 * - isPrimeHyperbolicAdvanced(n) - Check if single number is prime (with caching)
 * - sieveHyperbolicAdvanced(limit) - Generate all primes up to limit (with caching)
 * - divisionHyperbolicAdvanced(n) - Find smallest divisor using the advanced method
 */

import {
  numFolderExist,
  createOutputFolder,
  writeDataToFile,
  findLastExistingFolderNumber,
  getAllFromDirectory,
  parseAndSortFiles,
  primesInFile,
  writePrimesToSplitFiles,
  readAllPrimesFromFolder
} from './fileOperations.mjs';

import {
  existsSync as fsExistsSync,
  readdirSync as fsReadDirSync,
  statSync as fsStatSync,
  rmSync as fsRmSync,
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync
} from 'fs';

const OUTPUT_ROOT = './output-big-advanced'; // Use a separate cache directory

// ============================================================================
// CORE ALGORITHM HELPERS
// ============================================================================

function isqrt(n) {
  if (n < 2n) return n;
  if (n <= 9007199254740991n) {
    return BigInt(Math.floor(Math.sqrt(Number(n))));
  }
  let x = n;
  let y = (x + 1n) >> 1n;
  while (y < x) {
    x = y;
    y = (x + n / x) >> 1n;
  }
  return x;
}

function checkFactor(num, f) {
  if (f > 1n && f < num) {
    if ((f - 1n) % 6n === 0n || (f + 1n) % 6n === 0n) {
      if (num % f === 0n) return f;
    }
  }
  return null;
}

// ============================================================================
// ADVANCED MODULAR FILTERING LOGIC
// ============================================================================

const MODULI = [5, 7, 11, 13, 17, 19];
const qrCache = new Map();

function getQuadraticResidues(p) {
  if (qrCache.has(p)) {
    return qrCache.get(p);
  }
  const residues = new Set();
  for (let i = 0; i < p; i++) {
    residues.add((i * i) % p);
  }
  qrCache.set(p, residues);
  return residues;
}

function buildRFilter(n, isFirstTrend) {
  const rFilters = {};
  const n6 = 6n * n;
  for (const p of MODULI) {
    const pBig = BigInt(p);
    const residues = getQuadraticResidues(p);
    const validR = new Set();
    let C = isFirstTrend ? (n6 + 1n) % pBig : ((-n6 + 1n) % pBig + pBig) % pBig;
    for (let r_mod = 0; r_mod < p; r_mod++) {
      const disc_mod = (9n * BigInt(r_mod * r_mod) + C) % pBig;
      if (residues.has(Number((disc_mod + pBig) % pBig))) {
        validR.add(r_mod);
      }
    }
    rFilters[p] = validR;
  }
  return rFilters;
}

// ============================================================================
// ADVANCED CORE DIVISION ALGORITHM
// ============================================================================

export function divisionHyperbolicAdvanced(numInput) {
    const num = BigInt(numInput);
    if (num % 2n === 0n) return '2';
    if (num % 3n === 0n) return '3';
    if (num % 5n === 0n) return '5';
    const isFirstTrend = (num % 6n === 1n);
    const n = isFirstTrend ? (num - 1n) / 6n : (num + 1n) / 6n;
    const rFilters = buildRFilter(n, isFirstTrend);
    const limitA = isFirstTrend ? (n - 8n) / 7n : (n + 8n) / 7n;
    const limitB = isFirstTrend ? (n - 4n) / 5n : (n + 4n) / 5n;
    const maxR = limitA > limitB ? limitA : limitB;
    let startR = 0n;
    if (!isFirstTrend) {
        const minVal = (6n * n - 1n) / 9n;
        if (minVal > 0) startR = isqrt(minVal);
    }
    let r = startR;
    let k_idx = 1n;
    const n6 = 6n * n;
    const sqrtN = isqrt(num);
    while (true) {
        if (r <= maxR) {
            let canSkipR = false;
            for (const p of MODULI) {
                if (!rFilters[p].has(Number(r % BigInt(p)))) {
                    canSkipR = true;
                    break;
                }
            }
            if (!canSkipR) {
                const discriminant = isFirstTrend ? (9n * r * r + n6 + 1n) : (9n * r * r - n6 + 1n);
                const m = isqrt(discriminant);
                if (m * m === discriminant) {
                    const term3r = 3n * r;
                    const f1 = isFirstTrend ? m - term3r : term3r - m;
                    const f2 = isFirstTrend ? m + term3r : term3r + m;
                    const d1 = checkFactor(num, f1);
                    if (d1) return d1.toString();
                    const d2 = checkFactor(num, f2);
                    if (d2) return d2.toString();
                }
            }
            r++;
        }
        const k1 = 6n * k_idx - 1n;
        const k2 = 6n * k_idx + 1n;
        if (k1 > sqrtN) break;
        if (num % k1 === 0n) return k1.toString();
        if (num % k2 === 0n) return k2.toString();
        k_idx++;
        if (r > maxR && k1 > sqrtN) break;
    }
    return num.toString();
}

function isPrimeHyperbolicCoreAdvanced(numInput) {
  const num = BigInt(numInput);
  if (num <= 3n) return num > 1n;
  if (num % 2n === 0n || num % 3n === 0n) return false;
  const div = BigInt(divisionHyperbolicAdvanced(num));
  return div === num;
}

// ============================================================================
// CACHING INFRASTRUCTURE
// ============================================================================

function readPrimesFromFolder(folderPath) {
  return readAllPrimesFromFolder(folderPath);
}

function findLargestExistingLimit() {
  if (!fsExistsSync(OUTPUT_ROOT)) return null;
  const folders = fsReadDirSync(OUTPUT_ROOT)
    .filter(f => f.startsWith('output-'))
    .map(f => BigInt(f.replace('output-', '')))
    .sort((a, b) => (a > b ? -1 : 1));
  return folders.length > 0 ? folders[0] : null;
}

function savePrimesToFolder(limit, primes) {
  const folderPath = createOutputFolder(limit.toString(), OUTPUT_ROOT);
  writePrimesToSplitFiles(folderPath, primes);
}

function generatePrimesInRangeAdvanced(start, limit) {
  const primes = [];
  if (start < 2n && 2n <= limit) primes.push(2n);
  if (start < 3n && 3n <= limit) primes.push(3n);
  let current = start < 5n ? 5n : start + 1n;
  if (current % 2n === 0n) current++;
  for (let i = current; i <= limit; i += 2n) {
    if (i % 3n !== 0n && isPrimeHyperbolicCoreAdvanced(i)) {
      primes.push(i);
    }
  }
  return primes;
}

// ============================================================================
// PUBLIC API - ADVANCED METHODS WITH CACHING
// ============================================================================

export function sieveHyperbolicAdvanced(limitInput) {
  const limit = BigInt(limitInput);
  if (limit < 2n) return [];
  const exactFolder = numFolderExist(limit.toString(), OUTPUT_ROOT);
  if (exactFolder) {
    return readPrimesFromFolder(exactFolder);
  }
  const largestExisting = findLargestExistingLimit();
  let startFrom = 2n;
  let cachedPrimes = [];
  if (largestExisting !== null && largestExisting < limit) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    cachedPrimes = readPrimesFromFolder(cachedFolder);
    startFrom = largestExisting + 1n;
  } else if (largestExisting !== null && largestExisting >= limit) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    const allPrimes = readPrimesFromFolder(cachedFolder);
    const filteredPrimes = allPrimes.filter(p => p <= limit);
    savePrimesToFolder(limit, filteredPrimes);
    return filteredPrimes;
  }
  const newPrimes = generatePrimesInRangeAdvanced(startFrom - 1n, limit);
  const allPrimes = [...cachedPrimes, ...newPrimes];
  savePrimesToFolder(limit, allPrimes);
  return allPrimes;
}

export function isPrimeHyperbolicAdvanced(numInput) {
  const num = BigInt(numInput);
  if (num <= 1n) return false;
  if (num === 2n || num === 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;
  if (num <= 10000n) {
    return isPrimeHyperbolicCoreAdvanced(num);
  }
  const sqrtN = isqrt(num);
  const largestExisting = findLargestExistingLimit();
  if (largestExisting !== null && largestExisting >= sqrtN) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    const primes = readPrimesFromFolder(cachedFolder);
    for (const p of primes) {
      if (p > sqrtN) break;
      if (num % p === 0n) return false;
    }
    return true;
  }
  return isPrimeHyperbolicCoreAdvanced(num);
}

export function getHyperbolicCacheStatsAdvanced() {
  if (!fsExistsSync(OUTPUT_ROOT)) {
    return { folders: 0, largestLimit: null, totalFolders: 0 };
  }
  const folders = fsReadDirSync(OUTPUT_ROOT)
    .filter(f => f.startsWith('output-'))
    .map(f => BigInt(f.replace('output-', '')))
    .sort((a, b) => (a > b ? -1 : 1));
  return {
    folders: folders.length,
    largestLimit: folders.length > 0 ? folders[0] : null,
    availableLimits: folders
  };
}
