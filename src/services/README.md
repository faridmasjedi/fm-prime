# Prime Number Operations and File Management Module

---

## Overview

This project is a comprehensive toolkit for managing prime number operations and file-based data handling. It includes utilities for prime generation, primality testing, file handling, and partition-based computations. Designed to handle large datasets efficiently, this toolkit is suitable for research, educational purposes, and performance-intensive applications.

---

## Features

### Prime Number Operations
- **Generate primes up to a limit**: Efficient generation of large prime datasets.
- **Check primality**: Advanced algorithms for verifying if a number is prime.
- **Prime categorization**: Identifies Sophie primes, twin primes, and isolated primes.

### File Management Utilities
- **Structured folder and file management**: Automates creation and organization of output directories.
- **Data writing and reading**: Handles file I/O operations with robust data integrity checks.
- **File parsing and sorting**: Efficiently organizes files based on numeric suffixes or other criteria.

### Recursive and Partitioned Processing
- **Partitioned processing**: Breaks computations into manageable parts for large ranges.
- **Recursive primality tests**: Leverages file-based data for scalable primality checks.

---

## Modules and Key Functions

### Math Operations
- **Basic arithmetic operations**: Addition, subtraction, multiplication, division, and power calculations.
- **Specialized utilities**: Square root approximation, modular arithmetic, and candidate generation for primes.

### File Operations
- **`getAllFromDirectory(source)`**: Retrieves all files and directories from the specified path.
- **`createOutputFolder(number)`**: Creates a structured output folder for the given number.
- **`writeDataToFile(folderName, filename, data)`**: Writes sorted and filtered data to specified files.

### Prime Generators
- **`generatePrimesUpTo(number)`**: Generates all primes up to a given number and writes to files.
- **`generatePrimesInRange(start, end)`**: Generates primes within a specific range using optimized algorithms.
- **`generatePrimeOutputFromText(num)`**: Generates prime output data from existing text files.

### Primality Checkers
- **`isPrime(number)`**: Checks if a number is prime using basic and partitioned rules.
- **`isPrimeFromTextFilesRecursive(num)`**: Recursively determines primality using file-based datasets.
- **`isSophiePrime(number)`**: Checks if a number is a Sophie prime.
- **`isTwinPrime(number)`**: Determines if a number is part of a twin prime pair.
- **`isIsolatedPrime(number)`**: Identifies isolated primes.

### Divisor Calculators
- **`calculateDivisors(num)`**: Computes all divisors of a number using prime factorization.
- **`calculateDivisorsUsingText(num)`**: Uses pre-generated text files to calculate divisors efficiently.

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Ensure Node.js and its dependencies are installed.

3. Install required dependencies:
    ```bash
    npm install
    ```


---

## Usage Examples

### Prime Generation
Generate all primes up to a large number and write results to files:
```javascript
generatePrimesUpTo("1000000");
``` 

### Primality Testing
Check if a number is prime using recursive file-based checks:
```javascript
const isPrime = isPrimeFromTextFilesRecursive("997");
console.log(isPrime); // Outputs: true or false
``` 

### File Handling
Create an output folder and write data to a file:
```javascript
const folderName = createOutputFolder("100000");
writeDataToFile(folderName, "OutputPrimes.txt", "2, 3, 5, 7, 11");
``` 

### Divisor Calculation
Compute divisors using pre-existing data files:
```javascript
const divisors = calculateDivisorsUsingText("100");
console.log(divisors); // Outputs: [1, 2, 4, 5, 10, 20, 25, 50, 100]
``` 
    

---

## Folder Structure
- `output-big`: Stores generated prime outputs and other computation data.
- `not-prime-indexes`: Handles storage for non-prime indices and patterns.
- `OutputPattern1.txt`: Contains the first pattern data for non-prime indices.
- `OutputPattern2.txt`: Contains the second pattern data for non-prime indices.
- `OutputPrimes.txt`: Stores computed prime numbers.

---

## Advanced Features

- <b>Recursive Prime Generation</b>: Combines recursive logic and file management for extending datasets dynamically.
- <b>Partitioned Prime Checks</b>: Optimized for performance across large ranges by dividing tasks into manageable sections.
- <b>Automated File Formatting</b>: Ensures data consistency when extending prime datasets.

---

## Contributors

- Primary Developer: [Farid Masjedi](https://github.com/faridmasjedi)

## Versions

- Version 1
    
    - Last Update: 03.12.2024
