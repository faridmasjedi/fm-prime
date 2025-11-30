# Prime Number Orchestration Layer

JavaScript orchestration module that imports and organizes all prime number service functions for easy access and method selection.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Available Methods](#available-methods)
- [Method Classification](#method-classification)
- [Performance Hierarchy](#performance-hierarchy)
- [Quick Selection Guide](#quick-selection-guide)
- [Usage Examples](#usage-examples)

---

## Overview

The orchestration layer (`prime.mjs`) serves as the **central hub** for all prime number operations. It imports functions from multiple service modules and provides:

1. **Organized Access**: All methods grouped by functionality
2. **Clear Performance Indicators**: Methods labeled by speed (Main 1, Main 2, etc.)
3. **Progressive Optimization**: Multiple versions of same functionality (original, updated, recursive)
4. **Method Selection Guidance**: Comments indicate which methods to use

---

## Architecture

### Import Structure

```
prime.mjs (Orchestration Layer)
    │
    ├── helper.mjs
    │   ├── checkAndExplainPrimeStatus
    │   └── checkAndExplainPrimeStatusUpdated ⚡
    │
    ├── primeChecker.mjs
    │   ├── isPrime
    │   ├── isPrimeUsingFiles ⚡
    │   ├── isPrimeFromTextFiles ⚡⚡
    │   ├── isPrimeFromTextFilesRecursive ⚡⚡⚡
    │   └── ... (10+ variants)
    │
    ├── primeGenerator.mjs
    │   ├── generatePrimesUpTo
    │   ├── generatePrimesInRange
    │   ├── generatePrimesRecursiveUpdated ⚡⚡⚡
    │   └── ... (14+ variants)
    │
    ├── numberDivisors.mjs
    │   ├── calculateDivisors
    │   └── calculateDivisorsUsingText ⚡⚡
    │
    ├── primeIndex.mjs
    │   └── calculatePrimesText ⚡⚡⚡
    │
    └── primeHyperbolic.optimized.mjs
        ├── sieveHyperbolicOptimized ⚡⚡⚡
        └── isPrimeHyperbolicOptimized ⚡⚡⚡
```

### Service Layer Organization

The orchestration imports from six main service modules:

1. **helper.mjs** - Prime status checking and explanation
2. **primeChecker.mjs** - Primality testing (10+ methods)
3. **primeGenerator.mjs** - Prime generation (14+ methods)
4. **numberDivisors.mjs** - Divisor calculation (3 methods)
5. **primeIndex.mjs** - Prime index calculation (1 method)
6. **primeHyperbolic.optimized.mjs** - Hyperbolic equation methods with caching

---

## Available Methods

### 1. Prime Status Checking (helper.mjs)

| Method | Speed | Description |
|--------|-------|-------------|
| `checkAndExplainPrimeStatus` | **Main 6** ⚡ | Checks existing files, falls back to isPrime |
| `checkAndExplainPrimeStatusUpdated` | **Main 6-1** ⚡⚡ | Faster version of above |

**Use Case**: Get detailed explanation of whether a number is prime

**Example**:
```javascript
import { checkAndExplainPrimeStatusUpdated } from "./orchestration/prime.mjs";

const result = checkAndExplainPrimeStatusUpdated("997");
console.log(result); // Detailed explanation with divisor info
```

### 2. Primality Testing (primeChecker.mjs)

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `isPrime` | **Main 1** 🐢 | Basic primality (6k±1) | ❌ Don't use (slow) |
| `isPrimeUsingFiles` | **Main 5** ⚡ | Uses pre-existing files | ⚠️ Limited by file availability |
| `isPrimeUsingFilesUpdated` | **Main 5-1** ⚡ | Faster file-based | ⚠️ Limited by file availability |
| `isPrimeFromText` | **Main 9** ⚡⚡ | Creates folders if needed | ✅ Good for persistent data |
| `isPrimeFromTextFiles` | **Main 10** ⚡⚡ | Checks without creating folders | ✅ Good balance |
| `isPrimeFromTextFilesUpdated` | **Main 10-1** ⚡⚡ | Faster version | ✅ Recommended |
| `isPrimeFromTextFilesRecursive` | **Main 11** ⚡⚡⚡ | Recursive file checking | ✅✅ Very fast |
| `isPrimeFromTextFilesRecursiveUpdated` | **Main 11-1** ⚡⚡⚡ | Fastest recursive | ✅✅ Highly recommended |
| `isPrimeFromTextRecursive` | **Main 12** ⚡⚡⚡ | Recursive with folder creation | ✅✅ Most complete |
| `isPrimeFromTextRecursiveUpdated` | **Main 12-1** ⚡⚡⚡ | Fastest complete version | ✅✅✅ **Best choice** |

**Best Practices**:
- For **√n < existing files**: All file-based methods are instant
- For **√n > existing files**: Use recursive/updated versions
- **Don't use** basic `isPrime` (too slow for large numbers)

**Example**:
```javascript
import { isPrimeFromTextFilesRecursiveUpdated } from "./orchestration/prime.mjs";

console.log(isPrimeFromTextFilesRecursiveUpdated("999983")); // true
```

### 3. Prime Generation (primeGenerator.mjs)

#### Generate Up To N

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `generatePrimesUpTo` | **Main 3** 🐢 | From first prime | ❌ Very slow |
| `generatePrimesUpToUpdated` | **Main 3-1** 🐢 | Slightly faster | ❌ Still slow |
| `generatePrimesUpToRecursive` | **Main 13** ⚡ | Recursive from 2 | ⚠️ Better but not best |
| `generatePrimesUpToRecursiveUpdated` | **Main 13-1** ⚡⚡ | Faster recursive | ✅ Good |
| `generatePrimesRecursiveUpdated` | **Main 13-2** ⚡⚡⚡ | Fastest recursive | ✅✅✅ **Best choice** |

#### Generate In Range

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `generatePrimesInRange` | **Main 4** 🐢 | Basic range generation | ❌ Slow |
| `generatePrimesInRangeUpdated` | **Main 4-1** 🐢 | Slightly faster | ⚠️ Still not optimal |
| `generatePrimesInRangeTextFiles` | **Main 4-2** ⚡ | Uses text files | ✅ Better |
| `generatePrimesInRangeTextFilesUpdated` | **Main 4-3** ⚡⚡ | Faster file-based | ✅✅ **Recommended** |

#### File-Based Generation

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `generatePrimeOutputFromText` | **Main 7** ⚡⚡ | Only if N < existing max | ✅ Quick for small N |
| `generatePrimesFiles` | **Main 14** ⚡⚡⚡ | Creates all necessary files | ✅✅ Very efficient |
| `generatePrimesFilesUpdated` | **Main 14-1** ⚡⚡⚡ | Fastest file generation | ✅✅✅ **Best choice** |

**Best Practices**:
- For **bulk generation up to N**: Use `generatePrimesRecursiveUpdated`
- For **range [a, b]**: Use `generatePrimesInRangeTextFilesUpdated`
- For **creating persistent files**: Use `generatePrimesFilesUpdated`
- **Avoid** non-updated iterative methods

**Example**:
```javascript
import {
    generatePrimesRecursiveUpdated,
    generatePrimesInRangeTextFilesUpdated,
    generatePrimesFilesUpdated
} from "./orchestration/prime.mjs";

// Generate all primes up to 10,000
generatePrimesRecursiveUpdated("10000");

// Generate primes in range [1000, 2000]
const rangeprimes = generatePrimesInRangeTextFilesUpdated("1000", "2000");

// Create persistent files
generatePrimesFilesUpdated("100000");
```

### 4. Divisor Calculation (numberDivisors.mjs)

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `calculateDivisors` | **Main 2** 🐢 | Checks from first divisor | ❌ Slow |
| `calculateDivisorsUpdated` | **Main 2-1** 🐢 | Slightly faster | ⚠️ Still not optimal |
| `calculateDivisorsUsingText` | **Main 8** ⚡⚡ | Uses file-based √n check | ✅✅✅ **Best choice** |

**Best Practice**: Always use `calculateDivisorsUsingText` for efficiency

**Example**:
```javascript
import { calculateDivisorsUsingText } from "./orchestration/prime.mjs";

const divisors = calculateDivisorsUsingText("100");
console.log(divisors); // All divisors of 100
```

### 5. Prime Index Calculation (primeIndex.mjs)

| Method | Speed | Description | Recommendation |
|--------|-------|-------------|----------------|
| `calculatePrimesText` | **⚡⚡⚡** | Fastest prime index method | ✅✅✅ **Quickest** |

**Use Case**: Calculate prime indices leveraging all optimizations

**Example**:
```javascript
import { calculatePrimesText } from "./orchestration/prime.mjs";

calculatePrimesText("1000000");
```

### 6. Hyperbolic Methods (primeHyperbolic.optimized.mjs)

| Method | Speed | Description | Recommendation |
|---|---|---|---|
| `sieveHyperbolicOptimized` | ***Main 15** ⚡⚡⚡ | Super quick with caching, two-way search | ✅✅✅ **Best for repeated bulk generation** |
| `isPrimeHyperbolicOptimized` | ***Main 16** ⚡⚡⚡ | Super quick with caching, O(√N) | ✅✅✅ **Best for repeated single checks** |
| `divisionHyperbolic` | **Main 17** ⚡⚡ | Finds smallest divisor using hyperbolic equations | ✅✅ Good for finding one divisor |
| `getHyperbolicCacheStats` | Utility | Checks cache status | ✅ Useful for debugging cache |

**Use Case**: Achieve very high performance for repeated queries through intelligent file caching.

**Example**:
```javascript
import { sieveHyperbolicOptimized, isPrimeHyperbolicOptimized } from "./orchestration/prime.mjs";

// First run will build the cache
const primes = sieveHyperbolicOptimized("100000");
console.log(`Found ${primes.length} primes`); // Found 9592 primes

// Subsequent runs are extremely fast
const isPrime = isPrimeHyperbolicOptimized("99989");
console.log(isPrime); // true
```

---

## Method Classification

### By Performance Tier

#### 🐢 Tier 1 - Basic (Avoid in Production)
- `isPrime`
- `generatePrimesUpTo`
- `generatePrimesInRange`
- `calculateDivisors`

**Characteristics**: Basic 6k±1 pattern, no file optimization
**Use Case**: Educational purposes only

#### ⚡ Tier 2 - File-Based (Good)
- `isPrimeUsingFiles`
- `isPrimeFromTextFiles`
- `generatePrimeOutputFromText`
- `generatePrimesInRangeTextFiles`

**Characteristics**: Leverages pre-computed files, no folder creation
**Use Case**: When files exist up to √n

#### ⚡⚡ Tier 3 - Advanced File-Based (Better)
- `isPrimeFromTextFilesUpdated`
- `calculateDivisorsUsingText`
- `generatePrimesInRangeTextFilesUpdated`
- `generatePrimesFiles`
- `divisionHyperbolic`

**Characteristics**: Optimized file operations, efficient algorithms
**Use Case**: General production use

#### ⚡⚡⚡ Tier 4 - Recursive/Optimized (Best)
- `isPrimeFromTextFilesRecursive`
- `isPrimeFromTextFilesRecursiveUpdated`
- `isPrimeFromTextRecursiveUpdated`
- `generatePrimesRecursiveUpdated`
- `generatePrimesFilesUpdated`
- `calculatePrimesText`
- `sieveHyperbolicOptimized`
- `isPrimeHyperbolicOptimized`

**Characteristics**: Recursive algorithms, maximum optimization, and/or advanced caching
**Use Case**: Performance-critical applications

### By Functionality

#### Primality Testing
- **Fastest Overall**: `isPrimeFromTextRecursiveUpdated`
- **Fastest with Caching**: `isPrimeHyperbolicOptimized`
- **Without Folder Creation**: `isPrimeFromTextFilesRecursiveUpdated`
- **With File Availability**: `isPrimeUsingFilesUpdated`

#### Prime Generation
- **Fastest with Caching**: `sieveHyperbolicOptimized`
- **Up to N**: `generatePrimesRecursiveUpdated`
- **In Range [a, b]**: `generatePrimesInRangeTextFilesUpdated`
- **Create Files**: `generatePrimesFilesUpdated`

#### Divisors
- **Only Choice**: `calculateDivisorsUsingText`
- **Hyperbolic alternative**: `divisionHyperbolic`

#### Prime Indices
- **Only Choice**: `calculatePrimesText`

---

## Performance Hierarchy

### Primality Testing Evolution

```
isPrime (Main 1)
    ↓ +File checking
isPrimeUsingFiles (Main 5)
    ↓ +Optimization
isPrimeUsingFilesUpdated (Main 5-1)
    ↓ +Text file integration
isPrimeFromTextFiles (Main 10)
    ↓ +Optimization
isPrimeFromTextFilesUpdated (Main 10-1)
    ↓ +Recursion
isPrimeFromTextFilesRecursive (Main 11)
    ↓ +Optimization
isPrimeFromTextFilesRecursiveUpdated (Main 11-1)
    ↓ +Folder creation
isPrimeFromTextRecursive (Main 12)
    ↓ +Optimization
isPrimeFromTextRecursiveUpdated (Main 12-1) ← FASTEST (file-based)
    |
    └─ isPrimeHyperbolicOptimized (Main 16) ← FASTEST (with cache)
```

### Generation Evolution

```
generatePrimesUpTo (Main 3)
    ↓ +Optimization
generatePrimesUpToUpdated (Main 3-1)
    ↓ +Recursion
generatePrimesUpToRecursive (Main 13)
    ↓ +Optimization
generatePrimesUpToRecursiveUpdated (Main 13-1)
    ↓ +Further optimization
generatePrimesRecursiveUpdated (Main 13-2) ← FASTEST (file-based)
    |
    └─ sieveHyperbolicOptimized (Main 15) ← FASTEST (with cache)
```

---

## Quick Selection Guide

### Decision Tree

```
Need to check if N is prime?
│
├─ Is this a repeated action in your app?
│  └─ YES → isPrimeHyperbolicOptimized (fastest with cache)
│  └─ NO  → Continue below
│
├─ √N < existing file limit?
│  └─ YES → isPrimeUsingFilesUpdated (instant)
│  └─ NO  → Continue below
│
├─ Need to create folders?
│  └─ YES → isPrimeFromTextRecursiveUpdated
│  └─ NO  → isPrimeFromTextFilesRecursiveUpdated
│
└─ Performance critical?
   └─ YES → Use recursive/updated versions
   └─ NO  → Regular file-based methods OK

Need to generate primes?
│
├─ Is this a repeated action in your app?
│  └─ YES → sieveHyperbolicOptimized (fastest with cache)
│  └─ NO  → generatePrimesRecursiveUpdated
│
├─ All primes up to N?
│  └─ generatePrimesRecursiveUpdated
│
├─ Primes in range [a, b]?
│  └─ generatePrimesInRangeTextFilesUpdated
│
└─ Create persistent files?
   └─ generatePrimesFilesUpdated

Need divisors of N?
└─ calculateDivisorsUsingText (or divisionHyperbolic)

Need prime indices?
└─ calculatePrimesText (fastest method)
```

### Recommendations by Use Case

#### Web Application (Performance Critical)
```javascript
import {
    isPrimeHyperbolicOptimized,
    sieveHyperbolicOptimized,
    calculateDivisorsUsingText
} from "./orchestration/prime.mjs";
```

#### Batch Processing (File Generation)
```javascript
import {
    generatePrimesFilesUpdated,
    calculatePrimesText,
    sieveHyperbolicOptimized
} from "./orchestration/prime.mjs";
```

#### Data Analysis (Range Queries)
```javascript
import {
    generatePrimesInRangeTextFilesUpdated,
    isPrimeHyperbolicOptimized
} from "./orchestration/prime.mjs";
```

#### Educational (Understanding Algorithms)
```javascript
import {
    isPrime,
    generatePrimesUpTo,
    checkAndExplainPrimeStatus
} from "./orchestration/prime.mjs";
```

---

## Usage Examples

### Example 1: Check Prime Status with Explanation

```javascript
import { checkAndExplainPrimeStatusUpdated } from "./orchestration/prime.mjs";

const status = checkAndExplainPrimeStatusUpdated("997");
console.log(status);
// Output: Detailed explanation of primality with divisor information
```

### Example 2: High-Performance Primality Testing

```javascript
import { isPrimeHyperbolicOptimized } from "./orchestration/prime.mjs";

// Test multiple numbers efficiently
const numbers = ["999983", "1000000", "1000003", "1000033"];

for (const num of numbers) {
    const result = isPrimeHyperbolicOptimized(num);
    console.log(`${num}: ${result ? "PRIME" : "NOT PRIME"}`);
}
```

### Example 3: Generate Primes in Range

```javascript
import { generatePrimesInRangeTextFilesUpdated } from "./orchestration/prime.mjs";

// Find all primes between 10,000 and 20,000
const primes = generatePrimesInRangeTextFilesUpdated("10000", "20000");
console.log(`Found ${primes.length} primes in range`);
console.log(`First 10: ${primes.slice(0, 10).join(", ")}`);
```

### Example 4: Create Prime Database with Caching

```javascript
import { sieveHyperbolicOptimized } from "./orchestration/prime.mjs";

// Generate and store all primes up to 1,000,000
console.log("Generating primes up to 1,000,000...");
sieveHyperbolicOptimized("1000000");
console.log("Complete! Files created for fast future lookups.");
```

### Example 5: Calculate All Divisors

```javascript
import { calculateDivisorsUsingText } from "./orchestration/prime.mjs";

const number = "1000";
const divisors = calculateDivisorsUsingText(number);

console.log(`Divisors of ${number}:`);
console.log(divisors.join(", "));
console.log(`Total: ${divisors.length} divisors`);
```

### Example 6: Batch Prime Generation with Caching

```javascript
import { sieveHyperbolicOptimized } from "./orchestration/prime.mjs";

// Generate primes for multiple ranges
const ranges = ["10000", "50000", "100000", "500000"];

for (const limit of ranges) {
    console.log(`Generating primes up to ${limit}...`);
    const startTime = Date.now();

    sieveHyperbolicOptimized(limit);

    const elapsed = Date.now() - startTime;
    console.log(`  ✓ Complete in ${elapsed}ms`);
}
```

---

## File-Based Storage

The orchestration layer supports file-based prime storage for performance optimization:

### Folder Structure

```
primeOutput/
├── prime_1000/
│   ├── prime_1.txt
│   ├── prime_2.txt
│   └── ...
├── prime_10000/
│   ├── prime_1.txt
│   ├── prime_2.txt
│   └── ...
└── prime_100000/
    ├── prime_1.txt
    ├── prime_2.txt
    └── ...
```

The hyperbolic methods use a different caching folder: `output-big/`.

### Benefits

1. **Instant Lookups**: If √n < largest folder, primality check is O(1)
2. **Persistent Storage**: Generated primes reused across runs
3. **Incremental Growth**: Only generate new primes as needed
4. **Memory Efficiency**: Load only necessary files

### Trade-offs

- **Disk Space**: Requires storage for prime files
- **Initial Cost**: First generation takes time
- **File I/O**: Some overhead for file operations

---

## Performance Notes

### Method Selection Impact

| Scenario | Poor Choice | Good Choice | Speedup |
|----------|-------------|-------------|---------|
| Check if 1,000,003 is prime | `isPrime` | `isPrimeHyperbolicOptimized` | 1000x+ |
| Generate primes up to 100,000 | `generatePrimesUpTo` | `sieveHyperbolicOptimized` | 500x+ |
| Find divisors of 1,000,000 | `calculateDivisors` | `calculateDivisorsUsingText` | 10x+ |

### Optimization Strategy

1. **Caching is Key**: Use `sieveHyperbolicOptimized` to build a cache for repeated queries.
2. **Recursive Methods**: Prefer recursive/updated versions for file-based operations.
3. **File-Based**: Leverage existing files when √n < file limit.
4. **Avoid Basic**: Never use Main 1-4 methods in production.

---

## Author

**Farid Masjedi**

GitHub: [Farid Masjedi](https://github.com/faridmasjedi)

---

## Version History

- **Version 2.0** (2024-12-03)
  - Updated import structure
  - Added recursive methods
  - Performance optimizations
  - Added Hyperbolic Caching methods

- **Version 1.0** (2024-12-03)
  - Initial orchestration layer
  - Basic method organization

---

## Related Documentation

- **[Main README](../../README.md)** - Project overview and mathematical foundations
- **[User Guide](../../USER_GUIDE.md)** - How to use the library
- **[Methods Guide](../../METHODS_GUIDE.md)** - Detailed algorithm explanations
- **[Comparison](../../COMPARISON.md)** - Performance benchmarks
- **[JavaScript Services](../services/README.md)** - Service layer documentation
- **[Python Services](../services-py/README.md)** - Python implementations

---

## License

Open source - feel free to use, modify, and distribute.
