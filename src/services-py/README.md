# Prime Number Utilities

A comprehensive set of utilities and methods for generating, validating, and analyzing prime numbers. These utilities leverage mathematical optimizations and file-based data storage to ensure efficient computations for large-scale prime-related operations.

---

## Table of Contents

- [Features](#features)
- [Core Functions](#core-functions)
  - [Prime.py](#primepy)
  - [PrimeIndex.py](#primeindexpy)
  - [PrimeText.py](#primetextpy)
  - [PrimeUtils.py](#primeutilspy)
  - [TextUtils.py](#textutilspy)
- [Performance Highlights](#performance-highlights)
- [Usage Examples](#usage-examples)
- [Contributors](#contributors)

---

## Features

- **Prime Validation**: Check if a number is a prime or belongs to special prime categories like Sophie primes, Mersenne primes, twin primes, and isolated primes.
- **Efficient Generation**: Generate prime numbers up to a given limit using optimized methods like the Sieve of Eratosthenes and 6k ± 1 rule.
- **File-based Storage**: Store and retrieve pre-computed primes for scalability and quick access.
- **Range Operations**: Count and list primes within specified ranges or split them into manageable chunks.
- **Prime Factorization**: Express numbers in terms of their prime factors.
- **Divisor Analysis**: Calculate all divisors of a number using prime decomposition.

---

## Core Functions

### Prime.py

- `is_prime(num)`: Check if a number is a prime using the 6k ± 1 rule.
- `is_sophie_prime(num)`: Determine if a number is a Sophie prime.
- `is_mersenne_prime(num)`: Validate if a number is a Mersenne prime.
- `is_twin_prime(num)`: Check if a number is a twin prime with its nearest neighbors.
- `is_isolated_prime(num)`: Identify if a number is an isolated prime.
- `primes_count(num)`: Count primes up to a given number.
- `list_primes(num)`: List all primes up to a given number.
- `primes_in_range(start, end)`: Find primes within a specific range.
- `primes_in_chunks(start, end, chunk_size)`: Split primes within a range into chunks of a specified size.

---

### PrimeIndex.py

- `calculate_non_prime_indices(k2, t)`: Compute indices for non-prime numbers.
- `read_non_prime_indices_from_file(file_path)`: Read non-prime indices from a file.
- `generate_non_prime_indices(number, k2, t)`: Generate non-prime indices for a number.
- `calculate_primes(number)`: Calculate all primes up to a given number.
- `copy_from_other_folder(number, root_folder, num_folder)`: Copy prime-related data from an existing folder.
- `calculate_primes_text(number)`: Generate prime data for a specific number or copy from existing data.

---

### PrimeText.py

- `prime_range(start, end)`: List primes within a specified range.
- `count_prime_in_range(start, end)`: Count primes within a specified range.
- `generate_primes(number)`: Generate primes up to a given number.
- `check_divisor_not_exist_on_text_files(number, sqrt_number, current)`: Check divisors for a number using precomputed data.
- `is_prime_from_text_files(num)`: Determine if a number is prime using file-based data.
- `generate_primes_files(num)`: Generate prime files up to a specific number.
- `get_all_divisors(number)`: Find all divisors of a number using prime factorization.
- `count_primes_up_to(limit)`: Count primes up to a specific limit using the Sieve of Eratosthenes.

---

### PrimeUtils.py

- `create_prime_folder(number)`: Create a folder for storing primes associated with a number.
- `write_prime_file(folder_number, filename, data)`: Write data to a prime output file.
- `get_sorted_prime_folders()`: Retrieve all prime folders sorted by numeric suffix.
- `get_last_prime_folder()`: Get the last folder containing prime data.
- `check_divisor_from_files(num, folder)`: Check if a number is divisible by primes listed in a folder.
- `generate_primes_up_to(number)`: Generate primes up to a given number and store them in files.

---

### TextUtils.py

- `num_folder_exist(number)`: Check if a folder for a specific number exists.
- `create_folder(parent_path, parent_name, child_name)`: Create a nested folder structure if it doesn’t exist.
- `write_text_file(folder_path, file_name, data)`: Write data to a text file.
- `list_files_and_folders(folder_path)`: List all files and folders in a directory.
- `find_folder_for_number(number, folder_path)`: Find the appropriate folder for a specific number.
- `file_contains_text(file_path, text)`: Check if a file contains a specific text.
- `search_files_up_to_number(folder_path, number)`: Search files containing numbers up to a specific limit.

---

## Performance Highlights

This project employs advanced optimization techniques, such as:

- **6k ± 1 Rule**: Efficiently narrows down prime candidates.
- **File-based Storage**: Saves precomputed primes for reuse.
- **Sieve of Eratosthenes**: Quickly generates primes up to large limits.
- **Incremental Updates**: Adds primes to existing datasets without recomputation.

---

## Usage Examples

### Prime Validation
```python
from prime import is_prime

print(is_prime(29))  # Output: True
print(is_prime(100))  # Output: False
```

---

## Generating Primes
```python
from prime import list_primes

primes = list_primes(50)
print(primes)  # Output: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

```

---

## Prime Factorization
```python
from prime import prime_factorization

print(prime_factorization(100))  # Output: "2**2 * 5**2"
```

---

## Range Operations
```python
from prime import primes_in_range

print(primes_in_range(10, 30))  # Output: [11, 13, 17, 19, 23, 29]
```

---

## Contributors

- Primary Developer: [Farid Masjedi](https://github.com/faridmasjedi)

## Versions

- Version 1
    
    - Last Update: 03.12.2024