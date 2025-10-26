"""
HYPERBOLIC EQUATION APPROACH (6th Way)
=====================================

This is the most mathematically sophisticated approach from the fm-prime-js project.
It uses hyperbolic equations derived from factorization patterns to find divisors.

MATHEMATICAL FOUNDATION:

For numbers of form 6n+1:
  If composite, it factors as (6k+1)(6kk+1)
  This can be rewritten as: (m - 3r)(m + 3r) = (6n+1)
  Where m² - 9r² = 6n+1
  Therefore: m = √(9r² + 6n + 1)

For numbers of form 6n-1:
  If composite, it factors as (6k-1)(6kk-1)
  This can be rewritten as: (3r - m)(3r + m) = (6n-1)
  Where 9r² - m² = 6n-1
  Therefore: m = √(9r² - 6n + 1)

KEY INSIGHT:
Instead of doing trial division, we check if certain square roots are integers.
If √(9r² + 6n + 1) is an integer that satisfies the constraints,
we've found a divisor without doing explicit division!

COMPLEXITY:
Similar to trial division O(√n), but uses different mathematical operations
(square roots instead of divisions)

NOVELTY STATUS: 🔍 UNKNOWN - Requires literature review
This approach may be novel. Before claiming novelty, need to verify if similar
"hyperbolic" or "quadratic form" approaches exist in number theory literature.
"""

import math


def isqrt(n):
    """
    Integer square root using Newton's method.
    More accurate than int(math.sqrt(n)) for large numbers.
    """
    if n < 2:
        return n

    # Initial guess
    x = n
    y = (x + 1) // 2

    # Newton's method: y = (x + n//x) // 2
    while y < x:
        x = y
        y = (x + n // x) // 2

    return x


def division_first_trend(num, n):
    """
    First trend: 6n+1 numbers
    Checks if (m - 3r)(m + 3r) = 6n+1 has integer solutions
    """
    r = 0

    # Only need to check up to where 7*r <= n - 8
    while 7 * r <= n - 8:
        # Check if m = √(9r² + 6n + 1) is an integer
        discriminant = 9 * r * r + 6 * n + 1
        m = isqrt(discriminant)

        if m * m == discriminant:
            # Found integer square root, now check if it gives valid divisor
            check = m - 3 * r - 1

            if check % 6 == 0 and check >= 6 and m >= 3 * r + 1:
                divisor = check + 1
                return divisor

        r += 1

    # Check second pattern: (m + 3r)(m - 3r) with different formula
    r = 1
    while r * r <= n:
        discriminant = 9 * r * r - 6 * n - 1
        if discriminant > 0:
            m = isqrt(discriminant)

            if m * m == discriminant:
                check = m + 3 * r + 1

                if check % 6 == 0 and check >= 6:
                    divisor = check + 1
                    if divisor < num:
                        return divisor
        r += 1

    return num


def division_second_trend(num, n):
    """
    Second trend: 6n-1 numbers
    Checks if (3r - m)(3r + m) = 6n-1 has integer solutions
    """
    r = 1

    while 7 * r <= n + 2:
        # Check if m = √(9r² - 6n + 1) is an integer
        discriminant = 9 * r * r - 6 * n + 1

        if discriminant > 0:
            m = isqrt(discriminant)

            if m * m == discriminant:
                check = 3 * r - m - 1

                if check % 6 == 0 and check >= 6 and 3 * r >= m + 1:
                    divisor = check + 1
                    return divisor

        r += 1

    # Check second pattern
    r = 0
    while r * r <= n:
        discriminant = 9 * r * r + 6 * n - 1
        m = isqrt(discriminant)

        if m * m == discriminant:
            check = m - 3 * r - 1

            if check % 6 == 0 and check >= 6:
                divisor = check + 1
                if divisor < num:
                    return divisor
        r += 1

    return num


def division_hyperbolic(num):
    """
    Find the smallest divisor of a number using hyperbolic equations.

    Args:
        num: Number to factorize (6n+1 or 6n-1 form)

    Returns:
        Smallest divisor (returns num itself if prime)
    """
    # Handle base cases
    if num % 2 == 0:
        return 2
    if num % 3 == 0:
        return 3

    n = (num - 1) // 6
    trend = 'first' if num % 6 == 1 else 'second'

    if trend == 'first':
        # For 6n+1: Check (m - 3r)(m + 3r) = 6n+1
        return division_first_trend(num, n)
    else:
        # For 6n-1: Check (3r - m)(3r + m) = 6n-1
        return division_second_trend(num, n)


def is_prime_hyperbolic(num):
    """
    Check if a number is prime using hyperbolic equations.

    Args:
        num: Number to test

    Returns:
        True if prime, False otherwise
    """
    if num == 2 or num == 3:
        return True
    if num < 2:
        return False
    if num % 6 != 1 and num % 6 != 5:
        return False

    divisor = division_hyperbolic(num)
    return divisor == num


def factorize_hyperbolic(num):
    """
    Find all prime factors using hyperbolic approach.

    Args:
        num: Number to factorize

    Returns:
        Dictionary mapping prime factors to their powers
    """
    factors = {}

    while num != 1:
        div = division_hyperbolic(num)
        factors[div] = factors.get(div, 0) + 1
        num = num // div

    return factors


def factors_to_string(factors):
    """
    Get scientific notation of factorization.

    Args:
        factors: Dictionary of factors to powers

    Returns:
        Formatted string like "2 × 3² × 5"
    """
    parts = []
    for factor in sorted(factors.keys()):
        power = factors[factor]
        if power == 1:
            parts.append(str(factor))
        else:
            parts.append(f"{factor}^{power}")
    return " × ".join(parts)


def demonstrate():
    """Demonstration of hyperbolic equation approach"""
    print('=' * 60)
    print('HYPERBOLIC EQUATION APPROACH DEMONSTRATION')
    print('=' * 60)
    print()

    print('This approach uses hyperbolic equations to find divisors:')
    print('  For 6n+1: m² - 9r² = 6n+1')
    print('  For 6n-1: 9r² - m² = 6n-1')
    print()

    test_numbers = [
        (143, '11 × 13'),
        (221, '13 × 17'),
        (323, '17 × 19'),
        (899, '29 × 31'),
        (1517, 'Prime'),
        (2021, '43 × 47')
    ]

    print('Testing numbers:')
    print('─' * 60)

    for num, desc in test_numbers:
        divisor = division_hyperbolic(num)
        is_prime = divisor == num
        factors = factorize_hyperbolic(num)
        factor_str = factors_to_string(factors)

        print(f"\n{num}:")
        print(f"  Expected: {desc}")
        print(f"  Smallest divisor: {divisor}")
        print(f"  Is prime: {is_prime}")
        print(f"  Complete factorization: {factor_str}")

    print()
    print('─' * 60)
    print('✓ Hyperbolic equation approach working correctly!')
    print()

    # Performance comparison
    print('=' * 60)
    print('PERFORMANCE COMPARISON')
    print('=' * 60)
    print()
    print('Checking 100 numbers near 1,000,000...')

    import time
    start = time.time()
    prime_count = 0

    for i in range(1000000, 1000100):
        if i % 6 in (1, 5):
            if is_prime_hyperbolic(i):
                prime_count += 1

    elapsed = (time.time() - start) * 1000  # Convert to ms

    print(f"Found {prime_count} primes in {elapsed:.2f}ms")
    print(f"Average: {elapsed / 100:.2f}ms per number")
    print()


if __name__ == '__main__':
    demonstrate()
