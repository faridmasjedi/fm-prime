/**
 * HYPERBOLIC EQUATION APPROACH - TWO-WAY SEARCH
 * =============================================
 *
 * A mathematically optimized implementation that searches the solution space
 * from both ends simultaneously to achieve O(√N) complexity.
 * 
 * STRATEGY:
 * 1. Bottom-Up Search: Check r = 0, 1, 2... (Finds factors near √N)
 * 2. Top-Down Search: Check r corresponding to small factors k (Finds small factors)
 * 
 * This guarantees finding a factor in O(√N) steps, solving the performance
 * bottleneck for numbers with small factors.
 */

/**
 * Find the smallest divisor of a number using hyperbolic equations
 * @param {string|number} numInput - Number to factorize
 * @returns {string} Smallest divisor (returns num itself if prime)
 */
export function divisionHyperbolic(numInput) {
    const num = BigInt(numInput);

    // Fast base cases
    if (num % 2n === 0n) return '2';
    if (num % 3n === 0n) return '3';
    if (num % 5n === 0n) return '5';

    const n = (num % 6n === 1n) ? (num - 1n) / 6n : (num + 1n) / 6n;
    const isFirstTrend = (num % 6n === 1n);

    // Calculate limits
    // We stop when the small factor check reaches sqrt(num)
    // or when r exceeds the limit (though we'll find the factor via k check first)
    const limitA = isFirstTrend ? (n - 8n) / 7n : (n + 8n) / 7n;
    const limitB = isFirstTrend ? (n - 4n) / 5n : (n + 4n) / 5n;
    const maxR = limitA > limitB ? limitA : limitB;

    // Start point for r (for 6n-1)
    let startR = 0n;
    if (!isFirstTrend) {
        const minVal = (6n * n - 1n) / 9n;
        startR = isqrt(minVal);
    }

    // Interleaved Search Loop
    // We iterate 'i' which drives both 'r' (Bottom-Up) and 'k' (Top-Down)
    let r = startR;
    let k_idx = 1n; // Index for 6k±1 factors

    // Pre-calculate constants
    const n6 = 6n * n;
    const sqrtN = isqrt(num);

    // Loop until we cover the search space (up to sqrt(N))
    // We use k_val <= sqrtN as the primary termination condition
    // because the Top-Down search is essentially trial division up to sqrt(N)

    while (true) {
        // --- CHECK 1: Bottom-Up (Hyperbolic r) ---
        // Checks for factors near sqrt(N)
        if (r <= maxR) {
            let discriminant;
            if (isFirstTrend) {
                discriminant = 9n * r * r + n6 + 1n;
            } else {
                discriminant = 9n * r * r - n6 + 1n;
            }

            // Modular filter
            if (isSquareMod64(discriminant) &&
                isSquareMod63(discriminant) &&
                isSquareMod65(discriminant)) {

                const m = isqrt(discriminant);
                if (m * m === discriminant) {
                    const term3r = 3n * r;
                    let f1, f2;
                    if (isFirstTrend) {
                        f1 = m - term3r;
                        f2 = m + term3r;
                    } else {
                        f1 = term3r - m;
                        f2 = term3r + m;
                    }
                    const d1 = checkFactor(num, f1);
                    if (d1) return d1;
                    const d2 = checkFactor(num, f2);
                    if (d2) return d2;
                }
            }
            r++;
        }

        // --- CHECK 2: Top-Down (Small Factors k) ---
        // Checks for small factors (which correspond to large r)
        // We check k = 6*idx - 1 and k = 6*idx + 1

        const k1 = 6n * k_idx - 1n;
        const k2 = 6n * k_idx + 1n;

        if (k1 > sqrtN) break; // Covered all possible factors

        // Check k1
        if (k1 > 1n && num % k1 === 0n) return k1.toString();

        // Check k2
        if (k2 > 1n && num % k2 === 0n) return k2.toString();

        k_idx++;
    }

    return num.toString();
}

/**
 * Helper to validate if a factor is a valid divisor
 */
function checkFactor(num, f) {
    if (f > 1n && f < num) {
        if ((f - 1n) % 6n === 0n || (f + 1n) % 6n === 0n) {
            if (num % f === 0n) return f;
        }
    }
    return null;
}

/**
 * Integer square root using Newton's method
 */
function isqrt(n) {
    if (n < 2n) return n;
    if (n <= 9007199254740991n) {
        return BigInt(Math.floor(Math.sqrt(Number(n))));
    }
    let x = n;
    let y = (x + 1n) >> 1n;
    while (y < x) {
        x = y;
        y = (x + n / x) >> 1n;
    }
    return x;
}

// Modular filters
const QR64 = new Set([0, 1, 4, 9, 16, 17, 25, 33, 36, 41, 49, 57]);
const QR63 = new Set([0, 1, 4, 7, 9, 16, 18, 22, 25, 28, 36, 37, 43, 46, 49, 58]);
const QR65 = new Set([0, 1, 4, 9, 10, 14, 16, 25, 26, 29, 30, 35, 36, 39, 40, 49, 51, 55, 56, 61, 64]);

function isSquareMod64(n) { return QR64.has(Number(n & 63n)); }
function isSquareMod63(n) { return QR63.has(Number(n % 63n)); }
function isSquareMod65(n) { return QR65.has(Number(n % 65n)); }

export function isPrimeHyperbolic(numInput) {
    const num = BigInt(numInput);
    if (num <= 3n) return num > 1n;
    if (num % 2n === 0n || num % 3n === 0n) return false;

    const div = BigInt(divisionHyperbolic(num));
    return div === num;
}

export function sieveHyperbolic(limitInput) {
    const limit = BigInt(limitInput);
    if (limit < 2n) return [];
    const primes = [2n, 3n];
    for (let i = 5n; i <= limit; i += 2n) {
        if (i % 3n !== 0n && isPrimeHyperbolic(i)) primes.push(i);
    }
    return primes;
}
