# Prime Number Analysis and Generator Module

---

## Overview

This module provides a comprehensive suite of functions and utilities for prime number analysis, primality testing, prime generation, and divisor calculations. Designed for efficiency, it includes various optimized and recursive methods to handle large-scale computations and file-based datasets.

---

## Features

### Primality Testing
- **Basic Primality Tests**:
  - `isPrime`: Standard method for primality checking, slower for large numbers.
  - `isPrimeUsingFiles`: Uses pre-existing prime data files for quicker checks.
  - `isPrimeFromTextFiles`: Leverages file-based prime datasets for efficient primality tests.
- **Advanced Recursive Primality**:
  - `isPrimeFromTextFilesRecursive`: Efficient recursive approach for large datasets.
  - `isPrimeFromTextRecursive`: Combines file-based data with recursive logic for enhanced performance.
  - `isPrimeFromTextFilesRecursiveUpdated`: An optimized version of recursive checks for quicker results.

### Divisor Calculation
- **Divisor Analysis**:
  - `calculateDivisors`: Finds divisors using prime patterns.
  - `calculateDivisorsUsingText`: Utilizes file-based datasets for efficient divisor calculations.
  - `calculateDivisorsUpdated`: Optimized version of `calculateDivisors` for faster results.

### Prime Generation
- **Generate Primes in a Range**:
  - `generatePrimesInRange`: Generates primes within a given range using iterative methods.
  - `generatePrimesInRangeUpdated`: Faster version of `generatePrimesInRange`.
  - `generatePrimesInRangeTextFiles`: Leverages file-based datasets for range generation.
  - `generatePrimesInRangeTextFilesUpdated`: Optimized file-based range generation.

- **Generate Primes Up to a Limit**:
  - `generatePrimesUpTo`: Iterative prime generation up to a specified number.
  - `generatePrimesUpToUpdated`: Optimized version of `generatePrimesUpTo`.
  - `generatePrimesUpToRecursive`: Recursive method for prime generation starting from 2.
  - `generatePrimesUpToRecursiveUpdated`: Faster recursive prime generation.
  - `generatePrimesRecursiveUpdated`: The quickest method for recursive generation.

- **File-Based Prime Generation**:
  - `generatePrimeOutputFromText`: Creates output files for primes based on existing datasets.
  - `generatePrimesFiles`: Automatically creates prime datasets for specified limits.
  - `generatePrimesFilesUpdated`: Optimized version of `generatePrimesFiles`.

### Quick Primality and Divisor Checks
- `checkAndExplainPrimeStatus`: Provides detailed explanations of primality.
- `checkAndExplainPrimeStatusUpdated`: Faster version for primality checks and explanations.

### Fast Prime Index Calculation
- `calculatePrimesText`: The quickest method for determining prime indices, leveraging all optimizations.

---

## Key Methods and Optimizations

1. **Recursive Algorithms**:
   - Methods like `isPrimeFromTextFilesRecursive` and `generatePrimesRecursiveUpdated` use recursion and file-based datasets for large-scale computations.

2. **File-Based Datasets**:
   - Methods like `isPrimeFromTextFiles` and `generatePrimeOutputFromText` rely on pre-existing datasets, minimizing redundant computations.

3. **Optimized Divisor Calculations**:
   - Functions like `calculateDivisorsUsingText` utilize existing files to speed up divisor analysis.

4. **Partitioned Prime Checks**:
   - Methods like `generatePrimesInRangeUpdated` divide computations into manageable partitions for better performance.

---

## Usage

### Primality Testing
Check if a number is prime with detailed explanations:
```javascript
import { checkAndExplainPrimeStatusUpdated } from "../services/helper.mjs";

const result = checkAndExplainPrimeStatusUpdated("997");
console.log(result); // Outputs whether the number is prime or not with details
```

---

## Prime Generation
Generate all primes up to a number:
```javascript
import { generatePrimesUpToUpdated } from "../services/primeGenerator.mjs";

generatePrimesUpToUpdated("100000");
```

---

## Divisor Calculation
Calculate divisors using file-based datasets:
```javascript
import { calculateDivisorsUsingText } from "../services/numberDivisors.mjs";

const divisors = calculateDivisorsUsingText("100");
console.log(divisors); // Outputs divisors of the number

```

---

## Fastest Prime Calculation
Quickly calculate primes using the most optimized method:
```javascript
import { calculatePrimesText } from "../services/primeIndex.mjs";

calculatePrimesText("1000000");
```

---

## Performance Comparison

## Performance Comparison

| **Method**                                | **Description**                                             | **Speed**       |
|-------------------------------------------|-------------------------------------------------------------|-----------------|
| `isPrime`                                 | Basic primality check                                       | Slow            |
| `isPrimeUsingFiles`                       | Uses file-based datasets                                    | Faster          |
| `isPrimeFromTextFilesRecursiveUpdated`    | Combines recursive and file-based approaches               | Fastest         |
| `generatePrimesUpTo`                      | Iterative generation of primes                             | Slow            |
| `generatePrimesRecursiveUpdated`          | Optimized recursive generation                              | Fastest         |
| `calculateDivisors`                       | Finds divisors using prime patterns                        | Slow            |
| `calculateDivisorsUsingText`              | File-based divisor calculation                              | Fastest         |
| `calculatePrimesText`                     | Combines all optimizations for prime generation            | Fastest         |

---

## Contributors

- Primary Developer: [Farid Masjedi](https://github.com/faridmasjedi)

## Versions

- Version 1
    
    - Last Update: 03.12.2024
