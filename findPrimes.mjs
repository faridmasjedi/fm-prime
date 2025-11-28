#!/usr/bin/env node

import readline from 'readline';
import { sieveWheel210 } from './src/services/wheel210.optimized.mjs';
import { HybridPrimeFinder, sieve6kOptimized } from './src/services/primeHybrid.optimized.mjs';
import { isPrimeOptimized } from './src/services/primeChecker.optimized.mjs';
import { sieveHyperbolicOptimized } from './src/services/primeHyperbolic.optimized.mjs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Wheel-30 Sieve (eliminates multiples of 2, 3, 5)
function sieveWheel30(limit) {
  const n = BigInt(limit);
  if (n < 2n) return [];

  const primes = [];
  if (n >= 2n) primes.push(2n);
  if (n >= 3n) primes.push(3n);
  if (n >= 5n) primes.push(5n);

  // Wheel-30 pattern: numbers coprime to 30 (not divisible by 2, 3, or 5)
  // Pattern within each 30-number segment: 1, 7, 11, 13, 17, 19, 23, 29
  const wheel30Pattern = [1n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
  const sqrtN = BigInt(Math.floor(Math.sqrt(Number(n))));

  for (let base = 0n; base * 30n <= n; base++) {
    for (const offset of wheel30Pattern) {
      const candidate = base * 30n + offset;
      if (candidate <= 5n) continue;
      if (candidate > n) break;

      let isPrime = true;
      for (const p of primes) {
        if (p > sqrtN) break;
        if (candidate % p === 0n) {
          isPrime = false;
          break;
        }
      }
      if (isPrime) primes.push(candidate);
    }
  }

  return primes;
}

// Trial division with 6k±1 pattern (iterate through all candidates)
function sieveTrialDivision(limit) {
  const n = BigInt(limit);
  if (n < 2n) return [];

  const primes = [];
  if (n >= 2n) primes.push(2n);
  if (n >= 3n) primes.push(3n);

  for (let candidate = 5n; candidate <= n; candidate += 2n) {
    if (isPrimeOptimized(candidate.toString())) {
      primes.push(candidate);
    }
  }

  return primes;
}

// Method implementations
const methods = {
  '1': {
    name: '6k±1 Pattern Sieve',
    description: 'Tests only 33% of candidates - Good balance',
    category: 'Optimized Sieves',
    run: (limit) => sieve6kOptimized(limit.toString())
  },
  '2': {
    name: 'Wheel-30 Sieve',
    description: 'Tests only 27% of candidates (eliminates 2, 3, 5)',
    category: 'Optimized Sieves',
    run: (limit) => sieveWheel30(limit)
  },
  '3': {
    name: 'Wheel-210 Sieve ⭐',
    description: 'Tests only 23% of candidates (eliminates 2, 3, 5, 7) - FASTEST',
    category: 'Optimized Sieves',
    run: (limit) => sieveWheel210(limit.toString())
  },
  '4': {
    name: 'Hybrid Sieve',
    description: 'Combines precomputed primes with 6k±1 pattern',
    category: 'Optimized Sieves',
    run: (limit) => {
      const hybrid = new HybridPrimeFinder("10000");
      const primes = [];
      for (let i = 2n; i <= BigInt(limit); i++) {
        if (hybrid.isPrime(i.toString())) {
          primes.push(i);
        }
      }
      return primes;
    }
  },
  '5': {
    name: 'Trial Division (6k±1) - Check each number',
    description: 'Tests each candidate individually - Slower but simple',
    category: 'Trial Division Methods',
    run: (limit) => sieveTrialDivision(limit)
  },
  '6': {
    name: 'Hyperbolic Sieve with Caching ⭐',
    description: 'O(√N) two-way search + file caching - VERY FAST for repeated use',
    category: 'Optimized Sieves',
    run: (limit) => sieveHyperbolicOptimized(limit.toString())
  }
};

function displayMenu() {
  console.log('\n' + '='.repeat(70));
  console.log('PRIME NUMBER FINDER - Choose Your Method');
  console.log('='.repeat(70));

  // Group methods by category
  const categories = {};
  for (const [key, method] of Object.entries(methods)) {
    const cat = method.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push({ key, method });
  }

  // Display by category
  for (const [category, items] of Object.entries(categories)) {
    console.log(`\n${category}:`);
    for (const { key, method } of items) {
      console.log(`  [${key}] ${method.name}`);
      console.log(`      ${method.description}`);
    }
  }

  console.log('\n' + '='.repeat(70));
}

async function main() {
  try {
    displayMenu();

    const methodChoice = await question('\nEnter method number (1-6): ');

    if (!methods[methodChoice]) {
      console.log('Invalid method choice!');
      rl.close();
      return;
    }

    const limitInput = await question('Enter the upper limit (e.g., 10000000): ');
    const limit = BigInt(limitInput);

    if (limit < 2n) {
      console.log('Limit must be at least 2');
      rl.close();
      return;
    }

    const selectedMethod = methods[methodChoice];
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Using: ${selectedMethod.name}`);
    console.log(`Finding all primes less than: ${limit.toLocaleString()}`);
    console.log(`${'='.repeat(70)}\n`);

    const startTime = performance.now();
    const primes = selectedMethod.run(limit);
    const endTime = performance.now();

    const timeElapsed = ((endTime - startTime) / 1000).toFixed(3);

    console.log(`\n${'='.repeat(70)}`);
    console.log(`RESULTS`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Total primes found: ${primes.length.toLocaleString()}`);
    console.log(`Time elapsed: ${timeElapsed} seconds`);
    console.log(`${'='.repeat(70)}\n`);

    const showPrimes = await question('Show all primes? (y/n): ');
    if (showPrimes.toLowerCase() === 'y') {
      console.log('\nPrimes:', primes.map(p => p.toString()).join(', '));
    }

    const verify = await question('\nVerify with known count? (y/n): ');
    if (verify.toLowerCase() === 'y') {
      // Known prime counts for verification
      const knownCounts = {
        100: 25,
        1000: 168,
        10000: 1229,
        100000: 9592,
        1000000: 78498,
        10000000: 664579
      };

      const limitNum = Number(limit);
      if (knownCounts[limitNum]) {
        const expected = knownCounts[limitNum];
        const matches = primes.length === expected;
        console.log(`\nExpected count for ${limitNum.toLocaleString()}: ${expected}`);
        console.log(`Actual count: ${primes.length}`);
        console.log(`Verification: ${matches ? '✓ PASSED' : '✗ FAILED'}`);
      } else {
        console.log(`\nNo known count available for ${limitNum.toLocaleString()}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
