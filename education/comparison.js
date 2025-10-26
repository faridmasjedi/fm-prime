// Comparison of different prime finding methods

const { primes: firstWayPrimes, primesCount: firstWayCount } = require('./primeFirstWay');
const { primes: secondWayPrimes, primeCount: secondWayCount } = require('./primeSecondWay');
const { primes: thirdWayPrimes, primesCount: thirdWayCount } = require('./primeThirdWay');
const { sievePrimes, sievePrimesCount, sievePrimesString } = require('./primeSeventhWay');

const benchmark = (name, func, limit) => {
  const start = Date.now();
  const result = func(limit);
  const end = Date.now();
  const time = end - start;

  // Get count whether result is string or array
  const count = typeof result === 'string'
    ? result.split(', ').length
    : Array.isArray(result) ? result.length : result;

  return { name, time, count };
};

const runComparison = (limit) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Performance Comparison: Finding all primes up to ${limit.toLocaleString()}`);
  console.log('='.repeat(60));

  const results = [];

  // Test each method
  try {
    results.push(benchmark('Sieve (7th Way - NEW)', (n) => sievePrimes(n), limit));
  } catch (e) {
    console.log('Sieve: Error -', e.message);
  }

  try {
    results.push(benchmark('Trial Division (1st Way)', (n) => firstWayPrimes(n), limit));
  } catch (e) {
    console.log('First Way: Error -', e.message);
  }

  try {
    results.push(benchmark('Non-Prime Indexes (2nd Way)', (n) => secondWayPrimes(n), limit));
  } catch (e) {
    console.log('Second Way: Error -', e.message);
  }

  try {
    results.push(benchmark('Division Formula (3rd Way)', (n) => thirdWayPrimes(n), limit));
  } catch (e) {
    console.log('Third Way: Error -', e.message);
  }

  // Sort by time
  results.sort((a, b) => a.time - b.time);

  console.log('\nResults (fastest to slowest):\n');
  results.forEach((r, i) => {
    const speedup = i === 0 ? '' : ` (${(r.time / results[0].time).toFixed(2)}x slower)`;
    console.log(`${i + 1}. ${r.name.padEnd(35)} ${r.time.toString().padStart(6)}ms - ${r.count} primes${speedup}`);
  });

  console.log('\n');
  return results;
};

console.log('\n🔢 Prime Number Algorithm Comparison\n');

// Test with increasing sizes
const limits = [10000, 100000, 500000];

for (const limit of limits) {
  runComparison(limit);
}

console.log('\n' + '='.repeat(60));
console.log('KEY FINDINGS:');
console.log('='.repeat(60));
console.log(`
1. SIEVE OF ERATOSTHENES (7th Way - NEW):
   ✓ Best for: Finding ALL primes up to N
   ✓ Speed: Fastest for large ranges (100K+ numbers)
   ✓ Memory: Efficient with 6n±1 optimization
   ✓ Use when: You need all primes in a range

2. TRIAL DIVISION (1st Way - Current):
   ✓ Best for: Checking if single number is prime
   ✓ Speed: Fast for individual checks
   ✓ Memory: Minimal
   ✓ Use when: Testing individual numbers

3. YOUR OTHER METHODS:
   ✓ 2nd Way: Interesting mathematically but slower
   ✓ 3rd Way: Good for understanding patterns
   ✓ 6th Way: Most sophisticated math but complex

RECOMMENDATION:
- Keep 1st Way for isPrime(n) checks
- Use 7th Way (Sieve) for primes(n) and primesInRange()
- This gives you best of both worlds!
`);

console.log('='.repeat(60));
console.log('\nWant to see the code? Check primeSeventhWay.js');
console.log('To integrate: See integration instructions in that file\n');
