# 🚀 GitHub Pages Deployment Guide

## Professional KPI Analysis Dashboard - GitHub Pages Setup

This guide provides complete instructions for deploying the Professional KPI Analysis Dashboard to GitHub Pages using GitHub Actions CI/CD pipeline.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Repository Configuration](#repository-configuration)
4. [GitHub Actions Workflow](#github-actions-workflow)
5. [Deployment Process](#deployment-process)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## Prerequisites

Before deploying to GitHub Pages, ensure you have:

### ✅ Required
- GitHub account with repository access
- Node.js 18+ and npm 9+ installed locally
- Git installed and configured
- This repository cloned to your local machine

### ✅ Recommended
- GitHub CLI (`gh`) installed for streamlined workflows
- Familiarity with GitHub Actions
- Basic understanding of Node.js build processes

### Check Your Environment

```bash
# Verify Node.js version (should be 18+)
node --version

# Verify npm version (should be 9+)
npm --version

# Verify git is configured
git config --global user.name
git config --global user.email
```

---

## Initial Setup

### Step 1: Prepare Your Local Repository

```bash
# Navigate to project directory
cd "Professional-KPI-Analysis-Dashboard"

# Ensure all changes are committed
git status

# If you have uncommitted changes, commit them
git add .
git commit -m "Pre-deployment configuration"
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install

# Verify installation
npm list
```

### Step 3: Test Local Build

```bash
# Build the project locally to ensure it compiles
npm run build

# Check build output
ls -la dist/
```

If the build succeeds, you'll see a `dist/` folder with production-ready files.

---

## Repository Configuration

### Step 1: Update Homepage URL

Edit `package.json` and update the `homepage` field with your actual GitHub Pages URL:

```json
"homepage": "http://tdevopssrv1/DefaultCollection/ETC/_git/Professional-KPI-Analysis-Dashboard/",
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 2: Verify .github/workflows/deploy.yml Exists

The workflow file should be present at:
```
.github/workflows/deploy.yml
```

If not created, the CI/CD pipeline will not trigger. Verify this file exists in your repository.

### Step 3: Push Configuration to GitHub

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: configure GitHub Pages deployment with GitHub Actions"

# Push to main branch
git push -u origin main
```

---

## GitHub Actions Workflow

### Workflow Overview

The deployment workflow (`.github/workflows/deploy.yml`) performs these steps:

```yaml
1. Checkout Code
   ↓
2. Setup Node.js Environment
   ↓
3. Install Dependencies (npm ci)
   ↓
4. Build Application (npm run build)
   ↓
5. Configure GitHub Pages
   ↓
6. Upload Artifacts (dist folder)
   ↓
7. Deploy to GitHub Pages
```

### Workflow Triggers

The workflow automatically runs when:

1. **Push to main/master**: Any push to primary branches triggers deployment
2. **Pull Requests**: Validates build for PRs (no deployment)
3. **Manual Trigger**: You can manually run via `workflow_dispatch`

### Permissions

The workflow has the following least-privilege permissions:

- `contents: read` - Read repository contents
- `pages: write` - Write to GitHub Pages
- `id-token: write` - Generate deployment token

---

## Deployment Process

### Automatic Deployment (Recommended)

1. **Make changes** to your codebase
2. **Commit and push** to `main` or `master` branch:

```bash
git add .
git commit -m "Update dashboard features"
git push origin main
```

3. **GitHub Actions automatically**:
   - Triggers the workflow
   - Installs dependencies
   - Builds the application
   - Deploys to GitHub Pages

4. **Monitor progress** in GitHub Actions tab

### Manual Deployment

If you need to manually trigger deployment:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to GitHub Pages** workflow
4. Click **Run workflow**
5. Select branch: `main`
6. Click **Run workflow**

---

## Verification

### Step 1: Check GitHub Actions Status

1. Navigate to your GitHub repository
2. Click **Actions** tab
3. Look for the workflow run associated with your commit
4. Verify status shows ✅ **Passing**

### Step 2: View Deployment Details

In the workflow run details:

1. Expand the **Deploy to GitHub Pages** step
2. Copy the deployment URL shown in output
3. Or check **Deployments** tab for active deployment

### Step 3: Access Your Deployed Dashboard

1. Navigate to: `http://tdevopssrv1/DefaultCollection/ETC/_git/Professional-KPI-Analysis-Dashboard/`
2. Replace `YOUR_USERNAME` with your GitHub username
3. Verify the dashboard loads correctly
4. Test filters and all three visualization modes

### Step 4: Verify Assets Load Correctly

Open browser DevTools (F12) and check:

1. **Console Tab**: No JavaScript errors
2. **Network Tab**: All resources load successfully
3. **Application Tab**: Check that CSS and JS bundles are loaded

---

## Repository Settings Configuration

### Enable GitHub Pages

1. **Go to** Settings → Pages
2. **Build and deployment**:
   - Source: Select **GitHub Actions**
   - (Do NOT select "Deploy from a branch")
3. **Click Save**

### Configure Custom Domain (Optional)

If you have a custom domain:

1. **Go to** Settings → Pages
2. **Custom domain**: Enter your domain (e.g., `dashboard.example.com`)
3. **Enforce HTTPS**: Check this box
4. Add DNS records as instructed by GitHub

---

## Troubleshooting

### ❌ Issue: Workflow Fails with Build Error

**Symptoms**:
- GitHub Actions shows red ❌
- Error in build step

**Solutions**:

```bash
# 1. Test build locally
npm install
npm run build

# 2. Check for TypeScript errors
npm run type-check

# 3. Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# 4. Check Node version in workflow matches local
node --version
```

### ❌ Issue: 404 Error After Deployment

**Symptoms**:
- Navigate to GitHub Pages URL and get 404
- Repository settings show no deployment

**Solutions**:

1. **Verify workflow file exists**:
   ```bash
   ls -la .github/workflows/deploy.yml
   ```

2. **Check GitHub Pages settings**:
   - Settings → Pages → Source should be "GitHub Actions"

3. **Verify branch name**:
   - Workflow references `main` or `master`
   - Ensure you're pushing to this branch

4. **Check for syntax errors in workflow**:
   - Ensure `.github/workflows/deploy.yml` is valid YAML

### ❌ Issue: CSS/JS Not Loading (Blank Page)

**Symptoms**:
- Dashboard loads but styling is missing
- JavaScript functionality doesn't work

**Solutions**:

1. **Verify base path in vite.config.ts**:
   ```typescript
   base: '/Professional-KPI-Analysis-Dashboard/'
   ```

2. **Check browser console** (F12):
   - Look for failed resource loads
   - Check for 404 errors

3. **Rebuild with correct base path**:
   ```bash
   npm run build
   git add .
   git commit -m "Fix: correct base path for GitHub Pages"
   git push origin main
   ```

### ❌ Issue: Changes Not Appearing After Deployment

**Symptoms**:
- Deployed but old version is still showing
- Cache issue

**Solutions**:

1. **Hard refresh browser**:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear browser cache**:
   - DevTools → Application → Cache Storage → Clear all

3. **Wait for cache expiration**:
   - GitHub Pages updates may take up to 5 minutes

### ❌ Issue: Workflow Cancelled or Stuck

**Symptoms**:
- Workflow shows "Cancelled" or "In Progress" indefinitely
- Deployment incomplete

**Solutions**:

1. **Cancel workflow manually**:
   - Actions tab → Select workflow → Click "Cancel workflow run"

2. **Restart workflow**:
   - Actions tab → Previous run → "Re-run failed jobs"

3. **Check for concurrent runs**:
   - Concurrency setting prevents simultaneous deployments
   - Wait for previous deployment to complete

### ❌ Issue: Permission Denied Errors

**Symptoms**:
- GitHub Actions workflow fails with permission errors
- Cannot write to pages or id-token

**Solutions**:

1. **Verify workflow permissions** in `.github/workflows/deploy.yml`:
   ```yaml
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

2. **Check repository settings**:
   - Settings → Actions → General
   - Ensure "Workflow permissions" is set to "Read and write permissions"

3. **Update workflow permissions**:
   - Settings → Environments → github-pages
   - Verify deployment protection rules if any

---

## Maintenance

### Regular Updates

To keep your deployment secure and performant:

#### Monthly
- Check for dependency updates:
  ```bash
  npm outdated
  npm update
  ```

- Review GitHub Actions workflow status
- Monitor deployment history

#### Quarterly
- Update Node.js version in workflow (if new LTS available)
- Review and update dependencies to latest versions:
  ```bash
  npm install
  npm audit fix
  ```

- Test deployment manually
- Update documentation if needed

### Workflow Health Check

Monitor your workflow with these metrics:

| Metric | Ideal | Critical |
|--------|-------|----------|
| Build Time | <2 min | >5 min |
| Deployment Time | <1 min | >3 min |
| Success Rate | 100% | <95% |
| Cache Hit Rate | >80% | <50% |

---

## Performance Optimization

### Build Optimization

The workflow includes performance optimizations:

1. **NPM Cache**: Speeds up dependency installation
2. **Bundle Splitting**: Separates vendor code (chart.js, lodash, date-fns)
3. **Minification**: Reduces JavaScript size
4. **Terser**: JavaScript compression for smaller output

### Monitor Build Artifacts

```bash
# Check build output size
du -sh dist/

# Analyze bundle composition
npm run build -- --analyze  # if available
```

---

## Advanced Configuration

### Custom Environment Variables

To add environment variables for deployment:

1. **Create in GitHub**:
   - Settings → Secrets and variables → Actions
   - New repository secret

2. **Use in workflow**:
   ```yaml
   - name: Build Application
     env:
      API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
     run: npm run build
   ```

### Deploy on Schedule

To deploy automatically on schedule:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday at midnight
```

### Multi-Environment Deployment

For deploying to multiple environments:

```yaml
jobs:
  deploy-staging:
    # Deploy to staging on pull requests
  
  deploy-production:
    # Deploy to production only on main branch
    if: github.ref == 'refs/heads/main'
```

---

## Security Best Practices

### ✅ Implemented Security Features

1. **Least Privilege Permissions**: Workflow has minimal required permissions
2. **HTTPS Only**: GitHub Pages enforces HTTPS
3. **No Secrets in Code**: Environment variables used for sensitive data
4. **Branch Protection**: Main branch protected by workflow status checks

### Additional Security Steps

1. **Enable branch protection**:
   - Settings → Branches → Main
   - Require status checks before merging

2. **Use GitHub Secrets** for sensitive data:
   - API keys, tokens, credentials
   - Never commit secrets to repository

3. **Regular dependency audits**:
   ```bash
   npm audit
   npm audit fix
   ```

---

## Rollback Procedure

If you need to rollback to a previous deployment:

### Automatic Rollback

```bash
# Identify previous working commit
git log --oneline

# Checkout previous commit
git checkout COMMIT_HASH

# Create new branch and push
git checkout -b hotfix/rollback
git push -u origin hotfix/rollback

# Create pull request and merge to main
```

### Manual Rollback

1. Go to GitHub repository
2. Click Actions → Select workflow run to rollback to
3. Note the commit hash
4. Follow "Automatic Rollback" steps above

---

## Monitoring & Alerts

### Monitor Deployments

1. **GitHub Deployments Tab**: Shows deployment history
2. **Actions Tab**: Shows all workflow runs
3. **Email Notifications**: GitHub sends alerts on failure
4. **Status Badge**: Add to README.md:

```markdown
[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/Professional-KPI-Analysis-Dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/Professional-KPI-Analysis-Dashboard/actions/workflows/deploy.yml)
```

---

## Frequently Asked Questions

### Q: How often does deployment happen?

**A**: Deployment triggers on:
- Every push to `main` or `master` branch
- Manual workflow trigger via GitHub Actions UI
- You can also schedule deployments using `cron` expressions

### Q: Can I deploy to a different branch?

**A**: Yes, modify the `on.push.branches` in `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: ["main", "develop", "staging"]
```

### Q: How long does deployment take?

**A**: Typically 2-3 minutes:
- 30 seconds: Checkout code
- 30 seconds: Setup Node.js
- 30 seconds: Install dependencies
- 45 seconds: Build application
- 15 seconds: Deploy to GitHub Pages

### Q: Can I use a custom domain?

**A**: Yes! Follow [Configure Custom Domain](#configure-custom-domain-optional) section.

### Q: Is there a cost for GitHub Pages?

**A**: No! GitHub Pages is free for public repositories.

### Q: What happens to old deployments?

**A**: GitHub Pages serves the latest deployment. Old deployments are archived but not actively served.

---

## Support & Resources

### Documentation
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

### Help & Troubleshooting
1. Check workflow logs in GitHub Actions
2. Review browser DevTools console (F12)
3. Test build locally: `npm run build`
4. Verify repository settings

---

## Deployment Checklist

Before deploying, ensure:

- [ ] All local changes are committed
- [ ] `npm install` runs without errors
- [ ] `npm run build` succeeds locally
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `homepage` in package.json is updated
- [ ] GitHub Pages settings use "GitHub Actions"
- [ ] Node.js version compatible (18+)
- [ ] No sensitive data in code
- [ ] README.md updated with deployment info

---

## Next Steps

1. **Enable GitHub Pages** in repository settings
2. **Update package.json** homepage URL with your username
3. **Push to main** branch to trigger automatic deployment
4. **Monitor Actions tab** for workflow status
5. **Access your dashboard** at GitHub Pages URL
6. **Test functionality** (filters, visualizations, data)
7. **Share deployment URL** with team/stakeholders

---

## Summary

Your Professional KPI Analysis Dashboard is now configured for professional deployment to GitHub Pages with:

✅ Automated GitHub Actions CI/CD pipeline  
✅ Optimal build configuration with Vite  
✅ Production-ready performance optimization  
✅ Least-privilege security permissions  
✅ Automatic deployment on code push  
✅ Manual deployment capability  

**Status**: 🚀 Ready for Production Deployment

---

**Last Updated**: September 2026  
**Version**: 2.0  
**Deployment Method**: GitHub Actions → GitHub Pages
