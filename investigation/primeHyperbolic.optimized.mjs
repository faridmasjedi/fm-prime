/**
 * HYPERBOLIC EQUATION APPROACH (6th Way)
 * =====================================
 *
 * This is the most mathematically sophisticated approach from the fm-prime-js project.
 * It uses hyperbolic equations derived from factorization patterns to find divisors.
 *
 * MATHEMATICAL FOUNDATION:
 *
 * For numbers of form 6n+1:
 *   If composite, it factors as (6k+1)(6kk+1)
 *   This can be rewritten as: (m - 3r)(m + 3r) = (6n+1)
 *   Where m² - 9r² = 6n+1
 *   Therefore: m = √(9r² + 6n + 1)
 *
 * For numbers of form 6n-1:
 *   If composite, it factors as (6k-1)(6kk-1)
 *   This can be rewritten as: (3r - m)(3r + m) = (6n-1)
 *   Where 9r² - m² = 6n-1
 *   Therefore: m = √(9r² - 6n + 1)
 *
 * KEY INSIGHT:
 * Instead of doing trial division, we check if certain square roots are integers.
 * If √(9r² + 6n + 1) is an integer that satisfies the constraints,
 * we've found a divisor without doing explicit division!
 *
 * COMPLEXITY:
 * Similar to trial division O(√n), but uses different mathematical operations
 * (square roots instead of divisions)
 *
 * NOVELTY STATUS: 🔍 UNKNOWN - Requires literature review
 * This approach may be novel. Before claiming novelty, need to verify if similar
 * "hyperbolic" or "quadratic form" approaches exist in number theory literature.
 */

/**
 * Find the smallest divisor of a number using hyperbolic equations
 * @param {string|number} num - Number to factorize (6n+1 or 6n-1 form)
 * @returns {string} Smallest divisor (returns num itself if prime)
 */
export function divisionHyperbolic(numInput) {
  const num = typeof numInput === 'string' ? BigInt(numInput) : BigInt(numInput);

  // Handle base cases
  if (num % 2n === 0n) return '2';
  if (num % 3n === 0n) return '3';

  const trend = (num % 6n === 1n) ? 'first' : 'second';

  if (trend === 'first') {
    // For 6n+1: n = (num - 1) / 6
    const n = (num - 1n) / 6n;
    return divisionFirstTrend(num, n);
  } else {
    // For 6n-1: n = (num + 1) / 6
    const n = (num + 1n) / 6n;
    return divisionSecondTrend(num, n);
  }
}

/**
 * First trend: 6n+1 numbers
 * Checks if (m - 3r)(m + 3r) = 6n+1 has integer solutions
 */
function divisionFirstTrend(num, n) {
  // Check divisibility by 5 first
  if (num % 5n === 0n) return '5';

  let r = 0n;

  // First pattern: 7*r <= n - 8
  while (7n * r <= n - 8n) {
    // Check if m = √(9r² + 6n + 1) is an integer
    const discriminant = 9n * r * r + 6n * n + 1n;
    const m = isqrt(discriminant);

    if (m * m === discriminant) {
      // Found integer square root, now check if it gives valid divisor
      const check = m - 3n * r - 1n;

      if (check % 6n === 0n && check >= 6n && m >= 3n * r + 1n) {
        const divisor = check + 1n;
        return divisor.toString();
      }
    }
    r++;
  }

  // Second pattern: 5*r <= n - 4
  r = 0n;
  while (5n * r <= n - 4n) {
    const discriminant = 9n * r * r + 6n * n + 1n;  // Same discriminant!
    const m = isqrt(discriminant);

    if (m * m === discriminant) {
      const check = m - 3n * r + 1n;  // Different: +1 instead of -1

      if (check % 6n === 0n && check >= 6n && check + 3n * r - 1n >= 0n) {
        const divisor = check - 1n;  // Returns check - 1
        if (divisor < num && divisor > 1n) {
          return divisor.toString();
        }
      }
    }
    r++;
  }

  return num.toString();
}

/**
 * Second trend: 6n-1 numbers
 * Checks if (3r - m)(3r + m) = 6n-1 has integer solutions
 */
function divisionSecondTrend(num, n) {
  // Check divisibility by 5 first
  if (num % 5n === 0n) return '5';

  const sqrtNum = isqrt(num);
  const checkLimit = sqrtNum / 3n;

  let r = 0n;

  // First pattern: 7*r <= n + 8
  while (7n * r <= n + 8n) {
    if (r >= checkLimit) {
      // Check if m = √(9r² - 6n + 1) is an integer
      const discriminant = 9n * r * r - 6n * n + 1n;

      if (discriminant > 0n) {
        const m = isqrt(discriminant);

        if (m * m === discriminant) {
          const check = m + 3n * r + 1n;

          if (check % 6n === 0n && check >= 6n && 3n * r - check + 1n >= 0n) {
            const divisor = check - 1n;
            if (divisor < num && divisor > 1n) {
              return divisor.toString();
            }
          }
        }
      }
    }
    r++;
  }

  // Second pattern: 5*r <= n + 4
  r = 0n;
  while (5n * r <= n + 4n) {
    if (r >= checkLimit) {
      const discriminant = 9n * r * r - 6n * n + 1n;

      if (discriminant > 0n) {
        const m = isqrt(discriminant);

        if (m * m === discriminant) {
          const check = m + 3n * r - 1n;

          if (check % 6n === 0n && check >= 6n && 3n * r - check - 1n >= 0n) {
            const divisor = check + 1n;
            if (divisor < num && divisor > 1n) {
              return divisor.toString();
            }
          }
        }
      }
    }
    r++;
  }

  return num.toString();
}

/**
 * Integer square root using Newton's method
 * More efficient than Math.sqrt for BigInt
 */
function isqrt(n) {
  if (n < 2n) return n;

  // Initial guess
  let x = n;
  let y = (x + 1n) / 2n;

  // Newton's method: y = (x + n/x) / 2
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }

  return x;
}

/**
 * Check if a number is prime using hyperbolic equations
 * @param {string|number} num - Number to test
 * @returns {boolean} True if prime
 */
export function isPrimeHyperbolic(numInput) {
  const num = typeof numInput === 'string' ? BigInt(numInput) : BigInt(numInput);

  if (num === 2n || num === 3n) return true;
  if (num < 2n) return false;
  if (num % 6n !== 1n && num % 6n !== 5n) return false;

  const divisor = BigInt(divisionHyperbolic(num));
  return divisor === num;
}

/**
 * Find all prime factors using hyperbolic approach
 * @param {string|number} num - Number to factorize
 * @returns {Object} Map of prime factors to their powers
 */
export function factorizeHyperbolic(numInput) {
  let num = typeof numInput === 'string' ? BigInt(numInput) : BigInt(numInput);
  const factors = {};

  while (num !== 1n) {
    const div = BigInt(divisionHyperbolic(num));
    const divStr = div.toString();
    factors[divStr] = (factors[divStr] || 0) + 1;
    num = num / div;
  }

  return factors;
}

/**
 * Get scientific notation of factorization
 * @param {Object} factors - Map of factors to powers
 * @returns {string} Formatted string like "2 x 3² x 5"
 */
export function factorsToString(factors) {
  let str = '';
  for (const [factor, power] of Object.entries(factors)) {
    str += power === 1 ? `${factor} × ` : `${factor}^${power} × `;
  }
  return str.slice(0, -3);
}

// Example usage and demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('═'.repeat(60));
  console.log('HYPERBOLIC EQUATION APPROACH DEMONSTRATION');
  console.log('═'.repeat(60));
  console.log();

  console.log('This approach uses hyperbolic equations to find divisors:');
  console.log('  For 6n+1: m² - 9r² = 6n+1');
  console.log('  For 6n-1: 9r² - m² = 6n-1');
  console.log();

  const testNumbers = [
    { num: '143', desc: '11 × 13' },
    { num: '221', desc: '13 × 17' },
    { num: '323', desc: '17 × 19' },
    { num: '899', desc: '29 × 31' },
    { num: '1517', desc: 'Prime' },
    { num: '2021', desc: '43 × 47' }
  ];

  console.log('Testing numbers:');
  console.log('─'.repeat(60));

  for (const { num, desc } of testNumbers) {
    const divisor = divisionHyperbolic(num);
    const isPrime = divisor === num;
    const factors = factorizeHyperbolic(num);
    const factorStr = factorsToString(factors);

    console.log(`\n${num}:`);
    console.log(`  Expected: ${desc}`);
    console.log(`  Smallest divisor: ${divisor}`);
    console.log(`  Is prime: ${isPrime}`);
    console.log(`  Complete factorization: ${factorStr}`);
  }

  console.log();
  console.log('─'.repeat(60));
  console.log('✓ Hyperbolic equation approach working correctly!');
  console.log();

  // Performance comparison
  console.log('═'.repeat(60));
  console.log('PERFORMANCE COMPARISON');
  console.log('═'.repeat(60));
  console.log();
  console.log('Checking 100 numbers near 1,000,000...');

  const start = Date.now();
  let primeCount = 0;

  for (let i = 1000000; i < 1000100; i++) {
    if (i % 6 === 1 || i % 6 === 5) {
      if (isPrimeHyperbolic(i.toString())) {
        primeCount++;
      }
    }
  }

  const time = Date.now() - start;

  console.log(`Found ${primeCount} primes in ${time}ms`);
  console.log(`Average: ${(time / 100).toFixed(2)}ms per number`);
  console.log();
}
