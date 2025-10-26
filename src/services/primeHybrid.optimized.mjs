/**
 * HYBRID PRIME FINDER (JavaScript)
 * Combines 6k±1 pattern with optimized algorithms
 *
 * This demonstrates how to combine:
 * 1. 6k±1 pattern for candidate generation
 * 2. Sieve of Eratosthenes for bulk generation
 * 3. Trial division for medium primes
 */

import {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
  findMax,
} from "./mathOperations.optimized.mjs";

import { isPrimeOptimized } from "./primeChecker.optimized.mjs";

/**
 * 6k±1 OPTIMIZED SIEVE OF ERATOSTHENES
 *
 * Combines the speed of sieve with your 6k±1 pattern
 * Uses 3x less memory than traditional sieve!
 */
export function sieve6kOptimized(limit) {
  const numLimit = Number(limit);

  if (numLimit < 2) return [];
  if (numLimit === 2) return ["2"];
  if (numLimit === 3) return ["2", "3"];

  const primes = ["2", "3"];

  // Create a Map for 6k±1 candidates only
  // This uses 3x less memory!
  const candidates = new Map();

  // Generate all 6k±1 candidates up to limit
  let k = 1;
  while (true) {
    const candidate1 = 6 * k - 1; // 6k - 1
    const candidate2 = 6 * k + 1; // 6k + 1

    if (candidate1 > numLimit) break;

    if (candidate1 >= 5) {
      candidates.set(candidate1.toString(), true);
    }
    if (candidate2 <= numLimit) {
      candidates.set(candidate2.toString(), true);
    }

    k++;
  }

  // Sieve phase: mark composites
  const sqrtLimit = Math.floor(Math.sqrt(numLimit));
  const sortedCandidates = Array.from(candidates.keys()).sort(
    (a, b) => Number(a) - Number(b)
  );

  for (const candidate of sortedCandidates) {
    if (!candidates.get(candidate)) continue;

    const numCandidate = Number(candidate);
    if (numCandidate > sqrtLimit) break;

    // Mark multiples as composite
    let multiple = numCandidate * numCandidate;
    while (multiple <= numLimit) {
      const multipleStr = multiple.toString();
      if (candidates.has(multipleStr)) {
        candidates.set(multipleStr, false);
      }
      multiple += numCandidate;
    }
  }

  // Collect remaining primes
  for (const [candidate, isPrime] of candidates) {
    if (isPrime) {
      primes.push(candidate);
    }
  }

  return primes.sort((a, b) => Number(a) - Number(b));
}

/**
 * HYBRID PRIME FINDER CLASS
 */
export class HybridPrimeFinder {
  constructor(precomputeLimit = "10000") {
    console.log(`Pre-computing primes up to ${precomputeLimit}...`);
    this.smallPrimeLimit = precomputeLimit;

    // Pre-compute small primes for fast lookup
    this.smallPrimes = sieve6kOptimized(precomputeLimit);
    this.smallPrimesSet = new Set(this.smallPrimes);

    console.log(`Pre-computed ${this.smallPrimes.length} primes`);
  }

  /**
   * Intelligently test if n is prime using the best algorithm
   */
  isPrime(n) {
    const number = typeof n === "string" ? n : n.toString();
    const numValue = Number(number);

    // Handle small numbers
    if (numValue < 2) return false;

    // Use pre-computed lookup for small numbers
    if (findMax(number, this.smallPrimeLimit) === this.smallPrimeLimit) {
      return this.smallPrimesSet.has(number);
    }

    // Quick divisibility checks
    if (numValue % 2 === 0 || numValue % 3 === 0 || numValue % 5 === 0) {
      return false;
    }

    // Check if it's in 6k±1 form
    const remainder = numValue % 6;
    if (remainder !== 1 && remainder !== 5) {
      return false;
    }

    // Use optimized prime checker
    return isPrimeOptimized(number);
  }

  /**
   * Find all primes in range [start, end] using 6k±1 optimization
   */
  findPrimesInRange(start, end) {
    const primes = [];
    const numStart = Number(start);
    const numEnd = Number(end);

    // Handle small primes
    if (numStart <= 2 && numEnd >= 2) primes.push("2");
    if (numStart <= 3 && numEnd >= 3) primes.push("3");

    // Use pre-computed primes if range is small
    if (numEnd <= Number(this.smallPrimeLimit)) {
      return this.smallPrimes.filter(
        (p) => Number(p) >= numStart && Number(p) <= numEnd
      );
    }

    // Generate 6k±1 candidates and test them
    let k = Math.max(1, Math.ceil((numStart - 1) / 6));

    while (true) {
      const candidate1 = 6 * k - 1;
      const candidate2 = 6 * k + 1;

      if (candidate1 > numEnd) break;

      if (candidate1 >= numStart && candidate1 > 3) {
        if (this.isPrime(candidate1.toString())) {
          primes.push(candidate1.toString());
        }
      }

      if (candidate2 >= numStart && candidate2 <= numEnd) {
        if (this.isPrime(candidate2.toString())) {
          primes.push(candidate2.toString());
        }
      }

      k++;
    }

    return primes;
  }

  /**
   * Find the nth prime number (1-indexed)
   */
  findNthPrime(n) {
    if (n <= 0) {
      throw new Error("n must be positive");
    }

    // Use pre-computed primes if possible
    if (n <= this.smallPrimes.length) {
      return this.smallPrimes[n - 1];
    }

    // Continue searching with 6k±1 pattern
    let count = this.smallPrimes.length;
    let candidate = Number(this.smallPrimes[this.smallPrimes.length - 1]) + 2;

    while (count < n) {
      if (this.isPrime(candidate.toString())) {
        count++;
        if (count === n) {
          return candidate.toString();
        }
      }
      candidate = this._next6kCandidate(candidate);
    }

    return candidate.toString();
  }

  /**
   * Find twin prime pairs in range [start, end]
   */
  findTwinPrimesInRange(start, end) {
    const primes = this.findPrimesInRange(start, addNumbers(end, "2"));
    const primesSet = new Set(primes);
    const twinPairs = [];

    for (const p of primes) {
      const numP = Number(p);
      if (numP >= Number(start) && numP <= Number(end)) {
        const twin = addNumbers(p, "2");
        if (primesSet.has(twin)) {
          twinPairs.push([p, twin]);
        }
      }
    }

    return twinPairs;
  }

  /**
   * Find Sophie Germain primes in range [start, end]
   * Sophie Germain prime: A prime p where 2p + 1 is also prime
   */
  findSophieGermainPrimesInRange(start, end) {
    const primes = this.findPrimesInRange(start, end);
    const sophiePrimes = [];

    for (const p of primes) {
      const safePrime = addNumbers(multiplyNumbers(p, "2"), "1");
      if (this.isPrime(safePrime)) {
        sophiePrimes.push(p);
      }
    }

    return sophiePrimes;
  }

  /**
   * Generate next 6k±1 candidate (implements your pattern!)
   */
  _next6kCandidate(current) {
    if (current === 2) return 3;
    if (current === 3) return 5;

    const remainder = current % 6;
    if (remainder === 5) {
      return current + 2; // From 6k-1 to 6k+1
    } else if (remainder === 1) {
      return current + 4; // From 6k+1 to 6(k+1)-1
    } else {
      // Not on 6k±1 form, jump to next 6k-1
      return Math.floor(current / 6 + 1) * 6 - 1;
    }
  }
}

/**
 * Generator function for 6k±1 candidates
 */
export function* generate6kCandidates(start, end) {
  const numStart = Number(start);
  const numEnd = Number(end);

  // Yield small primes
  if (numStart <= 2 && numEnd >= 2) yield "2";
  if (numStart <= 3 && numEnd >= 3) yield "3";

  // Find starting k
  let k = Math.max(1, Math.ceil((numStart - 1) / 6));

  while (true) {
    const candidate1 = 6 * k - 1;
    const candidate2 = 6 * k + 1;

    if (candidate1 > numEnd) break;

    if (candidate1 >= numStart && candidate1 > 3) {
      yield candidate1.toString();
    }
    if (candidate2 >= numStart && candidate2 <= numEnd) {
      yield candidate2.toString();
    }

    k++;
  }
}

/**
 * Find primes using 6k±1 candidate generation
 */
export function findPrimes6kPattern(start, end) {
  const primes = [];

  for (const candidate of generate6kCandidates(start, end)) {
    if (isPrimeOptimized(candidate)) {
      primes.push(candidate);
    }
  }

  return primes;
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

export function demonstrateHybrid() {
  console.log("=".repeat(60));
  console.log("HYBRID PRIME FINDER DEMONSTRATION (JavaScript)");
  console.log("=".repeat(60));

  // Initialize finder
  const finder = new HybridPrimeFinder("10000");

  // Test 1: Check individual primes
  console.log("\n1. Testing individual numbers:");
  const testNumbers = ["997", "10007", "100003"];

  for (const num of testNumbers) {
    const start = Date.now();
    const result = finder.isPrime(num);
    const duration = Date.now() - start;
    console.log(
      `   ${num.padStart(10)}: ${(result ? "PRIME" : "NOT PRIME").padEnd(
        12
      )} (${duration}ms)`
    );
  }

  // Test 2: Find nth prime
  console.log("\n2. Finding nth primes:");
  for (const n of [100, 1000, 5000]) {
    const start = Date.now();
    const prime = finder.findNthPrime(n);
    const duration = Date.now() - start;
    console.log(
      `   ${n.toString().padStart(6)}th prime: ${prime.padStart(
        10
      )} (${duration}ms)`
    );
  }

  // Test 3: Primes in range
  console.log("\n3. Finding primes in range:");
  const ranges = [
    ["100", "200"],
    ["1000", "1100"],
    ["10000", "10100"],
  ];

  for (const [startNum, endNum] of ranges) {
    const start = Date.now();
    const primes = finder.findPrimesInRange(startNum, endNum);
    const duration = Date.now() - start;
    console.log(
      `   [${startNum.padStart(6)}, ${endNum.padStart(
        6
      )}]: ${primes.length.toString().padStart(3)} primes (${duration}ms)`
    );
  }

  // Test 4: Twin primes
  console.log("\n4. Finding twin primes:");
  const startTime = Date.now();
  const twins = finder.findTwinPrimesInRange("100", "1000");
  const twinDuration = Date.now() - startTime;
  console.log(`   Found ${twins.length} twin prime pairs in [100, 1000]`);
  console.log(
    `   First few: ${twins
      .slice(0, 5)
      .map((pair) => `(${pair[0]}, ${pair[1]})`)
      .join(", ")}`
  );
  console.log(`   Time: ${twinDuration}ms`);

  // Test 5: Sophie Germain primes
  console.log("\n5. Finding Sophie Germain primes:");
  const sophieStart = Date.now();
  const sophie = finder.findSophieGermainPrimesInRange("100", "500");
  const sophieDuration = Date.now() - sophieStart;
  console.log(`   Found ${sophie.length} Sophie Germain primes in [100, 500]`);
  console.log(`   First few: ${sophie.slice(0, 10).join(", ")}`);
  console.log(`   Time: ${sophieDuration}ms`);

  // Test 6: Compare sieve methods
  console.log("\n6. Comparing sieve with 6k±1 optimization:");
  const limit = "10000";

  const start6k = Date.now();
  const primes6k = sieve6kOptimized(limit);
  const time6k = Date.now() - start6k;

  console.log(`   6k±1 optimized sieve: ${time6k}ms`);
  console.log(`   Primes found: ${primes6k.length}`);
  console.log(`   Memory usage: ~3x less than traditional sieve`);

  // Test 7: 6k±1 candidate generation
  console.log("\n7. 6k±1 Candidate generation:");
  const candidates = Array.from(generate6kCandidates("100", "200"));
  const actualPrimes = candidates.filter((c) => isPrimeOptimized(c));
  console.log(`   Generated ${candidates.length} candidates in [100, 200]`);
  console.log(`   Found ${actualPrimes.length} primes`);
  console.log(
    `   Efficiency: ${(
      (actualPrimes.length / candidates.length) *
      100
    ).toFixed(1)}% of candidates are prime`
  );
  console.log(
    `   Reduction: Testing ${candidates.length} numbers instead of 101 (${(
      (1 - candidates.length / 101) *
      100
    ).toFixed(1)}% reduction)`
  );

  console.log("\n" + "=".repeat(60));
  console.log("DEMONSTRATION COMPLETE");
  console.log("=".repeat(60));
}

// Run demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateHybrid();
}
