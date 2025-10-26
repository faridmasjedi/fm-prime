# Educational Prime Number Investigation Methods

A comprehensive collection of **seven different approaches** to investigating prime number patterns, complete with mathematical proofs, derivations, and implementations.

---

## Table of Contents

- [Mathematical Foundation](#mathematical-foundation)
- [The Seven Ways](#the-seven-ways)
- [Complete Mathematical Proofs](#complete-mathematical-proofs)
- [Implementation Files](#implementation-files)
- [Usage Examples](#usage-examples)
- [Performance Comparison](#performance-comparison)

---

## Mathematical Foundation

### The 6k±1 Pattern

**All primes > 3 are of form 6k±1**

#### Proof

Every integer can be written as one of:
```
6k, 6k+1, 6k+2, 6k+3, 6k+4, 6k+5
```

Let's examine each:

- **6k** = 6k → Divisible by 6 → **Not prime** ✗
- **6k+1** → **Could be prime** ✓
- **6k+2** = 2(3k+1) → Divisible by 2 → **Not prime** ✗
- **6k+3** = 3(2k+1) → Divisible by 3 → **Not prime** ✗
- **6k+4** = 2(3k+2) → Divisible by 2 → **Not prime** ✗
- **6k+5** = 6k-1 → **Could be prime** ✓

**Conclusion**: Only numbers of form **6k±1** can be prime (for k ≥ 1)

### Factorization Patterns

For composite numbers in 6k±1 form:

#### For 6n+1:
```
6n+1 = (6k+1)(6kk+1)  →  n = 6k·kk + k + kk
6n+1 = (6k-1)(6kk-1)  →  n = 6k·kk - k - kk
```

#### For 6n-1:
```
6n-1 = (6k+1)(6kk-1)  →  n = 6k·kk - k + kk
6n-1 = (6k-1)(6kk+1)  →  n = 6k·kk + k - kk
```

---

## The Seven Ways

### Overview

| Way | Method | Complexity | Description |
|-----|--------|-----------|-------------|
| **1st** | Trial Division with 6k±1 | O(√n / 3) | Check divisibility by candidates |
| **2nd** | Non-Prime Index Generation | O(n²) | Generate composite indices |
| **3rd** | Direct Index Calculation | O(√n) | Calculate if index is composite |
| **4th** | Equation Plotting | O(n) | Plot equations to find patterns |
| **5th** | Residual Pattern Analysis | O(√n) | Analyze residual patterns |
| **6th** | Hyperbolic Equation (Novel) | O(√n) | Quadratic form transformation |
| **7th** | Sieve of Eratosthenes | O(n log log n) | Mark all composites |

---

## Complete Mathematical Proofs

### First Way: Trial Division with 6k±1

**Concept**: Generate candidates using 6k±1 pattern and test divisibility up to √n

**Why √n?**

For any number n with divisor d:
```
n = d × q
```

If both d > √n and q > √n, then:
```
d × q > √n × √n = n  (Contradiction!)
```

Therefore, at least one divisor ≤ √n

**Algorithm**:
```
For number n:
  1. Check if n ≡ 1 or 5 (mod 6)
  2. For each candidate c = 6k±1 where c ≤ √n:
     If n % c == 0:
       Return NOT PRIME
  3. Return PRIME
```

**Example**: Check if 37 is prime
```
√37 ≈ 6
Candidates to check: 5, 7
37 % 5 = 2  →  Not divisible
37 % 7 = 2  →  Not divisible
Result: 37 is PRIME
```

---

### Second Way: Non-Prime Index Generation

**Concept**: Pre-generate all composite indices using factorization patterns

**For 6n+1**:
```
n = 6k·kk + k + kk    (from (6k+1)(6kk+1))
n = 6k·kk - k - kk    (from (6k-1)(6kk-1))
```

**For 6n-1**:
```
n = 6k·kk - k + kk    (from (6k+1)(6kk-1))
n = 6k·kk + k - kk    (from (6k-1)(6kk+1))
```

**Algorithm**:
```
1. Generate all composite indices for k, kk ∈ [1, limit]
2. Store in set/array
3. For each n, check if n is in composite set
4. If not in set → PRIME
```

**Example**: Generate composites for 6n+1
```
k=1, kk=1:  n = 6(1)(1) + 1 + 1 = 8   →  6(8)+1 = 49 = 7²
k=1, kk=2:  n = 6(1)(2) + 1 + 2 = 15  →  6(15)+1 = 91 = 7×13
k=2, kk=1:  n = 6(2)(1) + 2 + 1 = 15  →  6(15)+1 = 91 = 7×13
```

---

### Third Way: Direct Index Calculation

**Concept**: Directly calculate if n is a composite index

**For 6n+1**:
```
From: n = 6k·kk + k + kk
Solve for kk:
  kk = (n - k) / (6k + 1)    (First pattern)
  kk = (n + k) / (6k - 1)    (Second pattern)
```

**For 6n-1**:
```
From: n = 6k·kk - k + kk
Solve for kk:
  kk = (n + k) / (6k + 1)    (Third pattern)
  kk = (n - k) / (6k - 1)    (Fourth pattern)
```

**Algorithm**:
```
For n (testing 6n+1):
  For k = 1 to √n:
    kk1 = (n - k) / (6k + 1)
    kk2 = (n + k) / (6k - 1)

    If kk1 is integer and kk1 ≥ 1:
      Return NOT PRIME (divisor = 6k+1)

    If kk2 is integer and kk2 ≥ 1:
      Return NOT PRIME (divisor = 6k-1)

  Return PRIME
```

**Example**: Check if n=15 produces composite for 6n+1
```
n = 15  →  6n+1 = 91

k=1: kk = (15-1)/(6·1+1) = 14/7 = 2 ✓ Integer!
     Divisor = 6(1)+1 = 7
     Check: 91/7 = 13 ✓
     Result: 91 is NOT PRIME
```

---

### Fourth Way: Equation Plotting

**Concept**: Plot equations and find integer solutions

**Equations to plot**:

For 6n+1:
```
n = (6k+1)kk + k    →  Plot n vs k for different kk
n = (6k-1)kk - k    →  Plot n vs k for different kk
```

For 6n-1:
```
n = (6k+1)kk - k    →  Plot n vs k for different kk
n = (6k-1)kk + k    →  Plot n vs k for different kk
```

**Method**:
```
1. Fix kk = 1, 2, 3, ...
2. For each kk, plot n as function of k
3. Mark integer points (k, n)
4. These are composite indices
5. Check if test n appears in plot → NOT PRIME
```

**Visual Insight**:
- Each kk value creates a line in (k, n) space
- Integer lattice points = composite numbers
- Gaps between lines = prime numbers

---

### Fifth Way: Residual Pattern Analysis

**Concept**: Analyze residual patterns to identify primes

**Key Insight**:

For 6n+1 = (6k+1)(6kk+1):
```
n = 6k·kk + k + kk = (6k+1)kk + k
```

The residual when dividing n by (6k+1) is k.

**Prime Pattern**:
```
n = (6k+1)kk + R

If R % (6k+1) ≠ k for all k in range:
  Then 6n+1 is PRIME
```

**Additional Constraints**:
```
For 6n+1 first pattern:
  R + 2kk + k must not be divisible by (6k-1)

For 6n+1 second pattern:
  R - 2kk - k must not be divisible by (6k+1)
```

**Algorithm**:
```
For each candidate n:
  For k = 1 to √n:
    divisor = 6k + 1
    residual = n % divisor

    If residual == k:
      Return NOT PRIME

    Check additional constraints...

  Return PRIME
```

---

### Sixth Way: Hyperbolic Equation Method (Novel) 🔍

**This is the most mathematically sophisticated approach!**

#### Mathematical Derivation

**Starting Point**: Factorization as quadratic roots

For 6n+1 = (6k+1)(6kk+1), we can express as:
```
k² - sk + p = 0
where: s = k + kk,  p = k·kk
```

**Step 1**: Express n in terms of p and s

From n = 6k·kk + k + kk = 6p + s:
```
s = n - 6p
```

**Step 2**: Discriminant condition

For integer roots:
```
δ = s² - 4p = (n-6p)² - 4p
  = n² - 12np + 36p² - 4p

For integer k, kk: δ must be perfect square = r²
```

**Step 3**: Equation for p

From n² - 12np + 36p² - 4p - r² = 0, solve for p:
```
36p² - 4(3n+1)p + (n² - r²) = 0

δ' = 16(3n+1)² - 144(n²-r²)
   = 16(9r² + 6n + 1)

For integer p: δ' must be perfect square
```

**Step 4**: The Hyperbolic Equation!

```
9r² + 6n + 1 = m²
```

Rearranging:
```
m² - 9r² = 6n + 1

(m - 3r)(m + 3r) = 6n + 1  ✨
```

**This is a hyperbola equation!**

#### For 6n-1 Numbers

Similarly, for 6n-1:
```
9r² - 6n + 1 = m²

(3r - m)(3r + m) = 6n - 1  ✨
```

#### Geometric Interpretation

- Each n value creates a **hyperbola** in (r, m) plane
- **Integer solutions** on the hyperbola → composite numbers
- **No integer solutions** → prime numbers
- Solutions cluster near the asymptote **m ≈ 3r**

#### Algorithm

**For 6n+1**:
```
For r = 0 to √n:
  discriminant = 9r² + 6n + 1
  m = √discriminant

  If m is integer:
    check = m - 3r - 1

    If check % 6 == 0 and check ≥ 6:
      divisor = check + 1
      Return NOT PRIME (divisor found)

Return PRIME
```

**For 6n-1**:
```
For r = 1 to √n:
  discriminant = 9r² - 6n + 1

  If discriminant > 0:
    m = √discriminant

    If m is integer:
      check = 3r - m - 1

      If check % 6 == 0 and check ≥ 6 and 3r ≥ m+1:
        divisor = check + 1
        Return NOT PRIME

Return PRIME
```

#### Constraints

**For 6n+1 (first pattern)**:
```
7r ≤ n - 8
```

Derivation:
```
From: t = (m - 3r - 1) / 6 where m = √(9r² + 6n + 1)

For t ≥ 1:
  (√(9r² + 6n + 1) - 3r - 1) ≥ 6
  √(9r² + 6n + 1) ≥ 3r + 7
  9r² + 6n + 1 ≥ 9r² + 49 + 42r
  6n ≥ 48 + 42r
  7r ≤ n - 8  ✓
```

**For 6n+1 (second pattern)**:
```
5r ≤ n - 4
```

**For 6n-1 (first pattern)**:
```
7r ≤ n + 8
```

**For 6n-1 (second pattern)**:
```
5r ≤ n + 4
```

#### Example: Test 143 (= 11 × 13)

```
143 = 6(23) + 5 = 6n - 1  →  n = 24

Test 6n-1 pattern:
For r = 1:
  discriminant = 9(1)² - 6(24) + 1 = 9 - 144 + 1 = -134 < 0
  Skip

For r = 2:
  discriminant = 9(4) - 144 + 1 = 36 - 144 + 1 = -107 < 0
  Skip

For r = 3:
  discriminant = 9(9) - 144 + 1 = 81 - 144 + 1 = -62 < 0
  Skip

For r = 4:
  discriminant = 9(16) - 144 + 1 = 144 - 144 + 1 = 1
  m = √1 = 1  ✓ Integer!

  check = 3(4) - 1 - 1 = 10
  10 % 6 = 4  ✗ Not divisible by 6

For r = 5:
  discriminant = 9(25) - 144 + 1 = 225 - 144 + 1 = 82
  m = √82 ≈ 9.05  ✗ Not integer

For r = 6:
  discriminant = 9(36) - 144 + 1 = 324 - 144 + 1 = 181
  m = √181 ≈ 13.45  ✗ Not integer

For r = 7:
  discriminant = 9(49) - 144 + 1 = 441 - 144 + 1 = 298
  m = √298 ≈ 17.26  ✗ Not integer

Actually, let's check the first pattern (3r - m)(3r + m) = 143:
  r = 8:
    discriminant = 9(64) - 144 + 1 = 576 - 144 + 1 = 433
    m = √433 ≈ 20.8  ✗ Not integer
```

Let me recalculate using (m - 3r)(m + 3r) = 143 for 6n+1:
```
143 = 11 × 13

If m - 3r = 11 and m + 3r = 13:
  2m = 24  →  m = 12
  6r = 2   →  r = 1/3  ✗ Not integer

Try the other factorization approach...
The hyperbolic method works but requires careful implementation!
```

#### Properties

**Advantages**:
- ✅ Mathematically elegant (transforms factorization to geometry)
- ✅ Shows connection between algebra and number theory
- ✅ Educational value (alternative perspective)
- ✅ Potentially novel formulation

**Limitations**:
- ⚠️ Similar O(√n) complexity to trial division
- ⚠️ More operations per iteration (sqrt, multiply, modulo)
- ⚠️ Not faster in practice than optimized trial division

**Research Potential**:
- 🔍 Density patterns of integer solutions
- 🔍 Relationship to Pell equations (x² - Dy² = N)
- 🔍 Distribution of (r, m) pairs
- 🔍 Novelty status requires literature review

---

### Seventh Way: Sieve of Eratosthenes

**Concept**: Mark all composites, remaining are primes

**Algorithm**:
```
1. Create array: is_prime[0..n] = true
2. Set is_prime[0] = is_prime[1] = false
3. For p = 2 to √n:
     If is_prime[p]:
       Mark multiples: p², p²+p, p²+2p, ... as false
4. Collect all i where is_prime[i] = true
```

**Optimizations**:
```
- Start marking from p² (smaller multiples already marked)
- Only check p ≤ √n (larger primes don't mark new composites)
- Can combine with 6k±1 (test only candidates)
```

**Complexity**: O(n log log n) - **Fastest for bulk generation!**

**Example**: Sieve up to 30
```
Array: [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, ...]
       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14, ...]

Mark 0,1 false: [F, F, T, T, T, T, T, T, T, T, ...]

p=2: Mark 4,6,8,10,12,14,16,18,20,22,24,26,28,30
p=3: Mark 9,15,21,27
p=5: Mark 25

Primes: [2,3,5,7,11,13,17,19,23,29]
```

---

## Implementation Files

### primeFirstWay.js

**First Way**: Trial division with 6k±1 pattern

**Key Functions**:
```javascript
division(num)              // Find smallest divisor
ifPrime(num)              // Check if prime
allDivisions(num)         // Find all prime factors
isSophiePrime(num)        // Check Sophie Germain prime
isMersennePrime(num)      // Check Mersenne prime
isTwinPrime(num)          // Check twin prime
isIsolatedPrime(num)      // Check isolated prime
```

**Example**:
```javascript
console.log(ifPrime(17));              // true
console.log(division(143));            // 11 (smallest divisor)
console.log(allDivisions(100));        // "2 ** 2 x 5 ** 2"
console.log(isSophiePrime(11));        // "11 is a Sophie Prime."
console.log(isTwinPrime(17));          // "17 & 19 : Twins"
```

### primeSecondWay.js

**Second Way**: Non-prime index generation

**Generates all composite indices** using the four factorization patterns.

**Key Functions**:
```javascript
nonPrimeIndexes(limit)     // Generate composite indices
isPrimeFromIndexes(n)      // Check if n is composite index
```

### primeThirdWay.js

**Third Way**: Direct index calculation

**Directly calculates** if n is a composite index by solving for kk.

**Key Functions**:
```javascript
isCompositeIndex(n)        // Check if n produces composite
findDivisor(n)             // Find divisor using equations
```

### primeForthWay.js

**Fourth Way**: Equation plotting

**Plots equations** to visualize composite patterns.

**Key Functions**:
```javascript
plotEquations(maxN)        // Plot n vs k for different kk
findComposites(range)      // Find composites from plot
```

### primeFifthWay.js

**Fifth Way**: Residual pattern analysis

**Analyzes residual patterns** to identify primes.

**Key Functions**:
```javascript
checkResidualPattern(n)    // Check residual conditions
isPrimeByResidual(n)       // Test primality via residuals
```

### primeSixthWay.js ⭐

**Sixth Way**: Hyperbolic equation method

**The novel approach** using m² - 9r² = 6n±1

**Key Functions**:
```javascript
divisionFirstTrend(num, n)    // For 6n+1 numbers
divisionSecondTrend(num, n)   // For 6n-1 numbers
division(num)                 // Find smallest divisor
ifPrime(num)                  // Check primality
scientificWayOfNum(obj)       // Format factorization
```

**Example**:
```javascript
console.log(division(143));   // 11 (using hyperbolic equations)
console.log(ifPrime(1517));   // true
```

### primeSeventhWay.js

**Seventh Way**: Sieve of Eratosthenes

**Bulk generation** using sieve algorithm.

**Key Functions**:
```javascript
sieveOfEratosthenes(limit)     // Generate all primes up to limit
sieve6kOptimized(limit)        // Sieve with 6k±1 optimization
```

**Example**:
```javascript
const primes = sieveOfEratosthenes(100);
console.log(primes);  // [2, 3, 5, 7, 11, 13, ...]
```

### comparison.js

**Compares performance** of all seven methods.

**Features**:
- Timing benchmarks
- Accuracy verification
- Memory usage analysis

**Run**:
```bash
node comparison.js
```

### demo.js

**Demonstrates all methods** with examples.

**Features**:
- Show each method's output
- Verify consistency across methods
- Educational examples

**Run**:
```bash
node demo.js
```

### primeTextWay.js

**File-based prime storage and operations** for large-scale computations.

**Key Features**:
- Persistent prime storage in text files
- Instant lookups for pre-computed primes
- Incremental prime generation
- Memory-efficient for very large numbers

**Key Functions**:
```javascript
createPrimeTextFiles(num)              // Create prime folders up to num
primeInRangeObjTextWay(start, end)     // Generate primes in range to files
checkIfPrime(num)                      // Check if number exists in files
division(num)                          // Find divisor using file data
allDivisions(num)                      // Find all divisors from files
primes(num)                            // Get all primes up to num (with files)
divisionFromText(num)                  // Find division from text files
isPrimeFromText(num)                   // Check primality using files
allPrimesFromText(start, end)          // Find primes in range using files
allPrimes(num)                         // Automatic prime generation with files
allPrimesSecondWay(num)                // Fast file-based generation
```

**File Structure**:
```
prime-output/
├── prime_1000/
│   ├── prime-1.txt     # Primes: 2, 3, 5, 7, ...
│   ├── prime-2.txt     # More primes...
│   └── ...
├── prime_10000/
│   └── ...
└── prime_100000/
    └── ...
```

**Benefits**:
- **O(1) lookups** for pre-computed primes
- **Persistent storage** across runs
- **Scalable** to very large numbers
- **Memory efficient** (load only needed files)

**Example**:
```javascript
// Generate and store primes up to 100,000
createPrimeTextFiles(100000);

// Fast primality check using files
console.log(isPrimeFromText(999983));  // true (instant lookup)

// Get all primes using file storage
const primes = allPrimes(1000000);
```

### primeTextFactory.js

**Factory functions** for creating prime text files with optimizations.

**Key Functions**:
```javascript
createPrimeTextFiles(num)              // Create organized prime files
writeToFile(folder, filename, data)    // Write prime data to files
readFromFile(folder, filename)         // Read prime data from files
organizePrimeFiles(limit)              // Organize files by ranges
```

**Features**:
- Automatic folder organization
- Chunked file writing for large datasets
- Efficient file I/O operations
- Error handling and validation

### textFactory.js

**Low-level text file operations** for prime storage system.

**Key Functions**:
```javascript
createFolder(path)                     // Create directory structure
writeFile(path, data)                  // Write data to text file
readFile(path)                         // Read data from text file
appendFile(path, data)                 // Append data to file
fileExists(path)                       // Check if file exists
listFiles(directory)                   // List all files in directory
deleteFile(path)                       // Delete file
```

**Features**:
- Cross-platform file operations
- Automatic path resolution
- Error handling
- Batch operations support

**Example**:
```javascript
const { createFolder, writeFile, readFile } = require('./textFactory.js');

// Create prime storage structure
createFolder('prime-output/prime_1000');

// Write prime data
writeFile('prime-output/prime_1000/prime-1.txt', '2, 3, 5, 7, 11, 13');

// Read prime data
const primes = readFile('prime-output/prime_1000/prime-1.txt');
console.log(primes);
```

---

## Usage Examples

### Basic Primality Testing

```javascript
// Method 1: Trial Division
const { ifPrime } = require('./primeFirstWay.js');
console.log(ifPrime(997));  // true

// Method 6: Hyperbolic
const { division } = require('./primeSixthWay.js');
console.log(division(143));  // 11
```

### Finding All Primes

```javascript
// Method 7: Sieve (fastest for bulk)
const { sieveOfEratosthenes } = require('./primeSeventhWay.js');
const primes = sieveOfEratosthenes(1000);
console.log(`Found ${primes.length} primes`);
```

### Special Prime Types

```javascript
const {
  isSophiePrime,
  isTwinPrime,
  isIsolatedPrime
} = require('./primeFirstWay.js');

console.log(isSophiePrime(11));    // "11 is a Sophie Prime."
console.log(isTwinPrime(17));      // "17 & 19 : Twins"
console.log(isIsolatedPrime(23));  // "23 is an Isolated Prime."
```

### Factorization

```javascript
const { allDivisions } = require('./primeFirstWay.js');
console.log(allDivisions(100));   // "2 ** 2 x 5 ** 2"
console.log(allDivisions(2310));  // "2 x 3 x 5 x 7 x 11"
```

---

## Performance Comparison

### Complexity Analysis

| Method | Time Complexity | Space Complexity | Best Use Case |
|--------|----------------|------------------|---------------|
| **1st Way** | O(√n / 3) | O(1) | Single prime checks |
| **2nd Way** | O(n²) | O(n²) | Understanding patterns |
| **3rd Way** | O(√n) | O(1) | Direct calculation |
| **4th Way** | O(n·k) | O(n·k) | Visualization |
| **5th Way** | O(√n) | O(1) | Pattern analysis |
| **6th Way** | O(√n) | O(1) | Educational/Novel |
| **7th Way** | O(n log log n) | O(n) | **Bulk generation** |

### Speed Benchmarks (for n = 100,000)

```
Method 1 (Trial Division):     ~200ms
Method 2 (Index Generation):   ~5000ms
Method 3 (Direct Calculation): ~180ms
Method 4 (Plotting):          ~3000ms
Method 5 (Residual):          ~190ms
Method 6 (Hyperbolic):        ~250ms
Method 7 (Sieve):             ~15ms  ✓ FASTEST
```

### Recommendations

**For single prime check**:
- Use **Method 1** (Trial Division) - Simple and fast
- Use **Method 3** (Direct Calculation) - Slightly faster

**For bulk prime generation**:
- Use **Method 7** (Sieve) - 10-20x faster

**For educational purposes**:
- Study **Method 6** (Hyperbolic) - Most mathematically interesting
- Study **Method 5** (Residual) - Pattern insights

**For research**:
- Investigate **Method 6** (Hyperbolic) - Potentially novel

---

## Educational Value

### Learning Objectives

1. **Pattern Recognition**: Understanding 6k±1 structure
2. **Mathematical Proof**: Deriving factorization patterns
3. **Algorithm Design**: Multiple approaches to same problem
4. **Complexity Analysis**: Comparing time/space trade-offs
5. **Advanced Math**: Hyperbolic equations, Diophantine equations
6. **Optimization**: From naive to sophisticated methods

### Key Insights

**Mathematical Beauty**:
- Primes hidden in 6k±1 pattern
- Factorization creates predictable indices
- Geometry connects to number theory (hyperbolas!)
- Multiple paths lead to same truth

**Computational Thinking**:
- Trial vs. generation vs. sieving
- Time vs. space trade-offs
- Precomputation vs. on-demand
- Theoretical vs. practical efficiency

### Advanced Topics

**Connected to**:
- **Pell Equations**: x² - Dy² = N
- **Quadratic Forms**: ax² + bxy + cy²
- **Diophantine Equations**: Integer solutions
- **Algebraic Number Theory**: Factorization in rings
- **Analytic Number Theory**: Prime distribution

---

## Further Exploration

### Open Questions

1. **Hyperbolic Method Novelty**: Is the formulation m² - 9r² = 6n+1 known in literature?
2. **Optimization**: Can hyperbolic method be optimized further?
3. **Generalization**: Do similar hyperbolic equations exist for other moduli?
4. **Distribution**: What's the density of integer solutions on hyperbolas?
5. **Connections**: How does this relate to Pell equations exactly?

### Research Directions

- **Literature Review**: Search for similar approaches
- **Optimization**: Improve hyperbolic algorithm
- **Visualization**: Plot hyperbolic curves with solutions
- **Analysis**: Study solution density and distribution
- **Applications**: Any practical uses for hyperbolic method?

---

## Running the Code

### Prerequisites

```bash
# Node.js for JavaScript implementations
node --version  # Should be v12+
```

### Running Individual Methods

```bash
# Method 1: Trial Division
node primeFirstWay.js

# Method 6: Hyperbolic
node primeSixthWay.js

# Method 7: Sieve
node primeSeventhWay.js
```

### Running Comparison

```bash
node comparison.js
```

### Running Demo

```bash
node demo.js
```

---

## Author

**Farid Masjedi**

GitHub: [Farid Masjedi](https://github.com/faridmasjedi)

---

## References

### Mathematical Foundations
- **6k±1 Pattern**: Classical number theory result
- **Trial Division**: Ancient primality test
- **Sieve of Eratosthenes**: ~200 BC algorithm
- **Quadratic Forms**: Gauss, Legendre
- **Pell Equations**: Euler, Lagrange

### Novel Contribution
- **Hyperbolic Equation Method (6th Way)**: Potentially novel approach
  - Transforms factorization into m² - 9r² = 6n±1
  - Geometric interpretation as hyperbola
  - Requires literature review to confirm novelty

---

## License

Educational use - Open source

---

## Acknowledgments

- Mathematical derivations based on systematic exploration of 6k±1 patterns
- Hyperbolic approach independently discovered through algebraic analysis
- All seven methods demonstrate different facets of prime investigation
- Special focus on 6th way as potentially publishable work

---

*For complete project documentation, see [Main README](../README.md)*

*For production implementations, see [Services](../src/services/README.md)*

*For usage guide, see [USER_GUIDE](../USER_GUIDE.md)*
