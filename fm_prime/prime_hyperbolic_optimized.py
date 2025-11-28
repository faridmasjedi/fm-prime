"""
OPTIMIZED HYPERBOLIC PRIME DETECTION WITH CACHING
==================================================

Two-way search hyperbolic equation approach with intelligent file-based caching.
This is the Python port of the optimized JavaScript implementation.

KEY IMPROVEMENTS OVER OLD VERSION:
1. ✅ Two-way search (bottom-up + top-down) for O(√N) guarantee
2. ✅ Modular square filters (mod 64, 63, 65) eliminate ~94% of non-squares
3. ✅ File-based caching via output-big folder system
4. ✅ Seamless integration with existing file infrastructure

MATHEMATICAL FOUNDATION:
For numbers of form 6n±1, we solve hyperbolic equations:
  - 6n+1: m² - 9r² = 6n+1
  - 6n-1: 9r² - m² = 6n-1

TWO-WAY SEARCH STRATEGY:
1. Bottom-Up: Check r = 0, 1, 2... (finds factors near √N)
2. Top-Down: Check k = 6i±1 for small i (finds small factors)

This guarantees finding factors in O(√N) steps, solving the performance
bottleneck for numbers with small factors.

MODULAR FILTERS:
Perfect squares can only have certain remainders modulo N.
By checking mod 64, 63, and 65, we eliminate most non-squares
before computing expensive square roots.
"""

import math
import os
import json
from pathlib import Path
from .textUtils import write_primes_to_split_files


# ============================================================================
# CORE HYPERBOLIC ALGORITHM
# ============================================================================

def isqrt(n):
    """
    Integer square root using Newton's method.
    More accurate than int(math.sqrt(n)) for large numbers.
    """
    if n < 2:
        return n

    # For small numbers, use math.sqrt
    if n <= 10**15:
        return int(math.sqrt(n))

    # For large numbers, use Newton's method
    x = n
    y = (x + 1) // 2

    while y < x:
        x = y
        y = (x + n // x) // 2

    return x


# Quadratic residues - possible remainders for perfect squares
QR64 = {0, 1, 4, 9, 16, 17, 25, 33, 36, 41, 49, 57}
QR63 = {0, 1, 4, 7, 9, 16, 18, 22, 25, 28, 36, 37, 43, 46, 49, 58}
QR65 = {0, 1, 4, 9, 10, 14, 16, 25, 26, 29, 30, 35, 36, 39, 40, 49, 51, 55, 56, 61, 64}


def is_square_mod64(n):
    """Check if n could be a perfect square (mod 64)"""
    return (n & 63) in QR64


def is_square_mod63(n):
    """Check if n could be a perfect square (mod 63)"""
    return (n % 63) in QR63


def is_square_mod65(n):
    """Check if n could be a perfect square (mod 65)"""
    return (n % 65) in QR65


def check_factor(num, f):
    """Validate if a factor is a valid divisor"""
    if f > 1 and f < num:
        if (f - 1) % 6 == 0 or (f + 1) % 6 == 0:
            if num % f == 0:
                return f
    return None


def division_hyperbolic(num):
    """
    Find the smallest divisor of a number using hyperbolic equations.
    Two-way search ensures O(√N) complexity.

    Args:
        num: Number to factorize

    Returns:
        Smallest divisor (returns num itself if prime)
    """
    # Fast base cases
    if num % 2 == 0:
        return 2
    if num % 3 == 0:
        return 3
    if num % 5 == 0:
        return 5

    n = (num - 1) // 6 if num % 6 == 1 else (num + 1) // 6
    is_first_trend = (num % 6 == 1)

    # Calculate limits
    limit_a = (n - 8) // 7 if is_first_trend else (n + 8) // 7
    limit_b = (n - 4) // 5 if is_first_trend else (n + 4) // 5
    max_r = max(limit_a, limit_b)

    # Start point for r
    start_r = 0
    if not is_first_trend:
        min_val = (6 * n - 1) // 9
        start_r = isqrt(min_val)

    r = start_r
    k_idx = 1

    n6 = 6 * n
    sqrt_n = isqrt(num)

    # Interleaved two-way search
    while True:
        # Bottom-Up: Check r values (finds factors near sqrt(N))
        if r <= max_r:
            if is_first_trend:
                discriminant = 9 * r * r + n6 + 1
            else:
                discriminant = 9 * r * r - n6 + 1

            # Modular filters eliminate ~94% of non-squares
            if (is_square_mod64(discriminant) and
                is_square_mod63(discriminant) and
                is_square_mod65(discriminant)):

                m = isqrt(discriminant)
                if m * m == discriminant:
                    term3r = 3 * r
                    if is_first_trend:
                        f1 = m - term3r
                        f2 = m + term3r
                    else:
                        f1 = term3r - m
                        f2 = term3r + m

                    d1 = check_factor(num, f1)
                    if d1:
                        return d1
                    d2 = check_factor(num, f2)
                    if d2:
                        return d2
            r += 1

        # Top-Down: Check small factors k
        k1 = 6 * k_idx - 1
        k2 = 6 * k_idx + 1

        if k1 > sqrt_n:
            break

        if k1 > 1 and num % k1 == 0:
            return k1
        if k2 > 1 and num % k2 == 0:
            return k2

        k_idx += 1

    return num


def is_prime_hyperbolic_core(num):
    """
    Check if a number is prime using hyperbolic method (no caching).

    Args:
        num: Number to check

    Returns:
        True if prime, False otherwise
    """
    if num <= 3:
        return num > 1
    if num % 2 == 0 or num % 3 == 0:
        return False

    div = division_hyperbolic(num)
    return div == num


# ============================================================================
# CACHING INFRASTRUCTURE
# ============================================================================

OUTPUT_ROOT = './output-big'


def read_primes_from_folder(folder_path):
    """
    Read all primes from an output folder.

    Args:
        folder_path: Path to the output folder

    Returns:
        List of prime numbers
    """
    if not os.path.exists(folder_path):
        return []

    primes = []

    # Find all output*.txt files (case-insensitive for backward compatibility)
    # Sort numerically by extracting the number from filename
    files = [f for f in os.listdir(folder_path) if (f.startswith('Output') or f.startswith('output')) and f.endswith('.txt')]
    def extract_number(filename):
        import re
        match = re.search(r'(\d+)', filename)
        return int(match.group(1)) if match else 0
    files = sorted(files, key=extract_number)

    for filename in files:
        filepath = os.path.join(folder_path, filename)
        with open(filepath, 'r') as f:
            content = f.read()

            # Parse format: (index) | p1,p2,p3,...
            # Remove index markers and split by commas
            for line in content.split('\n'):
                if '|' in line:
                    # Remove everything before |
                    line = line.split('|', 1)[1]

                # Split by commas and parse
                for prime_str in line.split(','):
                    prime_str = prime_str.strip()
                    if prime_str and prime_str.isdigit():
                        primes.append(int(prime_str))

    return primes


def find_largest_existing_limit():
    """
    Find the largest existing output folder number.

    Returns:
        Largest folder number or None if no folders exist
    """
    if not os.path.exists(OUTPUT_ROOT):
        return None

    folders = [int(f.replace('output-', ''))
               for f in os.listdir(OUTPUT_ROOT)
               if f.startswith('output-') and os.path.isdir(os.path.join(OUTPUT_ROOT, f))]

    return max(folders) if folders else None


def save_primes_to_folder(limit, primes):
    """
    Save primes to output folder using split file system.
    Creates multiple ~1MB files per folder for memory efficiency.

    Args:
        limit: The upper limit used to generate primes
        primes: List of prime numbers
    """
    folder_path = os.path.join(OUTPUT_ROOT, f'output-{limit}')
    os.makedirs(folder_path, exist_ok=True)
    write_primes_to_split_files(folder_path, primes)


def generate_primes_in_range(start, limit):
    """
    Generate primes from a starting point to a limit using hyperbolic method.

    Args:
        start: Starting number (exclusive)
        limit: Upper limit (inclusive)

    Returns:
        List of primes in the range
    """
    primes = []

    # Handle 2 and 3 explicitly first
    if start < 2 <= limit:
        primes.append(2)
    if start < 3 <= limit:
        primes.append(3)

    # Start checking odd numbers from 5
    current = max(5, start + 1)
    if current % 2 == 0:
        current += 1

    for i in range(current, limit + 1, 2):
        if i % 3 != 0 and is_prime_hyperbolic_core(i):
            primes.append(i)

    return primes


# ============================================================================
# PUBLIC API - OPTIMIZED METHODS WITH CACHING
# ============================================================================

def sieve_hyperbolic_optimized(limit):
    """
    Generate all primes up to a limit using cached data when available.

    Strategy:
    1. Check if exact folder exists → load and return
    2. Find largest cache < limit → load and extend from there
    3. Find largest cache > limit → load and filter
    4. No cache → generate from scratch
    5. Always save results for future use

    Args:
        limit: Upper limit for prime generation

    Returns:
        List of all primes up to limit
    """
    if limit < 2:
        return []

    # Check if exact folder exists
    exact_folder = os.path.join(OUTPUT_ROOT, f'output-{limit}')
    if os.path.exists(exact_folder):
        return read_primes_from_folder(exact_folder)

    # Find largest existing cache
    largest_existing = find_largest_existing_limit()

    start_from = 2
    cached_primes = []

    if largest_existing is not None and largest_existing < limit:
        # Use existing cache and continue from there
        cached_folder = os.path.join(OUTPUT_ROOT, f'output-{largest_existing}')
        cached_primes = read_primes_from_folder(cached_folder)
        start_from = largest_existing + 1
    elif largest_existing is not None and largest_existing >= limit:
        # Requested limit is smaller - just filter existing
        cached_folder = os.path.join(OUTPUT_ROOT, f'output-{largest_existing}')
        all_primes = read_primes_from_folder(cached_folder)
        filtered_primes = [p for p in all_primes if p <= limit]

        # Save the filtered results
        save_primes_to_folder(limit, filtered_primes)
        return filtered_primes

    # Generate new primes
    new_primes = generate_primes_in_range(start_from - 1, limit)
    all_primes = cached_primes + new_primes

    # Save to cache
    save_primes_to_folder(limit, all_primes)

    return all_primes


def is_prime_hyperbolic_optimized(num):
    """
    Check if a single number is prime using cached data when beneficial.

    Strategy:
    1. For small numbers (≤ 10,000), use direct hyperbolic check (very fast)
    2. For large numbers:
       - If we have cached primes up to sqrt(n), use trial division with cache
       - Otherwise, use direct hyperbolic method

    Args:
        num: Number to check

    Returns:
        True if prime, False otherwise
    """
    # Base cases
    if num <= 1:
        return False
    if num in (2, 3):
        return True
    if num % 2 == 0 or num % 3 == 0:
        return False

    # For small numbers, direct check is fastest
    if num <= 10000:
        return is_prime_hyperbolic_core(num)

    # For larger numbers, try to use cached primes
    sqrt_n = isqrt(num)
    largest_existing = find_largest_existing_limit()

    if largest_existing is not None and largest_existing >= sqrt_n:
        # We have enough cached primes - use trial division
        cached_folder = os.path.join(OUTPUT_ROOT, f'output-{largest_existing}')
        primes = read_primes_from_folder(cached_folder)

        for p in primes:
            if p > sqrt_n:
                break
            if num % p == 0:
                return False
        return True

    # No suitable cache - use hyperbolic method
    return is_prime_hyperbolic_core(num)


def get_hyperbolic_cache_stats():
    """
    Get statistics about cached prime data.

    Returns:
        Dictionary with cache statistics
    """
    if not os.path.exists(OUTPUT_ROOT):
        return {
            'folders': 0,
            'largest_limit': None,
            'available_limits': []
        }

    folders = [int(f.replace('output-', ''))
               for f in os.listdir(OUTPUT_ROOT)
               if f.startswith('output-') and os.path.isdir(os.path.join(OUTPUT_ROOT, f))]

    folders.sort(reverse=True)

    return {
        'folders': len(folders),
        'largest_limit': folders[0] if folders else None,
        'available_limits': folders
    }


# ============================================================================
# PARALLELIZATION - For Large-Scale Prime Generation
# ============================================================================

def sieve_hyperbolic_parallel(limit, num_workers=None):
    """
    Parallel version of hyperbolic sieve for large limits.
    Divides the work among multiple CPU cores.

    Args:
        limit: Upper limit for prime generation
        num_workers: Number of parallel workers (default: CPU count)

    Returns:
        List of prime numbers up to limit
    """
    from multiprocessing import Pool, cpu_count

    if num_workers is None:
        num_workers = cpu_count()

    # For small limits, sequential is faster due to overhead
    if limit < 10000:
        return sieve_hyperbolic_optimized(limit)

    # Check cache first
    largest_limit = find_largest_existing_limit()
    if largest_limit and largest_limit >= limit:
        primes = read_primes_from_folder(os.path.join(OUTPUT_ROOT, f'output-{largest_limit}'))
        return [p for p in primes if p <= limit]

    # Divide range into chunks for parallel processing
    chunk_size = limit // num_workers
    ranges = []

    start_val = 2 if not largest_limit else largest_limit + 1

    for i in range(num_workers):
        chunk_start = start_val + (i * chunk_size)
        chunk_end = start_val + ((i + 1) * chunk_size) if i < num_workers - 1 else limit
        ranges.append((chunk_start, chunk_end))

    # Process chunks in parallel
    with Pool(num_workers) as pool:
        chunk_results = pool.starmap(_process_chunk, ranges)

    # Combine results
    all_primes = []

    # Add cached primes if any
    if largest_limit:
        cached_primes = read_primes_from_folder(os.path.join(OUTPUT_ROOT, f'output-{largest_limit}'))
        all_primes.extend(cached_primes)
    else:
        # Add small primes that might be missed
        all_primes.extend([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31])

    # Add new primes from parallel processing
    for chunk_primes in chunk_results:
        all_primes.extend(chunk_primes)

    # Remove duplicates and sort
    all_primes = sorted(set(all_primes))
    all_primes = [p for p in all_primes if p <= limit]

    # Save to cache
    save_primes_to_folder(limit, all_primes)

    return all_primes


def _process_chunk(start, end):
    """Helper function to process a chunk of numbers in parallel"""
    primes = []
    for num in range(start, end + 1):
        if is_prime_hyperbolic_core(num):
            primes.append(num)
    return primes


# ============================================================================
# SMART CACHE MANAGEMENT
# ============================================================================

def get_cache_size_mb():
    """
    Calculate total size of cache in megabytes.

    Returns:
        Total cache size in MB
    """
    if not os.path.exists(OUTPUT_ROOT):
        return 0.0

    total_size = 0
    for root, dirs, files in os.walk(OUTPUT_ROOT):
        for file in files:
            filepath = os.path.join(root, file)
            if os.path.exists(filepath):
                total_size += os.path.getsize(filepath)

    return total_size / (1024 * 1024)  # Convert to MB


def manage_cache_size(max_size_mb=100, keep_largest=True):
    """
    Manage cache size by removing old files if cache exceeds limit.
    Implements LRU (Least Recently Used) eviction strategy.

    Args:
        max_size_mb: Maximum cache size in megabytes
        keep_largest: If True, keep largest limit folder, else remove oldest accessed

    Returns:
        Dictionary with cleanup statistics
    """
    current_size = get_cache_size_mb()

    if current_size <= max_size_mb:
        return {
            'action': 'none',
            'current_size_mb': current_size,
            'max_size_mb': max_size_mb,
            'removed_folders': []
        }

    if not os.path.exists(OUTPUT_ROOT):
        return {
            'action': 'none',
            'current_size_mb': 0,
            'max_size_mb': max_size_mb,
            'removed_folders': []
        }

    # Get all cache folders with their sizes and access times
    cache_folders = []
    for folder_name in os.listdir(OUTPUT_ROOT):
        folder_path = os.path.join(OUTPUT_ROOT, folder_name)
        if folder_name.startswith('output-') and os.path.isdir(folder_path):
            limit = int(folder_name.replace('output-', ''))
            folder_size = sum(
                os.path.getsize(os.path.join(folder_path, f))
                for f in os.listdir(folder_path)
                if os.path.isfile(os.path.join(folder_path, f))
            )
            access_time = os.path.getatime(folder_path)
            cache_folders.append({
                'name': folder_name,
                'path': folder_path,
                'limit': limit,
                'size_mb': folder_size / (1024 * 1024),
                'access_time': access_time
            })

    if keep_largest:
        # Sort by limit (ascending) - remove smallest first
        cache_folders.sort(key=lambda x: x['limit'])
    else:
        # Sort by access time (ascending) - remove least recently used first
        cache_folders.sort(key=lambda x: x['access_time'])

    # Remove folders until under limit
    removed = []
    import shutil

    for folder in cache_folders:
        if current_size <= max_size_mb:
            break

        # Remove the folder
        shutil.rmtree(folder['path'])
        current_size -= folder['size_mb']
        removed.append({
            'name': folder['name'],
            'limit': folder['limit'],
            'size_mb': folder['size_mb']
        })

    return {
        'action': 'cleaned',
        'current_size_mb': current_size,
        'max_size_mb': max_size_mb,
        'removed_folders': removed,
        'folders_removed': len(removed)
    }


def compress_cache_files():
    """
    Compress cache files using gzip to save disk space.

    Returns:
        Dictionary with compression statistics
    """
    import gzip

    if not os.path.exists(OUTPUT_ROOT):
        return {
            'action': 'none',
            'files_compressed': 0,
            'space_saved_mb': 0
        }

    compressed_count = 0
    total_saved = 0

    for root, dirs, files in os.walk(OUTPUT_ROOT):
        for filename in files:
            if filename.endswith('.txt') and not filename.endswith('.txt.gz'):
                filepath = os.path.join(root, filename)
                original_size = os.path.getsize(filepath)

                # Compress file
                gz_filepath = filepath + '.gz'
                with open(filepath, 'rb') as f_in:
                    with gzip.open(gz_filepath, 'wb') as f_out:
                        f_out.writelines(f_in)

                compressed_size = os.path.getsize(gz_filepath)

                # Remove original
                os.remove(filepath)

                compressed_count += 1
                total_saved += (original_size - compressed_size)

    return {
        'action': 'compressed',
        'files_compressed': compressed_count,
        'space_saved_mb': total_saved / (1024 * 1024)
    }


def clear_all_cache():
    """
    Clear all cached prime data.

    Returns:
        Dictionary with statistics
    """
    import shutil

    if not os.path.exists(OUTPUT_ROOT):
        return {
            'action': 'none',
            'folders_removed': 0
        }

    folders = [f for f in os.listdir(OUTPUT_ROOT)
               if f.startswith('output-') and os.path.isdir(os.path.join(OUTPUT_ROOT, f))]

    for folder in folders:
        shutil.rmtree(os.path.join(OUTPUT_ROOT, folder))

    return {
        'action': 'cleared',
        'folders_removed': len(folders)
    }


# ============================================================================
# DEMONSTRATION
# ============================================================================

def demonstrate():
    """Demonstration of optimized hyperbolic approach with caching"""
    print('=' * 70)
    print('OPTIMIZED HYPERBOLIC PRIME DETECTION WITH CACHING')
    print('=' * 70)
    print()

    # Show cache status
    stats = get_hyperbolic_cache_stats()
    print('📊 Cache Status:')
    print(f'   Cached folders: {stats["folders"]}')
    print(f'   Largest limit: {stats["largest_limit"]:,}' if stats["largest_limit"] else '   No cache available')
    print()

    # Test 1: Generate primes with caching
    print('TEST 1: Generate primes up to 100,000')
    print('-' * 70)

    import time
    start = time.time()
    primes = sieve_hyperbolic_optimized(100000)
    elapsed = (time.time() - start) * 1000

    print(f'Found {len(primes):,} primes in {elapsed:.2f}ms')
    print(f'First 10: {primes[:10]}')
    print(f'Last 10: {primes[-10:]}')
    print(f'Verification: {len(primes) == 9592} (expected 9,592)')
    print()

    # Test 2: Check individual primes
    print('TEST 2: Check individual numbers')
    print('-' * 70)

    test_numbers = [
        (15485863, True, '1 millionth prime'),
        (999983, True, 'largest prime < 1M'),
        (15485864, False, 'composite number'),
        (1000000, False, 'composite number'),
    ]

    for num, expected, desc in test_numbers:
        start = time.time()
        result = is_prime_hyperbolic_optimized(num)
        elapsed = (time.time() - start) * 1000

        status = '✓' if result == expected else '✗'
        result_str = 'PRIME' if result else 'COMPOSITE'
        print(f'{status} {num:>10,} ({desc})')
        print(f'  Result: {result_str}, Time: {elapsed:.3f}ms')

    print()

    # Final cache stats
    final_stats = get_hyperbolic_cache_stats()
    print('📊 Final Cache Status:')
    print(f'   Cached folders: {final_stats["folders"]}')
    print(f'   Largest limit: {final_stats["largest_limit"]:,}' if final_stats["largest_limit"] else '   No cache available')
    print()

    # Verification table
    print('Known Prime Counts for Verification:')
    print('─' * 70)
    print('Limit          | Expected Count | Status')
    print('─' * 70)

    known_counts = [
        (100, 25),
        (1000, 168),
        (10000, 1229),
        (100000, 9592),
    ]

    for limit_val, expected_count in known_counts:
        actual_primes = [p for p in primes if p <= limit_val]
        actual_count = len(actual_primes)
        status = '✓ PASS' if actual_count == expected_count else '✗ FAIL'
        print(f'{limit_val:>14,} | {expected_count:>14,} | {status} (actual: {actual_count:,})')

    print('─' * 70)


if __name__ == '__main__':
    demonstrate()
