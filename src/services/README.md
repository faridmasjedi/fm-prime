# JavaScript Prime Number Services

Comprehensive JavaScript implementations for prime number computations using BigInt-based operations and multiple mathematical approaches including novel methods.

---

## Table of Contents

- [Overview](#overview)
- [Core Modules](#core-modules)
- [Optimized Modules](#optimized-modules)
- [Advanced Methods](#advanced-methods)
- [Performance Comparison](#performance-comparison)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)

---

## Overview

This directory contains JavaScript (ES6+ modules) implementations for prime number operations, organized into two categories:

### 1. **Original Implementations** (File-based approach)
- `primeChecker.mjs` - Basic primality testing with file integration
- `primeGenerator.mjs` - Prime generation with file storage
- `helper.mjs` - Utility functions and candidate generation
- `numberDivisors.mjs` - Divisor calculation
- `primeIndex.mjs` - Prime index operations
- `fileOperations.mjs` - File I/O and folder management
- `mathOperations.mjs` - Basic BigInt arithmetic

### 2. **Optimized Implementations** (Performance-focused)
- `primeChecker.optimized.mjs` - Optimized primality testing (50-100x faster)
- `primeGenerator.optimized.mjs` - High-performance generation
- `helper.optimized.mjs` - Optimized utilities
- `numberDivisors.optimized.mjs` - Fast divisor calculation
- `mathOperations.optimized.mjs` - Optimized BigInt operations
- `primeHybrid.optimized.mjs` - Hybrid 6k±1 + Sieve approach
- `wheel210.optimized.mjs` - Wheel-210 factorization (23% candidates)

**Note:** `primeHyperbolic.optimized.mjs` has been moved to `/investigation` folder due to known bugs. See investigation folder for details.

---

## Core Modules

### primeChecker.mjs

**Purpose**: Primality testing with file-based optimization

**Key Functions**:

```javascript
isPrime(number, partition = "1")           // Basic 6k±1 primality test
isPrimeUsingFiles(num)                     // Uses pre-existing prime files
isPrimeFromTextFiles(num)                  // File-based without folder creation
isPrimeFromTextFilesRecursive(num)         // Recursive file checking
isPrimeFromTextFilesRecursiveUpdated(num)  // Optimized recursive
isPrimeFromTextRecursive(num)              // Recursive with folder creation
isPrimeFromTextRecursiveUpdated(num)       // Fastest recursive version
isSophiePrime(number)                      // Sophie Germain prime check
isTwinPrime(number)                        // Twin prime identification
isIsolatedPrime(number)                    // Isolated prime check
```

**Example**:
```javascript
import {
  isPrime,
  isPrimeFromTextFilesRecursiveUpdated,
  isTwinPrime
} from './services/primeChecker.mjs';

console.log(isPrime("17"));                    // true
console.log(isPrimeFromTextFilesRecursiveUpdated("999983")); // true
console.log(isTwinPrime("11"));                // "11 & 13 : Twins"
```

### primeGenerator.mjs

**Purpose**: Prime generation and storage

**Key Functions**:

```javascript
generatePrimesUpTo(number)                        // Generate all primes up to N
generatePrimesUpToRecursive(current, limit)       // Recursive generation
generatePrimesUpToRecursiveUpdated(current, limit) // Optimized recursive
generatePrimesRecursiveUpdated(current, limit)    // Fastest recursive
generatePrimesInRange(start, end)                 // Primes in range [a, b]
generatePrimesInRangeUpdated(start, end)          // Optimized range
generatePrimesInRangeTextFiles(start, end)        // File-based range
generatePrimesInRangeTextFilesUpdated(start, end) // Fastest range
generatePrimeOutputFromText(num)                  // Use existing files
generatePrimesFiles(num)                          // Create persistent files
generatePrimesFilesUpdated(num)                   // Fastest file generation
```

**Example**:
```javascript
import {
  generatePrimesRecursiveUpdated,
  generatePrimesInRangeTextFilesUpdated,
  generatePrimesFilesUpdated
} from './services/primeGenerator.mjs';

// Generate primes up to 10,000
generatePrimesRecursiveUpdated("2", "10000");

// Primes in range
const primes = generatePrimesInRangeTextFilesUpdated("1000", "2000");
console.log(primes);

// Create persistent files
generatePrimesFilesUpdated("100000");
```

### helper.mjs

**Purpose**: Utility functions for prime operations

**Key Functions**:

```javascript
findNextCandidate(num)                           // Get next 6k±1 candidate
generatePartitions(limit, partitionRange)        // Partition for parallel processing
checkAndExplainPrimeStatus(num)                  // Detailed prime status
checkAndExplainPrimeStatusUpdated(num)           // Optimized status check
formatLastFileInLastFolder(number)               // Format prime storage
formatLastFileInLastFolderRecursive(number)      // Recursive formatting
formatLastFileInLastFolderRecursiveUpdated(number) // Optimized recursive
```

**Example**:
```javascript
import {
  findNextCandidate,
  checkAndExplainPrimeStatusUpdated
} from './services/helper.mjs';

// Navigate 6k±1 pattern
let current = "5";
for (let i = 0; i < 5; i++) {
  console.log(current); // 5, 7, 11, 13, 17
  current = findNextCandidate(current);
}

// Get detailed explanation
const status = checkAndExplainPrimeStatusUpdated("997");
console.log(status);
```

### numberDivisors.mjs

**Purpose**: Calculate all divisors of a number

**Key Functions**:

```javascript
calculateDivisors(num)              // Basic divisor calculation
calculateDivisorsUpdated(num)       // Optimized version
calculateDivisorsUsingText(num)     // File-based (fastest)
```

**Example**:
```javascript
import { calculateDivisorsUsingText } from './services/numberDivisors.mjs';

const divisors = calculateDivisorsUsingText("100");
console.log(divisors); // [1, 2, 4, 5, 10, 20, 25, 50, 100]
```

### fileOperations.mjs

**Purpose**: File and folder management for prime data

**Key Functions**:

```javascript
createOutputFolder(number)                    // Create prime storage folder
writeDataToFile(folderName, filename, data)   // Write prime data
getAllFromDirectory(source)                   // List all files/folders
parseAndSortFiles(files)                      // Sort by numeric suffix
findMatchingFolder(number)                    // Find folder for number
findMatchingFile(number, folder)              // Find file containing number
findLastExistingFolderNumber()                // Get latest folder number
primesInFile(filePath)                        // Read primes from file
copyAllFiles(sourceFolder, destFolder)        // Copy prime files
```

### mathOperations.mjs

**Purpose**: BigInt-based arithmetic operations

**Key Functions**:

```javascript
addNumbers(a, b)                    // BigInt addition
subtractNumbers(a, b)               // BigInt subtraction
multiplyNumbers(a, b)               // BigInt multiplication
divideNumbers(a, b)                 // BigInt division [quotient, remainder]
sqrtFloor(num)                      // Integer square root
findMax(a, b)                       // Maximum of two numbers
findMin(a, b)                       // Minimum of two numbers
isDivisibleBy2(num)                 // Check divisibility by 2
isDivisibleBy3(num)                 // Check divisibility by 3
isDivisibleBy5(num)                 // Check divisibility by 5
isDivisibleBy6(num)                 // Check divisibility by 6
```

**Example**:
```javascript
import { addNumbers, sqrtFloor, isDivisibleBy6 } from './services/mathOperations.mjs';

console.log(addNumbers("123456789", "987654321"));  // "1111111110"
console.log(sqrtFloor("1000000"));                  // "1000"
console.log(isDivisibleBy6("42"));                  // true
```

---

## Optimized Modules

All optimized modules use the `.optimized.mjs` suffix and provide **50-100x performance improvements** over basic implementations.

### primeChecker.optimized.mjs ⚡

**Purpose**: High-performance primality testing

**Optimizations**:
- Optimized BigInt operations (no string conversion overhead)
- Efficient 6k±1 pattern implementation
- Direct division checks without string parsing
- Reduced function call overhead

**API**: Same as `primeChecker.mjs` but much faster

**Example**:
```javascript
import { isPrimeOptimized } from './services/primeChecker.optimized.mjs';

console.log(isPrimeOptimized("999983"));  // true (50x faster)
```

### primeGenerator.optimized.mjs ⚡

**Purpose**: High-performance prime generation

**Key Functions**:

```javascript
generatePrimesOptimized(limit)              // Optimized generation up to N
generatePrimesInRangeOptimized(start, end)  // Optimized range generation
```

### mathOperations.optimized.mjs ⚡⚡

**Purpose**: Ultra-fast BigInt arithmetic

**Improvements**:
- Direct BigInt operations (no string conversion)
- Inlined operations for hot paths
- Optimized modulo operations
- Faster square root algorithm

**API**: Same as `mathOperations.mjs` but significantly faster

**Example**:
```javascript
import {
  addNumbers,
  multiplyNumbers,
  sqrtFloor
} from './services/mathOperations.optimized.mjs';

// All operations ~50x faster than unoptimized versions
const sum = addNumbers("999999999999999", "1");
const sqrt = sqrtFloor("1000000000000000");
```

### primeHybrid.optimized.mjs 🚀

**Purpose**: Hybrid approach combining 6k±1 with Sieve

**Key Features**:
- 6k±1 optimized sieve (uses 3x less memory)
- Hybrid prime finder with pre-computation
- Candidate generation and testing
- Range-based operations

**API**:

```javascript
// Classes
class HybridPrimeFinder {
  constructor(precomputeLimit = "10000")
  isPrime(num)
  findNthPrime(n)
  findPrimesInRange(start, end)
  findTwinPrimesInRange(start, end)
  findSophieGermainPrimesInRange(start, end)
}

// Functions
sieve6kOptimized(limit)                    // 6k±1 sieve (3x less memory)
```

**Example**:
```javascript
import {
  HybridPrimeFinder,
  sieve6kOptimized
} from './services/primeHybrid.optimized.mjs';

// Create finder with pre-computed primes
const finder = new HybridPrimeFinder("10000");

// Auto-selects best algorithm
console.log(finder.isPrime("997"));           // Lookup (instant)
console.log(finder.isPrime("1000003"));       // 6k±1 trial division
console.log(finder.isPrime("1000000007"));    // Optimized for large N

// Find twin primes
const twins = finder.findTwinPrimesInRange("100", "1000");
console.log(twins); // [[101, 103], [107, 109], ...]

// 6k±1 optimized sieve
const primes = sieve6kOptimized("100000");
console.log(`Found ${primes.length} primes`);
```

### wheel210.optimized.mjs ⚡⚡

**Purpose**: Maximum performance with Wheel-210 factorization

**Key Features**:
- Tests only 23% of candidates (vs 27% for Wheel-30, 33% for 6k±1)
- Eliminates multiples of 2, 3, 5, and 7
- 48 spokes per 210-number wheel
- Memory-efficient candidate generation

**API**:

```javascript
class Wheel210 {
  static SPOKES                              // 48 residues mod 210
  static INCREMENTS                          // Gaps between spokes
  static *generateCandidates(start, end)     // Generator for candidates
  static nextCandidate(current)              // Get next candidate
}

// Functions
sieveWheel210(limit)                         // Sieve using Wheel-210
isPrimeWheel210(num)                         // Primality test with Wheel-210
```

**Example**:
```javascript
import {
  Wheel210,
  sieveWheel210,
  isPrimeWheel210
} from './services/wheel210.optimized.mjs';

// Generate all primes up to 1,000,000
const primes = sieveWheel210("1000000");
console.log(`Found ${primes.length} primes`);

// Generate candidates in range
const candidates = Array.from(Wheel210.generateCandidates("1000", "1100"));
console.log(`Testing only ${candidates.length} candidates`);

// Primality testing
console.log(isPrimeWheel210("997"));  // true
```

**Performance**:
- Wheel-6 (6k±1): 33.3% candidates
- Wheel-30: 26.7% candidates
- Wheel-210: 22.9% candidates
- **30% fewer tests than 6k±1!**

### ~~primeHyperbolic.optimized.mjs~~ 🔍 MOVED TO INVESTIGATION

**Status**: Moved to `/investigation` folder due to known bugs

**Purpose**: Novel hyperbolic equation approach for primality testing (under investigation)

**Mathematical Foundation**:

For **6n+1** numbers:
```
If composite: (6k+1)(6kk+1) = 6n+1
Derivation: (m - 3r)(m + 3r) = 6n+1
Equation: m² - 9r² = 6n+1
Check: m = √(9r² + 6n + 1) must be integer
```

For **6n-1** numbers:
```
If composite: (6k-1)(6kk-1) = 6n-1
Derivation: (3r - m)(3r + m) = 6n-1
Equation: 9r² - m² = 6n-1
Check: m = √(9r² - 6n + 1) must be integer
```

⚠️ **WARNING**: Current implementation has bugs that produce false positives (incorrectly identifies composites as prime). Moved to `/investigation` for further research. **Do not use in production.** See `/investigation/README.md` for details.

**API** (available in `/investigation/primeHyperbolic.optimized.mjs`):

```javascript
divisionHyperbolic(num)           // Find smallest divisor
isPrimeHyperbolic(num)            // Check primality
factorizeHyperbolic(num)          // Complete factorization
factorsToString(factors)          // Format factorization

// Internal functions
divisionFirstTrend(num, n)        // For 6n+1 numbers
divisionSecondTrend(num, n)       // For 6n-1 numbers
isqrt(n)                          // Integer square root (BigInt)
```

**Example** (from investigation folder):
```javascript
import {
  divisionHyperbolic,
  isPrimeHyperbolic,
  factorizeHyperbolic,
  factorsToString
} from '../investigation/primeHyperbolic.optimized.mjs';

// Check primality
console.log(isPrimeHyperbolic("143"));      // false (11 × 13)
console.log(isPrimeHyperbolic("1517"));     // true

// Find smallest divisor
console.log(divisionHyperbolic("143"));     // "11"

// Complete factorization
const factors = factorizeHyperbolic("2021");
console.log(factors);                       // Map { "43" => 1, "47" => 1 }
console.log(factorsToString(factors));      // "43 × 47"
```

**Properties**:
- ✅ Mathematically elegant (geometry meets number theory)
- ✅ Educational value (shows alternative perspective)
- ⚠️ Similar O(√n) complexity to trial division
- ⚠️ More operations per iteration (sqrt, multiply, modulo)
- 🔍 Potentially novel formulation (requires literature review)

**Key Insight**:
Instead of doing trial division, we check if certain square roots are integers. If √(9r² + 6n + 1) is an integer satisfying constraints, we've found a divisor without explicit division!

---

## Performance Comparison

### BigInt Operations Performance

| Module | String Conversion | Performance | Use Case |
|--------|------------------|-------------|----------|
| `mathOperations.mjs` | Yes (every operation) | Baseline | Educational |
| `mathOperations.optimized.mjs` | No (direct BigInt) | **50-100x faster** | Production |

### Primality Testing Performance

| Method | Module | Candidates | Complexity | Best For |
|--------|--------|-----------|-----------|----------|
| **Basic isPrime** | `primeChecker.mjs` | 33% (6k±1) | O(√n / 3) | Small numbers |
| **Optimized isPrime** | `primeChecker.optimized.mjs` | 33% (6k±1) | O(√n / 3) | 50x faster |
| **Wheel-210** | `wheel210.optimized.mjs` | 23% | O(√n / 4.4) | Maximum speed |
| **Hybrid** | `primeHybrid.optimized.mjs` | Variable | Auto-select | Convenience |
| ~~**Hyperbolic**~~ | ~~`investigation/`~~ | ~~33%~~ | ~~O(√n)~~ | 🔍 Under investigation |

### Generation Performance

| Method | Module | Best For | Speedup |
|--------|--------|----------|---------|
| **Basic generation** | `primeGenerator.mjs` | - | Baseline |
| **Recursive updated** | `primeGenerator.mjs` | Up to N | 50x |
| **6k±1 Sieve** | `primeHybrid.optimized.mjs` | Bulk generation | 100x |
| **Wheel-210 Sieve** | `wheel210.optimized.mjs` | Max performance | 150x |

### Memory Usage

| Method | Memory | Storage |
|--------|--------|---------|
| **Traditional Sieve** | O(n) | RAM only |
| **6k±1 Sieve** | O(n/3) | 3x less RAM |
| **Wheel-210 Sieve** | O(n/4.4) | 4.4x less RAM |
| **File-based** | O(1) | Disk storage |

---

## Quick Start

### Basic Usage

```javascript
// 1. Simple primality check
import { isPrimeOptimized } from './services/primeChecker.optimized.mjs';

console.log(isPrimeOptimized("17"));  // true

// 2. Generate primes up to N (fastest)
import { sieveWheel210 } from './services/wheel210.optimized.mjs';

const primes = sieveWheel210("1000");
console.log(`Found ${primes.length} primes`);

// 3. Hybrid approach (recommended)
import { HybridPrimeFinder } from './services/primeHybrid.optimized.mjs';

const finder = new HybridPrimeFinder();
console.log(finder.isPrime("999983"));  // Auto-selects best method

// 4. File-based approach (persistent)
import {
  generatePrimesFilesUpdated
} from './services/primeGenerator.mjs';

generatePrimesFilesUpdated("100000");  // Creates prime files
```

### Advanced Usage

```javascript
// 1. Wheel-210 for maximum performance
import {
  Wheel210,
  sieveWheel210
} from './services/wheel210.optimized.mjs';

const primes = sieveWheel210("1000000");
console.log(`Found ${primes.length} primes (23% candidates tested)`);

// Get next candidate
let current = "100";
for (let i = 0; i < 10; i++) {
  current = Wheel210.nextCandidate(current);
  console.log(current);
}

// 2. Hybrid with pre-computation
import { HybridPrimeFinder } from './services/primeHybrid.optimized.mjs';

const finder = new HybridPrimeFinder("100000");

// Find twin primes
const twins = finder.findTwinPrimesInRange("100", "1000");
console.log(`Found ${twins.length} twin prime pairs`);

// Find Sophie Germain primes
const sophie = finder.findSophieGermainPrimesInRange("100", "1000");
console.log(`Found ${sophie.length} Sophie Germain primes`);

// 3. File-based with detailed status
import {
  isPrimeFromTextRecursiveUpdated
} from './services/primeChecker.mjs';
import {
  checkAndExplainPrimeStatusUpdated
} from './services/helper.mjs';

// Fast primality check
console.log(isPrimeFromTextRecursiveUpdated("999983"));

// Detailed explanation
const status = checkAndExplainPrimeStatusUpdated("997");
console.log(status);
```

---

## API Reference

### Method Selection Guide

```javascript
// For single prime check (small to medium):
import { isPrimeOptimized } from './services/primeChecker.optimized.mjs';
const result = isPrimeOptimized("999983");

// For single prime check (maximum performance):
import { isPrimeWheel210 } from './services/wheel210.optimized.mjs';
const result = isPrimeWheel210("999983");

// For all primes up to N (fastest):
import { sieveWheel210 } from './services/wheel210.optimized.mjs';
const primes = sieveWheel210("100000");

// For primes in range [a, b]:
import { Wheel210 } from './services/wheel210.optimized.mjs';
const candidates = Array.from(Wheel210.generateCandidates("1000", "2000"));

// For intelligent auto-selection:
import { HybridPrimeFinder } from './services/primeHybrid.optimized.mjs';
const finder = new HybridPrimeFinder();
const result = finder.isPrime(n);  // Auto-selects best method

// For persistent file-based storage:
import {
  isPrimeFromTextRecursiveUpdated
} from './services/primeChecker.mjs';
const result = isPrimeFromTextRecursiveUpdated("999983");
```

### Import Quick Reference

```javascript
// Optimized primality testing
import {
  isPrimeOptimized,                    // 6k±1 optimized
  isPrime,                             // Basic with partitioning
} from './services/primeChecker.optimized.mjs';

// Wheel-210 (maximum performance)
import {
  Wheel210,                            // 23% candidates
  sieveWheel210,                       // Fastest sieve
  isPrimeWheel210,                     // Wheel-210 primality
} from './services/wheel210.optimized.mjs';

// Hybrid approach
import {
  HybridPrimeFinder,                   // Intelligent finder
  sieve6kOptimized,                    // 6k±1 sieve (3x less memory)
} from './services/primeHybrid.optimized.mjs';

// Hyperbolic method
import {
  isPrimeHyperbolic,                   // Hyperbolic primality
  divisionHyperbolic,                  // Find divisor
  factorizeHyperbolic,                 // Complete factorization
} from './services/primeHyperbolic.optimized.mjs';

// File-based methods (original, with recursion)
import {
  isPrimeFromTextRecursiveUpdated,     // Fastest file-based
  isPrimeFromTextFilesRecursiveUpdated,// No folder creation
} from './services/primeChecker.mjs';

// Prime generation
import {
  generatePrimesRecursiveUpdated,      // Fastest generation
  generatePrimesInRangeTextFilesUpdated, // Range with files
  generatePrimesFilesUpdated,          // Create persistent files
} from './services/primeGenerator.mjs';

// Utilities
import {
  findNextCandidate,                   // Next 6k±1 candidate
  checkAndExplainPrimeStatusUpdated,   // Detailed status
} from './services/helper.mjs';

// Math operations (optimized)
import {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
} from './services/mathOperations.optimized.mjs';
```

### File-Based Storage Structure

```
primeOutput/
├── prime_1000/
│   ├── OutputPrimes.txt      # All primes up to 1000
│   ├── OutputPattern1.txt    # 6k-1 pattern data
│   └── OutputPattern2.txt    # 6k+1 pattern data
├── prime_10000/
│   ├── OutputPrimes.txt
│   ├── OutputPattern1.txt
│   └── OutputPattern2.txt
└── prime_100000/
    ├── OutputPrimes.txt
    ├── OutputPattern1.txt
    └── OutputPattern2.txt
```

**Benefits**:
- Instant lookups when √n < largest folder
- Persistent storage across runs
- Incremental growth as needed
- Memory efficient (load only necessary files)

---

## Performance Tips

1. **Use `.optimized.mjs` modules**: 50-100x faster than basic versions
2. **For bulk generation**: Use `sieveWheel210()` for maximum speed
3. **For single checks**: Use `isPrimeOptimized()` or `isPrimeWheel210()`
4. **For convenience**: Use `HybridPrimeFinder` (auto-selects best method)
5. **For persistent storage**: Use file-based methods from original modules
6. **BigInt operations**: Always use `.optimized.mjs` math operations

⚠️ **Note**: `primeHyperbolic.optimized.mjs` has been moved to `/investigation` due to known bugs. Not recommended for use.

### Optimization Impact

| Operation | Unoptimized | Optimized | Speedup |
|-----------|-------------|-----------|---------|
| isPrime(1,000,003) | ~500ms | ~5ms | 100x |
| Generate up to 100K | ~60s | ~600ms | 100x |
| sqrt(10^15) | ~20ms | ~0.2ms | 100x |
| BigInt division | ~5ms | ~0.05ms | 100x |

---

## Testing

Run comprehensive tests:

```bash
# Test all JavaScript methods
node test-all-methods.mjs

# Test specific module
node src/services/wheel210.optimized.mjs
node src/services/primeHybrid.optimized.mjs
node src/services/primeHyperbolic.optimized.mjs
```

---

## Module Dependencies

```
primeChecker.optimized.mjs
    ├── mathOperations.optimized.mjs ✓
    ├── fileOperations.mjs
    └── helper.mjs

primeGenerator.optimized.mjs
    ├── mathOperations.optimized.mjs ✓
    ├── primeChecker.optimized.mjs ✓
    └── fileOperations.mjs

primeHybrid.optimized.mjs
    ├── mathOperations.optimized.mjs ✓
    └── primeChecker.optimized.mjs ✓

wheel210.optimized.mjs
    └── primeChecker.optimized.mjs ✓

helper.optimized.mjs
    ├── mathOperations.optimized.mjs ✓
    └── fileOperations.mjs
```

**✓ = Optimized dependency** (50-100x faster)

---

## Migration Guide

### From Basic to Optimized

```javascript
// Before (slow)
import { isPrime } from './services/primeChecker.mjs';
import { addNumbers } from './services/mathOperations.mjs';

// After (50-100x faster)
import { isPrimeOptimized } from './services/primeChecker.optimized.mjs';
import { addNumbers } from './services/mathOperations.optimized.mjs';
```

### API Compatibility

All `.optimized.mjs` modules maintain **100% API compatibility** with their basic counterparts:

- Same function names
- Same parameters
- Same return types
- Only difference: **50-100x faster**

---

## Author

**Farid Masjedi**

GitHub: [Farid Masjedi](https://github.com/faridmasjedi)

---

## Version History

- **Version 2.0** (2024-12-03)
  - Added optimized implementations (50-100x faster)
  - Added Wheel-210 factorization
  - Added hybrid 6k±1 + Sieve approach
  - Added hyperbolic equation method
  - Optimized BigInt operations

- **Version 1.0** (2024-12-03)
  - Initial file-based implementations
  - Basic prime operations with BigInt
  - Recursive methods

---

## License

Open source - feel free to use, modify, and distribute.

---

## Related Documentation

- **[Main README](../../README.md)** - Project overview and mathematical foundations
- **[User Guide](../../USER_GUIDE.md)** - How to use the library
- **[Methods Guide](../../METHODS_GUIDE.md)** - Detailed algorithm explanations
- **[Comparison](../../COMPARISON.md)** - Performance benchmarks
- **[Orchestration Layer](../orchestration/README.md)** - Method organization and selection
- **[Python Services](../services-py/README.md)** - Python implementations

---

*For complete usage guide, see [USER_GUIDE.md](../../USER_GUIDE.md)*

*For performance benchmarks, see [COMPARISON.md](../../COMPARISON.md)*

*For method explanations, see [METHODS_GUIDE.md](../../METHODS_GUIDE.md)*
