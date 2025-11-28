/**
 * OPTIMIZED HYPERBOLIC PRIME DETECTION WITH CACHING
 * ==================================================
 *
 * Two-way search hyperbolic equation approach with intelligent file-based caching.
 * Follows the same patterns as other optimized methods in this codebase.
 *
 * KEY FEATURES:
 * - O(√N) complexity for primality testing
 * - Two-way search (bottom-up + top-down) for optimal performance
 * - Modular square filters (mod 64, 63, 65) to avoid expensive square roots
 * - File-based caching via output-big folder system
 * - Seamless integration with existing fileOperations.mjs infrastructure
 *
 * METHODS:
 * - isPrimeHyperbolicOptimized(n) - Check if single number is prime (with caching)
 * - sieveHyperbolicOptimized(limit) - Generate all primes up to limit (with caching)
 * - divisionHyperbolic(n) - Find smallest divisor using hyperbolic equations
 */

import {
  numFolderExist,
  createOutputFolder,
  writeDataToFile,
  findLastExistingFolderNumber,
  getAllFromDirectory,
  parseAndSortFiles,
  primesInFile
} from './fileOperations.mjs';

import {
  existsSync as fsExistsSync,
  readdirSync as fsReadDirSync,
  statSync as fsStatSync,
  rmSync as fsRmSync,
  readFileSync as fsReadFileSync,
  writeFileSync as fsWriteFileSync
} from 'fs';

const OUTPUT_ROOT = './output-big';

// ============================================================================
// CORE HYPERBOLIC ALGORITHM (Same as primeHyperbolic.fixed.mjs)
// ============================================================================

/**
 * Integer square root using Newton's method
 */
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

// Modular filters - quadratic residues for fast perfect square detection
const QR64 = new Set([0, 1, 4, 9, 16, 17, 25, 33, 36, 41, 49, 57]);
const QR63 = new Set([0, 1, 4, 7, 9, 16, 18, 22, 25, 28, 36, 37, 43, 46, 49, 58]);
const QR65 = new Set([0, 1, 4, 9, 10, 14, 16, 25, 26, 29, 30, 35, 36, 39, 40, 49, 51, 55, 56, 61, 64]);

function isSquareMod64(n) { return QR64.has(Number(n & 63n)); }
function isSquareMod63(n) { return QR63.has(Number(n % 63n)); }
function isSquareMod65(n) { return QR65.has(Number(n % 65n)); }

/**
 * Helper to validate if a factor is a valid divisor
 */
function checkFactor(num, f) {
  if (f > 1n && f < num) {
    if ((f - 1n) % 6n === 0n || (f + 1n) % 6n === 0n) {
      if (num % f === 0n) return f;
    }
  }
  return null;
}

/**
 * Find the smallest divisor of a number using hyperbolic equations
 * Two-way search ensures O(√N) complexity
 * @param {string|number} numInput - Number to factorize
 * @returns {string} Smallest divisor (returns num itself if prime)
 */
export function divisionHyperbolic(numInput) {
  const num = BigInt(numInput);

  // Fast base cases
  if (num % 2n === 0n) return '2';
  if (num % 3n === 0n) return '3';
  if (num % 5n === 0n) return '5';

  const n = (num % 6n === 1n) ? (num - 1n) / 6n : (num + 1n) / 6n;
  const isFirstTrend = (num % 6n === 1n);

  // Calculate limits
  const limitA = isFirstTrend ? (n - 8n) / 7n : (n + 8n) / 7n;
  const limitB = isFirstTrend ? (n - 4n) / 5n : (n + 4n) / 5n;
  const maxR = limitA > limitB ? limitA : limitB;

  // Start point for r
  let startR = 0n;
  if (!isFirstTrend) {
    const minVal = (6n * n - 1n) / 9n;
    startR = isqrt(minVal);
  }

  let r = startR;
  let k_idx = 1n;

  const n6 = 6n * n;
  const sqrtN = isqrt(num);

  // Interleaved two-way search
  while (true) {
    // Bottom-Up: Check r values (finds factors near sqrt(N))
    if (r <= maxR) {
      let discriminant;
      if (isFirstTrend) {
        discriminant = 9n * r * r + n6 + 1n;
      } else {
        discriminant = 9n * r * r - n6 + 1n;
      }

      // Modular filters eliminate ~94% of non-squares
      if (isSquareMod64(discriminant) &&
          isSquareMod63(discriminant) &&
          isSquareMod65(discriminant)) {

        const m = isqrt(discriminant);
        if (m * m === discriminant) {
          const term3r = 3n * r;
          let f1, f2;
          if (isFirstTrend) {
            f1 = m - term3r;
            f2 = m + term3r;
          } else {
            f1 = term3r - m;
            f2 = term3r + m;
          }
          const d1 = checkFactor(num, f1);
          if (d1) return d1.toString();
          const d2 = checkFactor(num, f2);
          if (d2) return d2.toString();
        }
      }
      r++;
    }

    // Top-Down: Check small factors k (finds small factors quickly)
    const k1 = 6n * k_idx - 1n;
    const k2 = 6n * k_idx + 1n;

    if (k1 > sqrtN) break;

    if (k1 > 1n && num % k1 === 0n) return k1.toString();
    if (k2 > 1n && num % k2 === 0n) return k2.toString();

    k_idx++;
  }

  return num.toString();
}

/**
 * Check if a number is prime using hyperbolic method (no caching)
 * @param {string|number} numInput - Number to check
 * @returns {boolean} True if prime
 */
function isPrimeHyperbolicCore(numInput) {
  const num = BigInt(numInput);
  if (num <= 3n) return num > 1n;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  const div = BigInt(divisionHyperbolic(num));
  return div === num;
}

// ============================================================================
// CACHING INFRASTRUCTURE
// ============================================================================

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
    const primes = primesInFile(filePath);

    for (const p of primes) {
      let trimmed = p.trim();
      // Handle case where first element might be "(0) | 2" - extract just the number
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|');
        if (parts.length > 1) {
          trimmed = parts[1].trim();
        }
      }
      // Skip empty strings and standalone index markers like "(664579)"
      if (trimmed && trimmed !== '' && !trimmed.startsWith('(')) {
        allPrimes.push(BigInt(trimmed));
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
 * Saves primes to output folder in standard format
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

  // Add final count at the end
  data += `\n(${primes.length})`;

  writeDataToFile(folderPath, filename, data);
}

/**
 * Generates primes from a starting point to a limit using hyperbolic method
 * @param {bigint} start - Starting number (exclusive)
 * @param {bigint} limit - Upper limit (inclusive)
 * @returns {bigint[]} - Array of primes in the range
 */
function generatePrimesInRange(start, limit) {
  const primes = [];

  // Handle 2 and 3 explicitly first
  if (start < 2n && 2n <= limit) {
    primes.push(2n);
  }
  if (start < 3n && 3n <= limit) {
    primes.push(3n);
  }

  // Start checking odd numbers from 5
  let current = start < 5n ? 5n : start + 1n;
  if (current % 2n === 0n) current++;

  for (let i = current; i <= limit; i += 2n) {
    if (i % 3n !== 0n && isPrimeHyperbolicCore(i)) {
      primes.push(i);
    }
  }

  return primes;
}

// ============================================================================
// PUBLIC API - OPTIMIZED METHODS WITH CACHING
// ============================================================================

/**
 * **Main 15: Hyperbolic Sieve with Caching**
 *
 * Generates all primes up to a limit using cached data when available.
 *
 * Strategy:
 * 1. Check if exact folder exists → load and return
 * 2. Find largest cache < limit → load and extend from there
 * 3. Find largest cache > limit → load and filter
 * 4. No cache → generate from scratch
 * 5. Always save results for future use
 *
 * @param {string} limitInput - Upper limit for prime generation
 * @returns {bigint[]} - Array of all primes up to limit
 */
export function sieveHyperbolicOptimized(limitInput) {
  const limit = BigInt(limitInput);
  if (limit < 2n) return [];

  // Check if exact folder exists
  const exactFolder = numFolderExist(limit.toString());
  if (exactFolder) {
    return readPrimesFromFolder(exactFolder);
  }

  // Find largest existing cache
  const largestExisting = findLargestExistingLimit();

  let startFrom = 2n;
  let cachedPrimes = [];

  if (largestExisting !== null && largestExisting < limit) {
    // Use existing cache and continue from there
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    cachedPrimes = readPrimesFromFolder(cachedFolder);
    startFrom = largestExisting + 1n;
  } else if (largestExisting !== null && largestExisting >= limit) {
    // Requested limit is smaller - just filter existing
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    const allPrimes = readPrimesFromFolder(cachedFolder);
    const filteredPrimes = allPrimes.filter(p => p <= limit);

    // Save the filtered results
    savePrimesToFolder(limit, filteredPrimes);
    return filteredPrimes;
  }

  // Generate new primes
  const newPrimes = generatePrimesInRange(startFrom - 1n, limit);
  const allPrimes = [...cachedPrimes, ...newPrimes];

  // Save to cache
  savePrimesToFolder(limit, allPrimes);

  return allPrimes;
}

/**
 * **Main 16: Hyperbolic Prime Check with Intelligent Caching**
 *
 * Checks if a single number is prime using cached data when beneficial.
 *
 * Strategy:
 * 1. For small numbers (≤ 10,000), use direct hyperbolic check (very fast)
 * 2. For large numbers:
 *    - If we have cached primes up to sqrt(n), use trial division with cache
 *    - Otherwise, use direct hyperbolic method
 *
 * @param {string} numInput - Number to check
 * @returns {boolean} - True if prime, false otherwise
 */
export function isPrimeHyperbolicOptimized(numInput) {
  const num = BigInt(numInput);

  // Base cases
  if (num <= 1n) return false;
  if (num === 2n || num === 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  // For small numbers, direct check is fastest
  if (num <= 10000n) {
    return isPrimeHyperbolicCore(num);
  }

  // For larger numbers, try to use cached primes
  const sqrtN = isqrt(num);
  const largestExisting = findLargestExistingLimit();

  if (largestExisting !== null && largestExisting >= sqrtN) {
    // We have enough cached primes - use trial division
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestExisting}`;
    const primes = readPrimesFromFolder(cachedFolder);

    for (const p of primes) {
      if (p > sqrtN) break;
      if (num % p === 0n) return false;
    }
    return true;
  }

  // No suitable cache - use hyperbolic method
  return isPrimeHyperbolicCore(num);
}

/**
 * Helper to get cache statistics
 * @returns {Object} Statistics about cached prime data
 */
export function getHyperbolicCacheStats() {
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

// ============================================================================
// PARALLELIZATION - For Large-Scale Prime Generation
// ============================================================================

/**
 * **Parallel Hyperbolic Sieve**
 *
 * Uses Worker threads to parallelize prime generation for large limits.
 * Divides work among multiple CPU cores for better performance.
 *
 * @param {string|number|bigint} limitInput - Upper limit for prime generation
 * @param {number} numWorkers - Number of parallel workers (default: CPU count)
 * @returns {bigint[]} Array of prime numbers up to limit
 */
export async function sieveHyperbolicParallel(limitInput, numWorkers = null) {
  const { Worker } = await import('worker_threads');
  const { cpus } = await import('os');

  const limit = BigInt(limitInput);

  if (numWorkers === null) {
    numWorkers = cpus().length;
  }

  // For small limits, sequential is faster due to overhead
  if (limit < 10000n) {
    return sieveHyperbolicOptimized(limitInput);
  }

  // Check cache first
  const largestLimit = findLargestExistingLimit();
  if (largestLimit !== null && largestLimit >= limit) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestLimit}`;
    const primes = readPrimesFromFolder(cachedFolder);
    return primes.filter(p => p <= limit);
  }

  // Divide range into chunks for parallel processing
  const chunkSize = limit / BigInt(numWorkers);
  const startVal = largestLimit !== null ? largestLimit + 1n : 2n;

  const ranges = [];
  for (let i = 0; i < numWorkers; i++) {
    const chunkStart = startVal + (BigInt(i) * chunkSize);
    const chunkEnd = i < numWorkers - 1
      ? startVal + (BigInt(i + 1) * chunkSize)
      : limit;
    ranges.push({ start: chunkStart, end: chunkEnd });
  }

  // Process chunks in parallel using Worker threads
  const workerPromises = ranges.map(range => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(`
        const { parentPort } = require('worker_threads');
        const { isPrimeHyperbolicCore } = require('${import.meta.url}');

        parentPort.on('message', ({ start, end }) => {
          const primes = [];
          for (let num = BigInt(start); num <= BigInt(end); num++) {
            if (isPrimeHyperbolicCore(num)) {
              primes.push(num.toString());
            }
          }
          parentPort.postMessage(primes);
        });
      `, { eval: true });

      worker.postMessage(range);
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  });

  // Collect results
  const chunkResults = await Promise.all(workerPromises);

  // Combine results
  let allPrimes = [];

  // Add cached primes if any
  if (largestLimit !== null) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestLimit}`;
    const cachedPrimes = readPrimesFromFolder(cachedFolder);
    allPrimes = allPrimes.concat(cachedPrimes);
  } else {
    // Add small primes that might be missed
    allPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
  }

  // Add new primes from parallel processing
  for (const chunk of chunkResults) {
    allPrimes = allPrimes.concat(chunk.map(p => BigInt(p)));
  }

  // Remove duplicates and sort
  allPrimes = [...new Set(allPrimes)].sort((a, b) => (a > b ? 1 : -1));
  allPrimes = allPrimes.filter(p => p <= limit);

  // Save to cache
  savePrimesToFolder(limit, allPrimes);

  return allPrimes;
}

/**
 * **Simpler Parallel Sieve (using Promise.all)**
 *
 * Alternative parallel implementation without Worker threads.
 * Processes chunks concurrently using Promise.all.
 *
 * @param {string|number|bigint} limitInput - Upper limit
 * @param {number} numChunks - Number of chunks (default: 4)
 * @returns {Promise<bigint[]>} Array of primes
 */
export async function sieveHyperbolicParallelSimple(limitInput, numChunks = 4) {
  const limit = BigInt(limitInput);

  if (limit < 10000n) {
    return sieveHyperbolicOptimized(limitInput);
  }

  // Check cache first
  const largestLimit = findLargestExistingLimit();
  if (largestLimit !== null && largestLimit >= limit) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestLimit}`;
    const primes = readPrimesFromFolder(cachedFolder);
    return primes.filter(p => p <= limit);
  }

  // Divide range into chunks
  const chunkSize = limit / BigInt(numChunks);
  const startVal = largestLimit !== null ? largestLimit + 1n : 2n;

  const processChunk = async (start, end) => {
    const primes = [];
    for (let num = start; num <= end; num++) {
      if (isPrimeHyperbolicCore(num)) {
        primes.push(num);
      }
    }
    return primes;
  };

  // Create promises for each chunk
  const promises = [];
  for (let i = 0; i < numChunks; i++) {
    const chunkStart = startVal + (BigInt(i) * chunkSize);
    const chunkEnd = i < numChunks - 1
      ? startVal + (BigInt(i + 1) * chunkSize)
      : limit;
    promises.push(processChunk(chunkStart, chunkEnd));
  }

  // Process all chunks concurrently
  const chunkResults = await Promise.all(promises);

  // Combine results
  let allPrimes = [];

  if (largestLimit !== null) {
    const cachedFolder = `${OUTPUT_ROOT}/output-${largestLimit}`;
    const cachedPrimes = readPrimesFromFolder(cachedFolder);
    allPrimes = allPrimes.concat(cachedPrimes);
  } else {
    allPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n];
  }

  for (const chunk of chunkResults) {
    allPrimes = allPrimes.concat(chunk);
  }

  allPrimes = [...new Set(allPrimes)].sort((a, b) => (a > b ? 1 : -1));
  allPrimes = allPrimes.filter(p => p <= limit);

  savePrimesToFolder(limit, allPrimes);

  return allPrimes;
}

// ============================================================================
// SMART CACHE MANAGEMENT
// ============================================================================

/**
 * **Get Cache Size**
 *
 * Calculate total size of cache in megabytes.
 *
 * @returns {number} Total cache size in MB
 */
export function getCacheSizeMB() {
  if (!fsExistsSync(OUTPUT_ROOT)) {
    return 0;
  }

  function getDirectorySize(dirPath) {
    let size = 0;
    const items = fsReadDirSync(dirPath);

    for (const item of items) {
      const itemPath = `${dirPath}/${item}`;
      const stats = fsStatSync(itemPath);

      if (stats.isDirectory()) {
        size += getDirectorySize(itemPath);
      } else {
        size += stats.size;
      }
    }

    return size;
  }

  const totalSize = getDirectorySize(OUTPUT_ROOT);

  return totalSize / (1024 * 1024); // Convert to MB
}

/**
 * **Manage Cache Size**
 *
 * Remove old cache files if cache exceeds size limit.
 * Implements LRU (Least Recently Used) eviction strategy.
 *
 * @param {number} maxSizeMB - Maximum cache size in megabytes (default: 100)
 * @param {boolean} keepLargest - Keep largest limit folder (default: true)
 * @returns {Object} Cleanup statistics
 */
export function manageCacheSize(maxSizeMB = 100, keepLargest = true) {
  const currentSize = getCacheSizeMB();

  if (currentSize <= maxSizeMB) {
    return {
      action: 'none',
      currentSizeMB: currentSize,
      maxSizeMB: maxSizeMB,
      removedFolders: []
    };
  }

  if (!fsExistsSync(OUTPUT_ROOT)) {
    return {
      action: 'none',
      currentSizeMB: 0,
      maxSizeMB: maxSizeMB,
      removedFolders: []
    };
  }

  // Get all cache folders with their sizes
  const cacheFolders = [];
  const folders = fsReadDirSync(OUTPUT_ROOT);

  for (const folderName of folders) {
    if (!folderName.startsWith('output-')) continue;

    const folderPath = `${OUTPUT_ROOT}/${folderName}`;
    const stats = fsStatSync(folderPath);

    if (!stats.isDirectory()) continue;

    const limit = BigInt(folderName.replace('output-', ''));

    // Calculate folder size
    let folderSize = 0;
    const files = fsReadDirSync(folderPath);
    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      const fileStats = fsStatSync(filePath);
      folderSize += fileStats.size;
    }

    cacheFolders.push({
      name: folderName,
      path: folderPath,
      limit: limit,
      sizeMB: folderSize / (1024 * 1024),
      accessTime: stats.atimeMs
    });
  }

  // Sort folders
  if (keepLargest) {
    cacheFolders.sort((a, b) => (a.limit > b.limit ? 1 : -1)); // Remove smallest first
  } else {
    cacheFolders.sort((a, b) => a.accessTime - b.accessTime); // Remove LRU first
  }

  // Remove folders until under limit
  const removed = [];
  let newSize = currentSize;

  for (const folder of cacheFolders) {
    if (newSize <= maxSizeMB) break;

    // Remove the folder
    fsRmSync(folder.path, { recursive: true, force: true });
    newSize -= folder.sizeMB;

    removed.push({
      name: folder.name,
      limit: folder.limit.toString(),
      sizeMB: folder.sizeMB
    });
  }

  return {
    action: 'cleaned',
    currentSizeMB: newSize,
    maxSizeMB: maxSizeMB,
    removedFolders: removed,
    foldersRemoved: removed.length
  };
}

/**
 * **Compress Cache Files**
 *
 * Compress cache files using gzip to save disk space.
 *
 * @returns {Promise<Object>} Compression statistics
 */
export async function compressCacheFiles() {
  const { gzip } = await import('zlib');
  const { promisify } = await import('util');
  const gzipAsync = promisify(gzip);

  if (!fsExistsSync(OUTPUT_ROOT)) {
    return {
      action: 'none',
      filesCompressed: 0,
      spaceSavedMB: 0
    };
  }

  let compressedCount = 0;
  let totalSaved = 0;

  async function compressDirectory(dirPath) {
    const items = fsReadDirSync(dirPath);

    for (const item of items) {
      const itemPath = `${dirPath}/${item}`;
      const stats = fsStatSync(itemPath);

      if (stats.isDirectory()) {
        await compressDirectory(itemPath);
      } else if (item.endsWith('.txt') && !item.endsWith('.txt.gz')) {
        const originalSize = stats.size;
        const content = fsReadFileSync(itemPath);
        const compressed = await gzipAsync(content);

        fsWriteFileSync(`${itemPath}.gz`, compressed);
        fsUnlinkSync(itemPath);

        const compressedSize = compressed.length;
        compressedCount++;
        totalSaved += (originalSize - compressedSize);
      }
    }
  }

  await compressDirectory(OUTPUT_ROOT);

  return {
    action: 'compressed',
    filesCompressed: compressedCount,
    spaceSavedMB: totalSaved / (1024 * 1024)
  };
}

/**
 * **Clear All Cache**
 *
 * Remove all cached prime data.
 *
 * @returns {Object} Statistics about cleared data
 */
export function clearAllCache() {
  if (!fsExistsSync(OUTPUT_ROOT)) {
    return {
      action: 'none',
      foldersRemoved: 0
    };
  }

  const folders = fsReadDirSync(OUTPUT_ROOT)
    .filter(f => f.startsWith('output-') &&
                 fsStatSync(`${OUTPUT_ROOT}/${f}`).isDirectory());

  for (const folder of folders) {
    fsRmSync(`${OUTPUT_ROOT}/${folder}`, { recursive: true, force: true });
  }

  return {
    action: 'cleared',
    foldersRemoved: folders.length
  };
}
