# Comprehensive Prime Number Utilities

This repository contains both JavaScript and Python implementations for prime number computations using multiple mathematical approaches including the novel **Hyperbolic Equation Method**.

> **Note**: While the JavaScript implementations are highly functional and optimized, **Python methods are generally quicker due to their efficient handling of numerical computations and file I/O operations**.

---

## Table of Contents

- [Overview](#overview)
- [Key Methods](#key-methods)
- [Mathematical Foundation](#mathematical-foundation)
- [Hyperbolic Equation Approach](#hyperbolic-equation-approach-novel)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Author](#author)

---

## Overview

This repository includes multiple approaches to prime number computation:

### Available Methods

1. **6k±1 Pattern (Wheel-6)** - Tests only 33% of numbers
2. **Wheel-30** - Tests only 27% of numbers (eliminates multiples of 2, 3, 5)
3. **Wheel-210** - Tests only 23% of numbers (eliminates multiples of 2, 3, 5, 7)
4. **Miller-Rabin** - Probabilistic test for very large primes
5. **Sieve of Eratosthenes** - Bulk generation of all primes up to N
6. **Hyperbolic Equation Method** - 🔍 Under investigation (has known bugs)

---

## Key Methods

### For Single Prime Checks
- **Small numbers (<10⁶)**: Use 6k±1 trial division
- **Large numbers (>10⁶)**: Use Miller-Rabin test

### For Bulk Prime Generation
- **Small ranges (<10K)**: Use 6k±1 Sieve
- **Medium ranges (<1M)**: Use Wheel-30 Sieve
- **Large ranges (>1M)**: Use Wheel-210 Sieve

---

## Mathematical Foundation

### The 6k±1 Pattern

**All primes > 3 are of form 6k±1**

**Proof:**
- Every integer can be written as: 6k, 6k+1, 6k+2, 6k+3, 6k+4, or 6k+5
- **6k** = divisible by 6 → not prime
- **6k+2** = 2(3k+1) → divisible by 2 → not prime
- **6k+3** = 3(2k+1) → divisible by 3 → not prime
- **6k+4** = 2(3k+2) → divisible by 2 → not prime
- **6k+1** and **6k+5 = 6k-1** → only these can be prime ✓

Therefore, only 2 out of every 6 positions need testing (33% of numbers).

### Factorization Patterns

For composite numbers in 6k±1 form:

**For 6n+1:**
- 6n+1 = (6k+1)(6kk+1) → n = 6k·kk + k + kk
- 6n+1 = (6k-1)(6kk-1) → n = 6k·kk - k - kk

**For 6n-1:**
- 6n-1 = (6k+1)(6kk-1) → n = 6k·kk - k + kk
- 6n-1 = (6k-1)(6kk+1) → n = 6k·kk + k - kk

---

## Hyperbolic Equation Approach (Novel)

### Overview

This approach transforms the prime factorization problem into solving **hyperbolic equations**, providing a geometric perspective on primality testing.

### Mathematical Derivation

#### Starting Point

For a number of form 6n+1, if composite, it factors as (6k+1)(6kk+1).

We can express this as a quadratic equation:
```
k² - sk + p = 0
where: s = k + kk, p = k·kk
```

#### Derivation for 6n+1

From: n = 6k·kk + k + kk = 6p + s

We have: s = n - 6p

The discriminant: δ = s² - 4p = (n-6p)² - 4p = n² - 12np + 36p² - 4p

For integer solutions, δ must be a perfect square: δ = r²

This gives us: n² - 12np + 36p² - 4p - r² = 0

Solving for p using the quadratic formula and requiring integer solutions:

```
δ' = 16(3n+1)² - 144(n²-r²) = 16(9r² + 6n + 1)
```

For δ' to be a perfect square, we need:

### **9r² + 6n + 1 = m²**

Rearranging:

### **(m - 3r)(m + 3r) = 6n+1**

#### Derivation for 6n-1

Similarly, for numbers of form 6n-1:

### **9r² - 6n + 1 = m²**

Rearranging:

### **(3r - m)(3r + m) = 6n-1**

### The Hyperbolic Equations

These are **hyperbola equations** in the (r, m) plane:

**For 6n+1:** m² - 9r² = 6n+1

**For 6n-1:** 9r² - m² = 6n-1

### Algorithm

To check if a number is composite:

```
For 6n+1:
  for r = 0 to √n:
    discriminant = 9r² + 6n + 1
    m = √discriminant

    if m² == discriminant:  # Perfect square
      check = m - 3r - 1
      if check % 6 == 0 and check >= 6:
        divisor = check + 1
        return composite (divisor found)

  return prime (no divisor found)
```

### Key Properties

1. **Geometric Interpretation**: Each n value creates a hyperbola in (r, m) space
2. **Integer Solutions**: Composite numbers correspond to integer points on these hyperbolas
3. **Natural Bound**: Solutions cluster near the asymptote m ≈ 3r
4. **Constraints**:
   - For 6n+1: 7r ≤ n-8 (first pattern) or 5r ≤ n-4 (second pattern)
   - For 6n-1: 7r ≤ n+8 (first pattern) or 5r ≤ n+4 (second pattern)

### Advantages

✅ **Mathematical Elegance**: Transforms factorization into geometry
✅ **Educational Value**: Shows connection between algebra and number theory
✅ **Alternative Perspective**: Different from trial division approach
✅ **Potentially Novel**: Specific formulation may be unique

### Limitations

⚠️ **Performance**: Similar O(√n) complexity to trial division
⚠️ **Operations**: More operations per iteration (sqrt, multiply, modulo)
⚠️ **Practical Use**: Not faster than optimized trial division

### Research Potential

🔍 **Areas for investigation:**
- Density patterns of integer solutions
- Relationship to Pell equations
- Distribution of (r, m) pairs
- Optimization of solution search

### ⚠️ Current Status

**Implementation moved to `/investigation` folder for further research.**

The current implementation has known bugs that cause false positives:
- Incorrectly identifies 77 (7×11), 143 (11×13), and 45+ other composites as prime
- Accuracy: ~78% for numbers < 1,000 (47 false positives out of 168 expected primes)

**Not recommended for production use.** See `/investigation/README.md` for details and ongoing research.

---

## Quick Start

### JavaScript

```javascript
import { isPrimeOptimized, millerRabinTest } from './src/services/primeChecker.optimized.mjs';
import { sieveWheel210 } from './src/services/wheel210.optimized.mjs';

// Check single prime
console.log(isPrimeOptimized('999983'));  // true

// Find all primes up to 100,000
const primes = sieveWheel210('100000');
console.log(`Found ${primes.length} primes`);
```

### Python

```python
from prime_optimized import is_prime_optimized, miller_rabin_test
from wheel210 import sieve_wheel210

# Check single prime
print(is_prime_optimized(999983))  # True

# Find all primes up to 100,000
primes = sieve_wheel210(100000)
print(f"Found {len(primes)} primes")
```

### Testing

Run comprehensive tests:
```bash
# JavaScript
node test-all-methods.mjs

# Python
python test-all-methods.py
```

### Visualization

Explore the hyperbolic approach visually:
```bash
python analyze-hyperbolic-visual.py     # Generates plots
python analyze-hyperbolic-patterns.py   # Text analysis
```

---

## Documentation

### User Guides

- **[USER_GUIDE.md](./USER_GUIDE.md)** - How to use the library (API, examples)
- **[METHODS_GUIDE.md](./METHODS_GUIDE.md)** - Detailed explanation of all methods
- **[COMPARISON.md](./COMPARISON.md)** - Performance benchmarks and comparisons

### Implementation Details

- **[JavaScript Services README](./src/services/README.md)** - JavaScript implementations
- **[Python Services README](./src/services-py/README.md)** - Python implementations

### Research & Analysis

- **Data Files**: `hyperbolic_solutions.csv`, `hyperbola_curves.csv`
- **Visualization**: `hyperbolic_analysis.png` (generated by analysis script)

---

## Performance Summary

| Method | Candidates Tested | Best For |
|--------|------------------|----------|
| 6k±1 | 33% | General purpose, simple |
| Wheel-30 | 27% | Better performance |
| Wheel-210 | 23% | Maximum performance |
| Sieve | 23-33% | Bulk generation |
| Miller-Rabin | Variable | Very large numbers |
| Hyperbolic | 33% | 🔍 Under investigation (not recommended) |

---

## Why Python is Faster

1. **Efficient Libraries**: Optimized math libraries (faster than JavaScript)
2. **Native BigInt**: Handles large integers natively
3. **Better File I/O**: Faster file operations
4. **Simpler Syntax**: Easier to optimize

For production use: **Python recommended for performance-critical applications**

---

## Author

**Farid Masjedi**

GitHub: [Farid Masjedi](https://github.com/faridmasjedi)

---

## Contributing

Contributions welcome! Areas of interest:
- Performance optimizations
- Additional mathematical approaches
- Literature review on hyperbolic method novelty
- More comprehensive benchmarks

---

## License

Open source - feel free to use, modify, and distribute.

---

## Acknowledgments

- Mathematical derivations based on systematic exploration of 6k±1 patterns
- Hyperbolic approach independently discovered through algebraic analysis
- Wheel factorization builds on classical number theory techniques

---

*For detailed usage instructions, see [USER_GUIDE.md](./USER_GUIDE.md)*

*For performance comparisons, see [COMPARISON.md](./COMPARISON.md)*

*For method explanations, see [METHODS_GUIDE.md](./METHODS_GUIDE.md)*
