/**
 * CACHED HYPERBOLIC PRIME SIEVE
 * ==============================
 *
 * This module wraps the hyperbolic prime detection algorithm with intelligent
 * file-based caching to avoid recomputation. It follows the same pattern as
 * the existing optimized methods in the codebase.
 *
 * FEATURES:
 * 1. Checks if results already exist in output-big folder
 * 2. If requested limit < existing: reads subset from files
 * 3. If requested limit > existing: continues from last cached result
 * 4. Saves all results back to output-big for future use
 *
 * USAGE:
 * import { sieveHyperbolicCached, isPrimeHyperbolicCached } from './primeHyperbolic.cached.mjs';
 * const primes = sieveHyperbolicCached('10000000');
 */

import {
  isPrimeHyperbolic,
  sieveHyperbolic,
  divisionHyperbolic
} from './primeHyperbolic.fixed.mjs';

import {
  numFolderExist,
  createOutputFolder,
  writeDataToFile,
  findMatchingFolder,
  findMatchingFile,
  primesInFile,
  findLastExistingFolderNumber,
  getAllFromDirectory,
  parseAndSortFiles
} from '../src/services/fileOperations.mjs';

import {
  existsSync as fsExistsSync,
  readFileSync as fsReadFileSync,
  readdirSync as fsReadDirSync
} from 'fs';

import { findMax } from '../src/services/mathOperations.mjs';

const OUTPUT_ROOT = './output-big';

/**
 * Reads all primes from an output folder
 * @param {string} folderPath - Path to the output folder
 * @returns {bigint[]} - Array of prime numbers as BigInts
 */
function readPrimesFromFolder(folderPath) {
  if (!fsExistsSync(folderPath)) return [];

  const files = getAllFromDirectory(folderPath);
  const sortedFiles = parseAndSortFiles(files.filter(f => f.startsWith('Output')));

  const allPrimes = [];
  for (const file of sortedFiles) {
    const filePath = `${folderPath}/${file}`;
    const primes = primesInFile(filePath); // Returns array of strings

    // Convert each prime string to BigInt
    for (const p of primes) {
      const trimmed = p.trim();
      // Skip empty strings and any remaining index markers
      if (trimmed && trimmed !== '' && !trimmed.includes('|') && !trimmed.includes('(')) {
        try {
          allPrimes.push(BigInt(trimmed));
        } catch (e) {
          // Skip any values that can't be converted to BigInt (shouldn't happen)
        }
      }
    }
  }

  return allPrimes;
}

/**
 * Finds the largest existing output folder number
 * @returns {bigint|null} - The largest folder number or null if none exist
 */
function findLargestExistingLimit() {
  if (!fsExistsSync(OUTPUT_ROOT)) return null;

  const folders = fsReadDirSync(OUTPUT_ROOT)
    .filter(f => f.startsWith('output-'))
    .map(f => BigInt(f.replace('output-', '')))
    .sort((a, b) => (a > b ? -1 : 1));

  return folders.length > 0 ? folders[0] : null;
}

/**
 * Saves primes to output folder in the same format as existing system
 * Format: (index) | p1,p2,p3,... (20 primes per line)
 * @param {bigint} limit - The upper limit used to generate primes
 * @param {bigint[]} primes - Array of prime numbers
 */
function savePrimesToFolder(limit, primes) {
  const folderPath = createOutputFolder(limit.toString());
  const filename = 'Output0.txt';

  // Format primes with indices (20 per line)
  let data = '';
  for (let i = 0; i < primes.length; i++) {
    if (i % 20 === 0) {
      data += (i === 0 ? '' : '\n') + `(${i}) | `;
    }
    data += primes[i].toString() + ',';
  }

  // Write to file
  writeDataToFile(folderPath, filename, data);

  console.log(`✓ Saved ${primes.length} primes to ${folderPath}/${filename}`);
}

/**
 * Generates primes from a starting point to a limit using hyperbolic method
 * @param {bigint} start - Starting number (exclusive)
 * @param {bigint} limit - Upper limit (inclusive)
 * @returns {bigint[]} - Array of primes in the range
 */
function generatePrimesInRange(start, limit) {
  const primes = [];

  // Start from the next odd number after start
  let current = start + 1n;
  if (current % 2n === 0n) current++;
  if (current <= 2n) {
    if (2n <= limit) primes.push(2n);
    current = 3n;
  }
  if (current <= 3n && 3n <= limit) {
    primes.push(3n);
    current = 5n;
  }

  // Check all odd numbers from current to limit
  for (let i = current; i <= limit; i += 2n) {
    // Skip multiples of 3
    if (i % 3n !== 0n && isPrimeHyperbolic(i)) {
      primes.push(i);
    }
  }

  return primes;
}

/**
 * MAIN CACHED SIEVE FUNCTION
 *
 * Intelligently generates primes up to a limit using cache when possible
 *
 * @param {string|number|bigint} limitInput - Upper limit for prime generation
 * @returns {bigint[]} - Array of all primes up to limit
 */
export function sieveHyperbolicCached(limitInput) {
  const limit = BigInt(limitInput);

  if (limit < 2n) return [];

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Hyperbolic Cached Sieve - Finding primes up to ${limit.toLocaleString()}`);
  console.log('='.repeat(60));

  // Check if exact folder exists
  const exactFolder = numFolderExist(limit.toString());
  if (exactFolder) {
    console.log(`✓ Found cached results for ${limit}`);
    const startTime = performance.now();
    const primes = readPrimesFromFolder(exactFolder);
    const endTime = performance.now();
    console.log(`✓ Loaded ${primes.length.toLocaleString()} primes in ${((endTime - startTime) / 1000).toFixed(3)}s`);
    console.log('='.repeat(60) + '\n');
    return primes;
  }

  // Find largest existing cache
  const largestExisting = findLargestExistingLimit();

  let startFrom = 2n;
  let cachedPrimes = [];

  if (largestExisting !== null && largestExisting < limit) {
    // We can use existing cache and continue from there
    console.log(`✓ Found cached results up to ${largestExisting.toLocaleString()}`);
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;

    const loadStart = performance.now();
    cachedPrimes = readPrimesFromFolder(cachedFolder);
    const loadEnd = performance.now();

    console.log(`✓ Loaded ${cachedPrimes.length.toLocaleString()} cached primes in ${((loadEnd - loadStart) / 1000).toFixed(3)}s`);

    startFrom = largestExisting + 1n;
    console.log(`→ Computing primes from ${startFrom.toLocaleString()} to ${limit.toLocaleString()}...`);
  } else if (largestExisting !== null && largestExisting >= limit) {
    // Requested limit is smaller than what we have - just filter
    console.log(`✓ Found cached results up to ${largestExisting.toLocaleString()} (more than requested)`);
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;

    const loadStart = performance.now();
    const allPrimes = readPrimesFromFolder(cachedFolder);
    const loadEnd = performance.now();

    const filteredPrimes = allPrimes.filter(p => p <= limit);
    console.log(`✓ Filtered to ${filteredPrimes.length.toLocaleString()} primes in ${((loadEnd - loadStart) / 1000).toFixed(3)}s`);

    // Save the filtered results for this specific limit
    savePrimesToFolder(limit, filteredPrimes);
    console.log('='.repeat(60) + '\n');
    return filteredPrimes;
  } else {
    console.log(`→ No cached results found. Computing from scratch...`);
  }

  // Generate new primes
  const computeStart = performance.now();
  const newPrimes = generatePrimesInRange(startFrom - 1n, limit);
  const computeEnd = performance.now();

  console.log(`✓ Computed ${newPrimes.length.toLocaleString()} new primes in ${((computeEnd - computeStart) / 1000).toFixed(3)}s`);

  // Combine cached and new primes
  const allPrimes = [...cachedPrimes, ...newPrimes];

  // Save to cache
  console.log(`→ Saving results to cache...`);
  savePrimesToFolder(limit, allPrimes);

  console.log('='.repeat(60) + '\n');
  return allPrimes;
}

/**
 * Checks if a single number is prime using cached data when beneficial
 *
 * Strategy:
 * 1. For small numbers, use direct hyperbolic check (fast)
 * 2. For large numbers, check if we have cached primes up to sqrt(n)
 * 3. If yes, use trial division with cached primes (much faster)
 * 4. If no, use hyperbolic method directly
 *
 * @param {string|number|bigint} numInput - Number to check
 * @returns {boolean} - True if prime, false otherwise
 */
export function isPrimeHyperbolicCached(numInput) {
  const num = BigInt(numInput);

  // Base cases
  if (num <= 1n) return false;
  if (num === 2n || num === 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  // For numbers <= 10000, just use direct check (very fast)
  if (num <= 10000n) {
    return isPrimeHyperbolic(num);
  }

  // For larger numbers, try to use cached primes for trial division
  const sqrtN = BigInt(Math.floor(Math.sqrt(Number(num))));
  const largestExisting = findLargestExistingLimit();

  if (largestExisting !== null && largestExisting >= sqrtN) {
    // We have enough cached primes - use trial division
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    const primes = readPrimesFromFolder(cachedFolder);

    // Trial division with cached primes
    for (const p of primes) {
      if (p > sqrtN) break;
      if (num % p === 0n) return false;
    }
    return true;
  }

  // No suitable cache - use hyperbolic method
  return isPrimeHyperbolic(num);
}

/**
 * Helper function to get statistics about cached data
 * @returns {Object} - Statistics about cached prime data
 */
export function getCacheStats() {
  if (!fsExistsSync(OUTPUT_ROOT)) {
    return { folders: 0, largestLimit: null, totalSize: 0 };
  }

  const folders = fsReadDirSync(OUTPUT_ROOT)
    .filter(f => f.startsWith('output-'))
    .map(f => ({
      limit: BigInt(f.replace('output-', '')),
      path: `${OUTPUT_ROOT}/${f}`
    }))
    .sort((a, b) => (a.limit > b.limit ? -1 : 1));

  return {
    folders: folders.length,
    largestLimit: folders.length > 0 ? folders[0].limit : null,
    availableLimits: folders.map(f => f.limit)
  };
}

// Re-export original functions for compatibility
export { isPrimeHyperbolic, sieveHyperbolic, divisionHyperbolic };
