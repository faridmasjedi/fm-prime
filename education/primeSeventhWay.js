// Sieve of Eratosthenes optimized with 6n±1 pattern
// This is much faster than trial division for finding all primes up to a limit

/**
 * Sieve of Eratosthenes with 6n±1 optimization
 * Only stores numbers of form 6n-1 and 6n+1, since all primes > 3 follow this pattern
 *
 * How it works:
 * 1. Create a boolean array for only 6n±1 candidates (saves 66% memory)
 * 2. For each unmarked number, mark all its multiples as composite
 * 3. Return all unmarked numbers (which are primes)
 *
 * Time complexity: O(n log log n)
 * Space complexity: O(n/3) - much better than naive O(n)
 *
 * @param {number} limit - Find all primes up to this number
 * @returns {Array<number>} - Array of all primes up to limit
 */
const sievePrimes = (limit) => {
  if (limit < 2) return [];
  if (limit === 2) return [2];
  if (limit < 5) return [2, 3];

  const primes = [2, 3];

  // Calculate how many 6n±1 numbers exist up to limit
  const sieveSize = Math.floor(limit / 6) * 2 + 2;

  // Boolean array: true = composite, false = prime
  // Index i represents:
  //   - even i: 6*(i/2+1) - 1  (e.g., i=0 -> 5, i=2 -> 11, i=4 -> 17)
  //   - odd i:  6*((i+1)/2) + 1 (e.g., i=1 -> 7, i=3 -> 13, i=5 -> 19)
  const isComposite = new Array(sieveSize).fill(false);

  // Helper function: convert index to actual number
  const indexToNumber = (i) => {
    return (i % 2 === 0) ? 6 * (i / 2 + 1) - 1 : 6 * ((i + 1) / 2) + 1;
  };

  // Helper function: convert number to index (inverse of above)
  const numberToIndex = (num) => {
    if (num % 6 === 5) return (num + 1) / 3 - 2; // 6n-1
    if (num % 6 === 1) return (num - 1) / 3 - 1; // 6n+1
    return -1;
  };

  // Sieve: mark all composites
  const sqrtLimit = Math.sqrt(limit);
  for (let i = 0; i < sieveSize; i++) {
    if (isComposite[i]) continue;

    const prime = indexToNumber(i);
    if (prime > sqrtLimit) break;

    // Mark all multiples of this prime
    // Start from prime² (smaller multiples already marked)
    for (let multiple = prime * prime; multiple <= limit; multiple += prime) {
      if (multiple % 6 === 1 || multiple % 6 === 5) {
        const idx = numberToIndex(multiple);
        if (idx >= 0 && idx < sieveSize) {
          isComposite[idx] = true;
        }
      }
    }
  }

  // Collect all primes (unmarked numbers)
  for (let i = 0; i < sieveSize; i++) {
    if (!isComposite[i]) {
      const num = indexToNumber(i);
      if (num <= limit) {
        primes.push(num);
      }
    }
  }

  return primes;
};

/**
 * Alternative simpler implementation with clearer indexing
 * Slightly more memory but easier to understand
 */
const sievePrimesSimple = (limit) => {
  if (limit < 2) return [];
  if (limit === 2) return [2];
  if (limit < 5) return [2, 3];

  const primes = [2, 3];

  // Store all 6n±1 candidates as actual numbers
  const candidates = [];
  const candidateSet = new Set();

  for (let n = 1; 6 * n - 1 <= limit; n++) {
    const num1 = 6 * n - 1;
    const num2 = 6 * n + 1;
    if (num1 <= limit) {
      candidates.push(num1);
      candidateSet.add(num1);
    }
    if (num2 <= limit) {
      candidates.push(num2);
      candidateSet.add(num2);
    }
  }

  // Sieve: remove composites
  const sqrtLimit = Math.sqrt(limit);
  for (const prime of candidates) {
    if (!candidateSet.has(prime)) continue;
    if (prime > sqrtLimit) break;

    // Mark multiples as composite
    for (let multiple = prime * prime; multiple <= limit; multiple += prime) {
      candidateSet.delete(multiple);
    }
  }

  // Convert set back to sorted array
  return primes.concat(Array.from(candidateSet).sort((a, b) => a - b));
};

/**
 * Count primes up to limit (faster than generating all)
 */
const sievePrimesCount = (limit) => {
  return sievePrimes(limit).length;
};

/**
 * Get primes as comma-separated string (to match your existing API)
 */
const sievePrimesString = (limit) => {
  return sievePrimes(limit).join(", ");
};

/**
 * Check if a single number is prime using the sieve
 * Note: For single checks, trial division (ifPrime) is faster
 * This is only efficient when checking many numbers
 */
const isPrimeBySieve = (num) => {
  if (num < 2) return false;
  if (num === 2 || num === 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  if (num % 6 !== 1 && num % 6 !== 5) return false;

  const primes = sievePrimes(num);
  return primes[primes.length - 1] === num;
};

/**
 * Get primes in a range [firstNum, lastNum]
 */
const sievePrimesInRange = (firstNum, lastNum) => {
  const allPrimes = sievePrimes(lastNum);
  return allPrimes.filter(p => p >= firstNum);
};

/**
 * Primes in range as string
 */
const sievePrimesInRangeString = (firstNum, lastNum) => {
  return sievePrimesInRange(firstNum, lastNum).join(", ");
};

/**
 * Count primes in range
 */
const sievePrimesInRangeCount = (firstNum, lastNum) => {
  return sievePrimesInRange(firstNum, lastNum).length;
};

// Performance comparison helper
const comparePerformance = (limit) => {
  console.log(`\n=== Performance Comparison for primes up to ${limit} ===\n`);

  // Sieve method
  const sieveStart = Date.now();
  const sieveResult = sievePrimes(limit);
  const sieveTime = Date.now() - sieveStart;
  console.log(`Sieve of Eratosthenes: ${sieveTime}ms (found ${sieveResult.length} primes)`);

  // Your first way (trial division)
  const { primes, primesCount } = require("./primeFirstWay");

  const trialStart = Date.now();
  const trialResult = primes(limit);
  const trialTime = Date.now() - trialStart;
  console.log(`Trial Division (First Way): ${trialTime}ms`);

  console.log(`\nSpeedup: ${(trialTime / sieveTime).toFixed(2)}x faster\n`);
};

// Example usage
if (require.main === module) {
  console.log("Sieve of Eratosthenes with 6n±1 optimization\n");

  // Small example
  console.log("Primes up to 100:");
  console.log(sievePrimesString(100));
  console.log(`\nCount: ${sievePrimesCount(100)}`);

  // Range example
  console.log("\n\nPrimes between 50 and 100:");
  console.log(sievePrimesInRangeString(50, 100));

  // Performance test
  comparePerformance(100000);

  // Larger test
  console.log("\n\nTesting with 1 million:");
  const start = Date.now();
  const count = sievePrimesCount(1000000);
  const time = Date.now() - start;
  console.log(`Found ${count} primes in ${time}ms`);
}

module.exports = {
  sievePrimes,
  sievePrimesSimple,
  sievePrimesCount,
  sievePrimesString,
  isPrimeBySieve,
  sievePrimesInRange,
  sievePrimesInRangeString,
  sievePrimesInRangeCount,
  comparePerformance,
};
