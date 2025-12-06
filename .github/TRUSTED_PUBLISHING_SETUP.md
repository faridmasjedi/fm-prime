# GitHub Actions Trusted Publishing Setup Guide

This guide explains how to set up secure, token-free npm publishing using GitHub Actions and OIDC (OpenID Connect) trusted publishers.

## Benefits

✅ **No long-lived tokens** - Eliminates token theft risk
✅ **Automatic provenance** - Built-in supply chain security
✅ **No token rotation** - No need to manage expiring tokens
✅ **Better security** - Phishing-resistant authentication

---

## Prerequisites

1. GitHub repository with code
2. npm account with publish permissions for `primefm`
3. Admin access to npm package settings

---

## Step 1: Configure npm Trusted Publishers

### 1.1 Navigate to Package Settings
Go to: https://www.npmjs.com/settings/primefm/access

### 1.2 Add Trusted Publisher
1. Scroll to **"Trusted Publishers"** section
2. Click **"Add Trusted Publisher"**
3. Select **"GitHub Actions"**

### 1.3 Enter Repository Details
Fill in the following:
- **Repository owner:** `faridmasjedi` (your GitHub username)
- **Repository name:** `fm-prime`
- **Workflow name:** `publish-npm.yml`
- **Environment name:** Leave blank (not using environments)

### 1.4 Save Configuration
Click **"Add"** to save the trusted publisher configuration.

---

## Step 2: Verify GitHub Actions Workflow

The workflow file is already created at `.github/workflows/publish-npm.yml`

Key features:
- ✅ Uses `id-token: write` permission for OIDC
- ✅ Publishes with `--provenance` flag
- ✅ Supports both standard and data versions
- ✅ Manual and tag-based triggers

---

## Step 3: Using the Workflow

### Option A: Manual Publish (Recommended for Testing)

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select **"Publish to npm"** workflow
4. Click **"Run workflow"** button
5. Choose version type:
   - `standard` - Publish only 1.0.5 (62.6 KB)
   - `data` - Publish only 1.0.5-data (5.2 MB)
   - `both` - Publish both versions

### Option B: Automatic Publish on Tag

Create and push a version tag:
```bash
# Create a new version tag
git tag v1.0.6
git push origin v1.0.6
```

This will automatically publish the standard version.

---

## Step 4: Verify Trusted Publishing Works

After setting up, test it:

1. **Run a test publish** (manual workflow)
2. **Check the workflow logs** for success
3. **Verify on npm:**
   ```bash
   npm view primefm@YOUR_VERSION
   ```
4. **Check provenance attestation:**
   ```bash
   npm audit signatures
   ```

---

## Migration from Token-Based Publishing

### Current State (Token-Based)
```bash
# Old method - requires NPM_TOKEN secret
npm publish
```

### New State (Trusted Publishing)
```bash
# New method - no tokens needed
npm publish --provenance
```

### What to Do with Old Tokens

Once trusted publishing is working:

1. **Test the new workflow** thoroughly
2. **Remove old tokens** from GitHub Secrets (if any)
3. **Revoke old npm tokens:**
   ```bash
   npm token list
   npm token revoke <token-id>
   ```

---

## Troubleshooting

### Error: "Unable to authenticate with OIDC provider"

**Solution:** Verify that:
1. Trusted publisher is configured correctly on npm
2. Repository owner/name match exactly
3. Workflow file name matches (`publish-npm.yml`)
4. Workflow has `id-token: write` permission

### Error: "You do not have permission to publish"

**Solution:**
1. Check you're logged into the correct npm account
2. Verify you have publish permissions for `primefm`
3. Ensure trusted publisher configuration includes your repository

### Workflow doesn't trigger on tag push

**Solution:**
1. Ensure tag format matches `v*.*.*` (e.g., `v1.0.6`)
2. Push tags with `git push origin <tag-name>`
3. Check workflow permissions in repository settings

---

## Publishing New Versions

### Publishing Standard Version Only

**Method 1: Manual Workflow**
1. Update version in `package.json`
2. Commit and push changes
3. Go to Actions → Publish to npm → Run workflow
4. Select "standard"

**Method 2: Git Tag**
1. Update version in `package.json` (e.g., to `1.0.6`)
2. Commit changes
3. Create and push tag:
   ```bash
   git tag v1.0.6
   git push origin v1.0.6
   ```

### Publishing Both Versions

1. Update version in `package.json` (e.g., `1.0.6`)
2. Update version in `package-data.json` (e.g., `1.0.6-data`)
3. Commit and push changes
4. Go to Actions → Run workflow → Select "both"

---

## Security Best Practices

✅ **Never commit npm tokens** to the repository
✅ **Use provenance attestations** (`--provenance` flag)
✅ **Review workflow runs** regularly
✅ **Keep dependencies updated** (Node.js, actions)
✅ **Enable branch protection** on main branch
✅ **Require PR reviews** for package.json changes

---

## Additional Resources

- [npm Trusted Publishers Documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions OIDC Guide](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Provenance Attestation](https://github.blog/2023-04-19-introducing-npm-package-provenance/)

---

## Support

If you encounter issues:
1. Check workflow logs in GitHub Actions tab
2. Verify npm trusted publisher configuration
3. Review this guide's troubleshooting section
4. Contact npm support: https://www.npmjs.com/support

---

**Last Updated:** December 2025
**Workflow Version:** 1.0
