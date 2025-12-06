# Publishing Data Version Guide

This guide explains how to publish both standard and data versions of the primefm npm package.

## Package Versions

### Standard Version (1.0.5)
- **File:** `package.json`
- **Description:** Standard package without pre-computed cache
- **Size:** ~63 KB
- **Install:** `npm install primefm`

### Data Version (1.0.5-data)
- **File:** `package-data.json`
- **Description:** Includes pre-computed prime cache up to 30,300,000
- **Size:** ~17 MB
- **Install:** `npm install primefm@1.0.5-data`

---

## Publishing Instructions

### 1. Publish Standard Version (Default)

```bash
# Ensure package.json is at version 1.0.5
npm publish
```

This publishes the standard version and sets it as the `latest` tag (default).

### 2. Publish Data Version (Optional)

```bash
# Temporarily use package-data.json
cp package.json package.json.backup
cp package-data.json package.json

# Publish the data version
npm publish

# Restore original package.json
mv package.json.backup package.json
```

**Important:** After publishing the data version, you need to reset the `latest` tag to point to the standard version:

```bash
# Set 1.0.5 (standard) as the latest/default
npm dist-tag add primefm@1.0.5 latest
```

---

## Verification

Check published versions:
```bash
npm view primefm versions
npm view primefm dist-tags
```

Expected output:
```json
{
  "latest": "1.0.5"
}
```

---

## User Installation

### Standard Version (Default)
```bash
npm install primefm
# or explicitly
npm install primefm@1.0.5
```

### Data Version (Optional)
```bash
npm install primefm@1.0.5-data
```

---

## Cache Data Details

The data version includes:
- **Location:** `output-big/output-30300000/`
- **Files:** 16 cache files
- **Primes:** 1,875,367 primes up to 30,299,999
- **Total Size:** ~17 MB

Users who install the data version get instant access to cached primes without computation time.

---

## Notes

- The standard version (1.0.5) will always be the default when users run `npm install primefm`
- The data version (1.0.5-data) must be explicitly requested with `@1.0.5-data`
- Both versions have identical code - only the included cache data differs
- After publishing any new version, always verify the `latest` tag points to the standard version
