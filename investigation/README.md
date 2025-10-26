# Investigation Folder

This folder contains implementations that require further investigation and debugging before they can be used in production.

---

## Files Under Investigation

### `primeHyperbolic.optimized.mjs`

**Status:** 🔍 **REQUIRES DEBUGGING**

**Issue:** The Hyperbolic Equations Method has fundamental bugs that cause false positives when identifying prime numbers.

#### Known Failures:

The method incorrectly identifies the following composite numbers as prime:
- **77** = 7 × 11
- **119** = 7 × 17
- **143** = 11 × 13
- And 44+ other composite numbers less than 1,000

#### Test Results:

- **Expected:** 168 primes < 1,000
- **Found:** 215 primes < 1,000
- **Accuracy:** ~78% (47 false positives)

#### Mathematical Foundation:

The method is based on solving hyperbolic equations derived from factorization patterns:

**For 6n+1:**
```
m² - 9r² = 6n+1
Where: (m - 3r)(m + 3r) = 6n+1
```

**For 6n-1:**
```
9r² - m² = 6n-1
Where: (3r - m)(3r + m) = 6n-1
```

#### Suspected Issues:

1. **Constraint bounds may be incorrect:**
   - First pattern: `7r ≤ n - 8`
   - Second pattern: `5r ≤ n - 4`
   - These constraints may be too restrictive or incorrectly derived

2. **Validation logic issues:**
   - The `r >= √num/3` check in second trend may skip valid r values
   - Check formulas may have off-by-one errors

3. **Missing patterns:**
   - Some factorization patterns may not be covered by the current implementation

#### Next Steps for Investigation:

- [ ] Verify mathematical derivation of constraint formulas
- [ ] Test edge cases systematically (products of primes: 5×7, 5×11, 7×11, 7×13, etc.)
- [ ] Compare with literature on quadratic forms and Pell equations
- [ ] Consider alternative formulations of the hyperbolic approach
- [ ] Add comprehensive unit tests for known composite numbers

#### Original Source:

This implementation is based on `education/primeSixthWay.js`, which also exhibits the same bugs. Both the original and optimized versions fail on the same test cases.

#### Potential Value:

Despite current bugs, this approach is mathematically interesting:
- ✅ **Novel perspective:** Transforms factorization into geometric problem
- ✅ **Educational value:** Shows connection between algebra and number theory
- ✅ **Research potential:** May lead to new insights if bugs can be resolved

---

## How to Continue Investigation

1. **Read the mathematical foundation:**
   - See `/Users/farid/Desktop/fm-prime/README.md` (lines 80-190)
   - Review derivation in `/Users/farid/Desktop/fm-prime/education/README.md`

2. **Run tests:**
   ```bash
   # Test specific numbers
   node -e "const {isPrimeHyperbolic} = require('./investigation/primeHyperbolic.optimized.mjs'); console.log(isPrimeHyperbolic('77'));"
   ```

3. **Compare with working methods:**
   - Use `src/services/primeChecker.optimized.mjs` as ground truth
   - Compare results systematically

4. **Literature review:**
   - Search for similar "hyperbolic" approaches in number theory literature
   - Check papers on quadratic forms and primality testing

---

**Last Updated:** 2025-10-26
**Status:** Moved from production code to investigation
