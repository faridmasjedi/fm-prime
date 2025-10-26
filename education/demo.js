// Simple demonstration of the Sieve vs Trial Division

console.log('\n' + '='.repeat(70));
console.log('  DEMONSTRATION: Sieve of Eratosthenes vs Trial Division');
console.log('='.repeat(70) + '\n');

const { primes: trialPrimes, ifPrime } = require('./primeFirstWay');
const { sievePrimes, sievePrimesString } = require('./primeSeventhWay');

// ===== DEMO 1: Small Example (Visual) =====
console.log('DEMO 1: Finding primes up to 30');
console.log('-'.repeat(70));

const limit1 = 30;

console.log('\n📊 Trial Division Approach (Your Current Method):');
console.log('   Checks each candidate: 5, 7, 11, 13, 17, 19, 23, 25, 29...');
console.log('   For each, divides by smaller primes until √n');
console.log('   Example: Is 29 prime? 29÷5? 29÷7? ✓ Prime!');

const start1a = Date.now();
const result1a = trialPrimes(limit1);
const time1a = Date.now() - start1a;

console.log(`   Result: ${result1a}`);
console.log(`   Time: ${time1a}ms\n`);

console.log('⚡ Sieve Approach (New Method):');
console.log('   Creates array: [5, 7, 11, 13, 17, 19, 23, 25, 29]');
console.log('   Marks composites: 25 = 5×5 ✗');
console.log('   Collects unmarked: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]');

const start1b = Date.now();
const result1b = sievePrimesString(limit1);
const time1b = Date.now() - start1b;

console.log(`   Result: ${result1b}`);
console.log(`   Time: ${time1b}ms`);

console.log(`\n   Same result? ${result1a === result1b ? '✅ Yes!' : '❌ No'}\n`);

// ===== DEMO 2: Medium Size =====
console.log('\n' + '='.repeat(70));
console.log('DEMO 2: Finding primes up to 10,000');
console.log('-'.repeat(70) + '\n');

const limit2 = 10000;

console.log('📊 Trial Division:');
const start2a = Date.now();
const result2a = trialPrimes(limit2).split(', ').length;
const time2a = Date.now() - start2a;
console.log(`   Found ${result2a} primes in ${time2a}ms`);

console.log('\n⚡ Sieve:');
const start2b = Date.now();
const result2b = sievePrimes(limit2).length;
const time2b = Date.now() - start2b;
console.log(`   Found ${result2b} primes in ${time2b}ms`);

const speedup2 = (time2a / time2b).toFixed(2);
console.log(`\n   Speedup: ${speedup2}x faster! 🚀\n`);

// ===== DEMO 3: Large Size =====
console.log('\n' + '='.repeat(70));
console.log('DEMO 3: Finding primes up to 1,000,000');
console.log('-'.repeat(70) + '\n');

const limit3 = 1000000;

console.log('📊 Trial Division:');
const start3a = Date.now();
const result3a = trialPrimes(limit3).split(', ').length;
const time3a = Date.now() - start3a;
console.log(`   Found ${result3a} primes in ${time3a}ms`);

console.log('\n⚡ Sieve:');
const start3b = Date.now();
const result3b = sievePrimes(limit3).length;
const time3b = Date.now() - start3b;
console.log(`   Found ${result3b} primes in ${time3b}ms`);

const speedup3 = (time3a / time3b).toFixed(2);
console.log(`\n   Speedup: ${speedup3}x faster! 🚀`);

// ===== DEMO 4: When Trial Division is Better =====
console.log('\n\n' + '='.repeat(70));
console.log('DEMO 4: Checking if single numbers are prime');
console.log('-'.repeat(70) + '\n');

const testNumbers = [999983, 1000003, 1000033, 1000037, 1000039];

console.log('📊 Trial Division (Your ifPrime):');
const start4a = Date.now();
testNumbers.forEach(n => {
  const isPrime = ifPrime(n);
  console.log(`   ${n}: ${isPrime ? 'Prime ✓' : 'Not prime'}`);
});
const time4a = Date.now() - start4a;
console.log(`   Total time: ${time4a}ms`);

console.log('\n⚡ Sieve (has to generate all primes up to N):');
const start4b = Date.now();
const allPrimes = new Set(sievePrimes(Math.max(...testNumbers)));
testNumbers.forEach(n => {
  const isPrime = allPrimes.has(n);
  console.log(`   ${n}: ${isPrime ? 'Prime ✓' : 'Not prime'}`);
});
const time4b = Date.now() - start4b;
console.log(`   Total time: ${time4b}ms`);

console.log(`\n   Trial division is ${(time4b / time4a).toFixed(2)}x faster for single checks! 🎯`);

// ===== SUMMARY =====
console.log('\n\n' + '='.repeat(70));
console.log('  SUMMARY: When to Use Each Method');
console.log('='.repeat(70) + '\n');

console.log('USE SIEVE (7th Way) when:');
console.log('  ✓ Finding ALL primes up to N');
console.log('  ✓ N is moderately large (>10,000)');
console.log('  ✓ You need the list once\n');
console.log('  Example: sievePrimes(100000)');

console.log('\nUSE TRIAL DIVISION (1st Way) when:');
console.log('  ✓ Checking if ONE number is prime');
console.log('  ✓ Doing spot checks on large numbers');
console.log('  ✓ Memory is limited\n');
console.log('  Example: ifPrime(999983)');

console.log('\n' + '='.repeat(70));
console.log('  YOUR PACKAGE NOW HAS THE BEST OF BOTH WORLDS! 🎉');
console.log('='.repeat(70) + '\n');
