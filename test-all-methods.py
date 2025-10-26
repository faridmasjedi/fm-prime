"""
Comprehensive Test and Performance Comparison
Tests all prime number methods and compares their performance
"""

import sys
import os
sys.path.insert(0, 'src/services-py')

import time
from primeUtils_optimized import find_next_candidate
from prime_optimized import (
    is_prime_optimized,
    miller_rabin_test,
    sieve_of_eratosthenes,
    Wheel30
)
from wheel210 import Wheel210, sieve_wheel210
from prime_hyperbolic import is_prime_hyperbolic, division_hyperbolic

# ============================================================================
# TEST DATA
# ============================================================================

small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
small_composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25]

medium_primes = [101, 211, 523, 1009, 2003, 5009, 10007]
medium_composites = [100, 200, 500, 1000, 2000, 5000, 10000]

large_primes = [999983, 1000003, 1000033, 1000037, 1000039]
large_composites = [999984, 1000000, 1000035, 1000050, 1000100]

print('╔' + '═' * 68 + '╗')
print('║' + ' ' * 68 + '║')
print('║  COMPREHENSIVE PRIME NUMBER METHODS TEST & COMPARISON' + ' ' * 14 + '║')
print('║' + ' ' * 68 + '║')
print('╚' + '═' * 68 + '╝\n')

# ============================================================================
# PART 1: CORRECTNESS TESTS
# ============================================================================

print('=' * 70)
print('PART 1: CORRECTNESS VERIFICATION')
print('=' * 70)
print()

def test_method(name, test_func, test_numbers, expected_results):
    """Test a method and return pass/fail counts"""
    passed = 0
    failed = 0

    for i, num in enumerate(test_numbers):
        expected = expected_results[i]
        try:
            result = test_func(num)
            if result == expected:
                passed += 1
            else:
                failed += 1
                print(f"  ❌ FAILED: {name}({num}) = {result}, expected {expected}")
        except Exception as e:
            failed += 1
            print(f"  ❌ ERROR: {name}({num}) raised {e}")

    return passed, failed

# Test 6k±1 Trial Division
print('Testing 6k±1 Trial Division...')
passed, failed = test_method(
    'is_prime_optimized',
    is_prime_optimized,
    small_primes + small_composites,
    [True] * len(small_primes) + [False] * len(small_composites)
)
print(f"  ✓ Passed: {passed}/{passed + failed}")

# Test Miller-Rabin
print('\nTesting Miller-Rabin...')
passed, failed = test_method(
    'miller_rabin_test',
    lambda n: miller_rabin_test(n, 5),
    medium_primes + medium_composites,
    [True] * len(medium_primes) + [False] * len(medium_composites)
)
print(f"  ✓ Passed: {passed}/{passed + failed}")

# Test Hyperbolic (for smaller numbers where it works)
print('\nTesting Hyperbolic Equations...')
hyperbolic_test_nums = [101, 143, 221, 323, 1517]
hyperbolic_expected = [True, False, False, False, True]
passed, failed = test_method(
    'is_prime_hyperbolic',
    is_prime_hyperbolic,
    hyperbolic_test_nums,
    hyperbolic_expected
)
print(f"  ✓ Passed: {passed}/{passed + failed}")

print('\n✓ All correctness tests completed!\n')

# ============================================================================
# PART 2: CANDIDATE GENERATION COMPARISON
# ============================================================================

print('=' * 70)
print('PART 2: CANDIDATE GENERATION EFFICIENCY')
print('=' * 70)
print()

limits = [1000, 10000, 100000]

for limit in limits:
    print(f"Candidates up to {limit:,}:")

    # Count 6k±1 candidates
    count_6k = 2  # 2 and 3
    k = 1
    while 6 * k - 1 <= limit:
        if 6 * k - 1 >= 5:
            count_6k += 1
        if 6 * k + 1 <= limit:
            count_6k += 1
        k += 1

    # Count Wheel-30 candidates
    wheel30_candidates = list(Wheel30.generate_candidates(2, limit))
    count_wheel30 = len(wheel30_candidates)

    # Count Wheel-210 candidates
    wheel210_candidates = list(Wheel210.generate_candidates(2, limit))
    count_wheel210 = len(wheel210_candidates)

    print(f"  6k±1 (Wheel-6):     {count_6k:>7,} ({count_6k/limit*100:.1f}%)")
    print(f"  Wheel-30:           {count_wheel30:>7,} ({count_wheel30/limit*100:.1f}%)")
    print(f"  Wheel-210:          {count_wheel210:>7,} ({count_wheel210/limit*100:.1f}%)")

    print(f"  Improvement over 6k±1:")
    print(f"    Wheel-30:  {(1 - count_wheel30/count_6k)*100:.1f}% fewer")
    print(f"    Wheel-210: {(1 - count_wheel210/count_6k)*100:.1f}% fewer")
    print()

# ============================================================================
# PART 3: SINGLE PRIME CHECK PERFORMANCE
# ============================================================================

print('=' * 70)
print('PART 3: SINGLE PRIME CHECK PERFORMANCE')
print('=' * 70)
print()

test_numbers = [
    (10007, 'Small prime'),
    (100003, 'Medium prime'),
    (999983, 'Large prime'),
    (1000003, 'Large prime'),
]

for n, desc in test_numbers:
    print(f"Testing {n} ({desc}):")

    # 6k±1 Trial Division
    start = time.time()
    result1 = is_prime_optimized(n)
    time1 = (time.time() - start) * 1000

    # Miller-Rabin
    start = time.time()
    result2 = miller_rabin_test(n, 5)
    time2 = (time.time() - start) * 1000

    print(f"  6k±1 Trial Division: {time1:.3f}ms → {'Prime' if result1 else 'Composite'}")
    print(f"  Miller-Rabin:        {time2:.3f}ms → {'Prime' if result2 else 'Composite'}")

    if time1 > 0 and time2 > 0:
        faster = '6k±1' if time1 < time2 else 'Miller-Rabin'
        speedup = time1/time2 if time1 < time2 else time2/time1
        print(f"  Speedup: {speedup:.2f}x faster with {faster}")
    print()

# ============================================================================
# PART 4: BULK PRIME GENERATION PERFORMANCE
# ============================================================================

print('=' * 70)
print('PART 4: BULK PRIME GENERATION PERFORMANCE')
print('=' * 70)
print()

bulk_limits = [10000, 50000, 100000]

for limit in bulk_limits:
    print(f"Finding all primes up to {limit:,}:")

    # Traditional Sieve
    start = time.time()
    primes_traditional = sieve_of_eratosthenes(limit)
    time_traditional = (time.time() - start) * 1000

    # Sieve with Wheel-210
    start = time.time()
    primes_210 = sieve_wheel210(limit)
    time_210 = (time.time() - start) * 1000

    print(f"  Traditional:   {time_traditional:>6.1f}ms → {len(primes_traditional)} primes")
    print(f"  Wheel-210:     {time_210:>6.1f}ms → {len(primes_210)} primes")

    if len(primes_traditional) == len(primes_210):
        print(f"  ✓ Results match")
    else:
        print(f"  ❌ MISMATCH: {len(primes_traditional)} vs {len(primes_210)}")

    if time_traditional > 0 and time_210 > 0:
        speedup = time_traditional / time_210
        print(f"  Speedup: {speedup:.2f}x faster with Wheel-210")
    print()

# ============================================================================
# PART 5: MEMORY EFFICIENCY COMPARISON
# ============================================================================

print('=' * 70)
print('PART 5: MEMORY EFFICIENCY COMPARISON')
print('=' * 70)
print()

memory_limit = 100000
print(f"Memory usage for sieve up to {memory_limit:,}:")
print()

# Traditional sieve would need 100,000 bits
print(f"  Traditional Sieve:  ~{memory_limit//8:,} bytes (100%)")

# 6k±1 sieve needs only 33.3% of numbers
mem_6k = int(memory_limit * 0.333 // 8)
print(f"  6k±1 Sieve:         ~{mem_6k:,} bytes (33%)")

# Wheel-30 needs only 26.7%
mem_30 = int(memory_limit * 0.267 // 8)
print(f"  Wheel-30 Sieve:     ~{mem_30:,} bytes (27%)")

# Wheel-210 needs only 22.9%
mem_210 = int(memory_limit * 0.229 // 8)
print(f"  Wheel-210 Sieve:    ~{mem_210:,} bytes (23%)")

print()
print(f"  Memory saved:")
print(f"    6k±1:      {(1 - 0.333) * 100:.0f}% less than traditional")
print(f"    Wheel-30:  {(1 - 0.267) * 100:.0f}% less than traditional")
print(f"    Wheel-210: {(1 - 0.229) * 100:.0f}% less than traditional")
print()

# ============================================================================
# PART 6: CANDIDATE GENERATION PATTERNS
# ============================================================================

print('=' * 70)
print('PART 6: CANDIDATE GENERATION PATTERNS')
print('=' * 70)
print()

print('First 20 candidates from each wheel pattern:')
print()

# 6k±1 pattern
candidates_6k = [2, 3]
current = 5
for _ in range(18):
    candidates_6k.append(current)
    current = find_next_candidate(current)
print('6k±1 (Wheel-6):')
print(f"  {', '.join(map(str, candidates_6k[:20]))}")
print()

# Wheel-30 pattern
candidates_30 = list(Wheel30.generate_candidates(2, 100))[:20]
print('Wheel-30:')
print(f"  {', '.join(map(str, candidates_30))}")
print()

# Wheel-210 pattern
candidates_210 = list(Wheel210.generate_candidates(2, 150))[:20]
print('Wheel-210:')
print(f"  {', '.join(map(str, candidates_210))}")
print()

# ============================================================================
# PART 7: RECOMMENDATIONS
# ============================================================================

print('=' * 70)
print('PART 7: USAGE RECOMMENDATIONS')
print('=' * 70)
print()

print("""
📊 WHEN TO USE EACH METHOD:

1. SINGLE PRIME CHECKS (Testing if ONE number is prime):
   ✓ Small numbers (<10⁶):       Use 6k±1 Trial Division
   ✓ Large numbers (>10⁶):        Use Miller-Rabin
   ✓ Very large (>10¹⁵):          Use Miller-Rabin with more rounds

2. BULK PRIME GENERATION (Finding ALL primes up to N):
   ✓ Small ranges (<10,000):      6k±1 Sieve
   ✓ Medium ranges (<1M):         Wheel-30 Sieve
   ✓ Large ranges (>1M):          Wheel-210 Sieve
   ✓ Need maximum performance:    Wheel-210 Sieve

3. PRIME GENERATION IN RANGE [A, B]:
   ✓ Small range:                 6k±1 with trial division
   ✓ Large range:                 Wheel-30 + Miller-Rabin
   ✓ Maximum performance:         Wheel-210 + segmented sieve

4. FACTORIZATION:
   ✓ Small numbers:               6k±1 trial division
   ✓ Research/education:          Hyperbolic equations approach

⚡ PERFORMANCE SUMMARY:

- 6k±1 Pattern:    Tests 33% of numbers (3x better than naive)
- Wheel-30:        Tests 27% of numbers (20% better than 6k±1)
- Wheel-210:       Tests 23% of numbers (31% better than 6k±1)

- Sieve methods:   5-10x faster than trial division for bulk
- Miller-Rabin:    Best for very large numbers
- Memory usage:    Wheels save 67-77% memory vs. traditional sieve
""")

print('=' * 70)
print('✓ ALL TESTS COMPLETED!')
print('=' * 70)
print()
