/**
 * WHEEL-210 FACTORIZATION (JavaScript)
 * Advanced wheel that eliminates multiples of 2, 3, 5, and 7
 * Tests only 23% of candidates (vs 33% for 6k±1)
 */

import { isPrimeOptimized } from "./primeChecker.optimized.mjs";

/**
 * Wheel-210 class: Eliminates multiples of 2, 3, 5, and 7
 */
export class Wheel210 {
  // All residues mod 210 that are coprime to 210
  static SPOKES = [
    1, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79,
    83, 89, 97, 101, 103, 107, 109, 113, 121, 127, 131, 137, 139, 143, 149,
    151, 157, 163, 167, 169, 173, 179, 181, 187, 191, 193, 197, 199, 209,
  ];

  static INCREMENTS = [];

  // Compute increments on class load
  static {
    for (let i = 0; i < this.SPOKES.length; i++) {
      const nextI = (i + 1) % this.SPOKES.length;
      let gap;

      if (nextI === 0) {
        gap = 210 - this.SPOKES[this.SPOKES.length - 1] + this.SPOKES[0];
      } else {
        gap = this.SPOKES[nextI] - this.SPOKES[i];
      }

      this.INCREMENTS.push(gap);
    }
  }

  /**
   * Generate all Wheel-210 candidates in range [start, end]
   */
  static *generateCandidates(start, end) {
    const numStart = Number(start);
    const numEnd = Number(end);

    // Yield small primes
    const smallPrimes = [2, 3, 5, 7, 11];
    for (const p of smallPrimes) {
      if (numStart <= p && p <= numEnd) {
        yield p.toString();
      }
    }

    if (numEnd < 13) return;

    // Find starting position
    let base;
    let pos;

    if (numStart < 13) {
      base = 0;
      pos = 0;
    } else {
      base = Math.floor(numStart / 210) * 210;
      pos = 0;
      while (base + this.SPOKES[pos] < numStart) {
        pos = (pos + 1) % this.SPOKES.length;
      }
    }

    // Generate candidates
    while (true) {
      const current = base + this.SPOKES[pos];

      if (current > numEnd) break;

      if (current >= numStart) {
        yield current.toString();
      }

      pos = (pos + 1) % this.SPOKES.length;
      if (pos === 0) {
        base += 210;
      }
    }
  }

  /**
   * Get the next Wheel-210 candidate after current
   */
  static nextCandidate(current) {
    const num = Number(current);

    // Handle small primes
    const smallPrimes = [2, 3, 5, 7, 11, 13];
    for (let i = 0; i < smallPrimes.length - 1; i++) {
      if (num < smallPrimes[i]) {
        return smallPrimes[i].toString();
      }
    }
    if (num < 13) return "13";

    // Find position in wheel
    const base = Math.floor(num / 210) * 210;
    const offset = num % 210;

    // Find next spoke in current rotation
    for (const spoke of this.SPOKES) {
      if (offset < spoke) {
        return (base + spoke).toString();
      }
    }

    // Move to next wheel rotation
    return (base + 210 + this.SPOKES[0]).toString();
  }
}

/**
 * Sieve of Eratosthenes using Wheel-210
 * Only tracks 23% of candidates for maximum memory efficiency
 */
export function sieveWheel210(limit) {
  const numLimit = Number(limit);

  if (numLimit < 2) return [];

  const primes = ["2", "3", "5", "7"];
  if (numLimit < 11) {
    return primes.filter((p) => Number(p) <= numLimit);
  }

  if (numLimit >= 11) primes.push("11");

  // Create sieve for Wheel-210 candidates only
  const candidates = new Map();

  for (const candidate of Wheel210.generateCandidates("13", limit)) {
    candidates.set(candidate, true);
  }

  // Mark multiples of 11 (11 is not in candidates since we start from 13)
  if (numLimit >= 11) {
    let multiple = 11 * 11;  // Start from 11²
    while (multiple <= numLimit) {
      const multipleStr = multiple.toString();
      if (candidates.has(multipleStr)) {
        candidates.set(multipleStr, false);
      }
      multiple += 11;
    }
  }

  // Sieving phase
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
 * Check if n is prime using Wheel-210 + trial division
 */
export function isPrimeWheel210(n) {
  const num = Number(n);

  if (num < 2) return false;
  if ([2, 3, 5, 7, 11].includes(num)) return true;
  if (num % 2 === 0 || num % 3 === 0 || num % 5 === 0 || num % 7 === 0) {
    return false;
  }

  // Check if n is in Wheel-210 form
  const remainder = num % 210;
  if (!Wheel210.SPOKES.includes(remainder)) {
    return false;
  }

  // Trial division using Wheel-210 candidates
  const limit = Math.floor(Math.sqrt(num));

  // Check small primes first
  const smallPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
  for (const p of smallPrimes) {
    if (p > limit) return true;
    if (num % p === 0) return num === p;
  }

  // Check Wheel-210 candidates
  for (const candidate of Wheel210.generateCandidates("37", limit.toString())) {
    const numCandidate = Number(candidate);
    if (num % numCandidate === 0) {
      return num === numCandidate;
    }
  }

  return true;
}

/**
 * Find all primes in range [start, end] using Wheel-210
 */
export function primesInRangeWheel210(start, end) {
  const primes = [];

  for (const candidate of Wheel210.generateCandidates(start, end)) {
    if (isPrimeOptimized(candidate)) {
      primes.push(candidate);
    }
  }

  return primes;
}

/**
 * Benchmark wheels: 6k±1, Wheel-30, Wheel-210
 */
export async function benchmarkWheels(limit = "100000") {
  const numLimit = Number(limit);
  const results = {};

  // Count Wheel-6 candidates (6k±1 pattern)
  let countW6 = 2; // 2 and 3
  let k = 1;
  while (6 * k - 1 <= numLimit) {
    if (6 * k - 1 >= 5) countW6++;
    if (6 * k + 1 <= numLimit) countW6++;
    k++;
  }

  results.wheel6 = {
    candidates: countW6,
    percentage: (countW6 / numLimit) * 100,
  };

  // Count Wheel-30 candidates
  const { Wheel30 } = await import("./primeHybrid.optimized.mjs");
  let countW30 = 0;
  for (const _ of Wheel30.generateCandidates("2", limit)) {
    countW30++;
  }

  results.wheel30 = {
    candidates: countW30,
    percentage: (countW30 / numLimit) * 100,
  };

  // Count Wheel-210 candidates
  let countW210 = 0;
  for (const _ of Wheel210.generateCandidates("2", limit)) {
    countW210++;
  }

  results.wheel210 = {
    candidates: countW210,
    percentage: (countW210 / numLimit) * 100,
  };

  // Calculate improvements
  results.improvements = {
    w6_to_w30: ((1 - countW30 / countW6) * 100).toFixed(1),
    w30_to_w210: ((1 - countW210 / countW30) * 100).toFixed(1),
    w6_to_w210: ((1 - countW210 / countW6) * 100).toFixed(1),
  };

  return results;
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

export function demonstrateWheel210() {
  console.log("=".repeat(60));
  console.log("WHEEL-210 DEMONSTRATION (JavaScript)");
  console.log("=".repeat(60));

  // Test 1: Generate candidates
  console.log("\n1. Generating Wheel-210 candidates in [100, 150]:");
  const candidates = Array.from(Wheel210.generateCandidates("100", "150"));
  console.log(`   Candidates: ${candidates.join(", ")}`);
  console.log(`   Count: ${candidates.length} (vs 51 if testing all)`);

  // Test 2: Next candidate function
  console.log("\n2. Testing next_candidate function:");
  let current = "100";
  for (let i = 0; i < 10; i++) {
    const next = Wheel210.nextCandidate(current);
    console.log(`   After ${current}: ${next}`);
    current = next;
  }

  // Test 3: Prime checking
  console.log("\n3. Testing primality with Wheel-210:");
  const testNumbers = ["97", "98", "99", "100", "101", "102", "103"];
  for (const num of testNumbers) {
    const result = isPrimeWheel210(num);
    console.log(`   ${num}: ${result ? "PRIME" : "composite"}`);
  }

  // Test 4: Primes in range
  console.log("\n4. Finding primes in [1000, 1100] with Wheel-210:");
  const primes = primesInRangeWheel210("1000", "1100");
  console.log(`   Found ${primes.length} primes`);
  console.log(`   Primes: ${primes.join(", ")}`);

  // Test 5: Sieve comparison
  console.log("\n5. Sieve with Wheel-210 up to 10,000:");
  const primesFromSieve = sieveWheel210("10000");
  console.log(`   Found ${primesFromSieve.length} primes`);
  console.log(`   First 20: ${primesFromSieve.slice(0, 20).join(", ")}`);
  console.log(`   Last 10: ${primesFromSieve.slice(-10).join(", ")}`);

  // Test 6: Candidate comparison
  console.log("\n6. Comparing candidate generation:");
  const limit = 10000;

  // 6k±1
  let count6k = 2;
  let k = 1;
  while (6 * k - 1 <= limit) {
    if (6 * k - 1 >= 5) count6k++;
    if (6 * k + 1 <= limit) count6k++;
    k++;
  }

  // Wheel-210
  const candidates210 = Array.from(
    Wheel210.generateCandidates("2", limit.toString())
  );

  console.log(`   Up to ${limit}:`);
  console.log(
    `   Wheel-6 (6k±1):  ${count6k.toLocaleString()} candidates (${(
      (count6k / limit) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   Wheel-210:       ${candidates210.length.toLocaleString()} candidates (${(
      (candidates210.length / limit) *
      100
    ).toFixed(1)}%)`
  );
  console.log(
    `   Reduction:       ${(
      (1 - candidates210.length / count6k) *
      100
    ).toFixed(1)}% fewer candidates`
  );

  console.log("\n" + "=".repeat(60));
  console.log("DEMONSTRATION COMPLETE");
  console.log("=".repeat(60));
}

// Run demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demonstrateWheel210();
}
