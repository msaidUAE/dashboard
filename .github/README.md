# GitHub Actions & Pages Configuration

This directory contains GitHub-specific configuration for CI/CD and GitHub Pages deployment.

---

## 📁 Directory Structure

```
.github/
├── workflows/
│   ├── deploy.yml          # Main GitHub Pages deployment pipeline
│   └── validate.yml        # Build validation for PRs and develop branch
├── DEPLOYMENT_RUNBOOK.md   # Quick deployment reference
└── README.md               # This file
```

---

## 🚀 Quick Start

### 1. First Time Setup

```bash
# Navigate to project root
cd Professional-KPI-Analysis-Dashboard

# Update package.json homepage URL (IMPORTANT!)
# Edit package.json and set:
# "homepage": "https://YOUR_USERNAME.github.io/Professional-KPI-Analysis-Dashboard/"

# Install dependencies
npm install

# Test build locally
npm run build

# Push to GitHub
git add .
git commit -m "feat: configure GitHub Pages deployment"
git push -u origin main
```

### 2. Monitor Deployment

- Go to GitHub repository
- Click **Actions** tab
- Wait for workflow to complete
- Access dashboard at: `https://YOUR_USERNAME.github.io/Professional-KPI-Analysis-Dashboard/`

---

## 📝 Workflow Files

### deploy.yml

**Purpose**: Production deployment to GitHub Pages

**Triggers**:
- `push` to main/master branches
- Manual `workflow_dispatch` trigger
- `pull_request` (validation only, no deployment)

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Build application (npm run build)
5. Setup GitHub Pages
6. Upload dist folder artifacts
7. Deploy to GitHub Pages

**Permissions**:
- contents: read
- pages: write
- id-token: write

**Environment**:
- Ubuntu latest
- Node.js 20
- npm cache enabled

### validate.yml

**Purpose**: Validate build integrity on pull requests

**Triggers**:
- `pull_request` to main/master
- `push` to develop branch

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Type check (tsc)
5. Build application
6. Verify dist artifacts
7. Report status

---

## ⚙️ Configuration Requirements

### Required Files

✅ `.github/workflows/deploy.yml` - Deployment pipeline  
✅ `vite.config.ts` - Build configuration with base path  
✅ `package.json` - Build scripts and homepage URL  
✅ `tsconfig.json` - TypeScript configuration  

### Repository Settings

Go to **Settings → Pages**:
- **Source**: GitHub Actions (NOT Deploy from a branch)
- **Branch**: auto-selected after first deployment
- **Custom domain** (optional): your-domain.com
- **HTTPS**: Enforce HTTPS (recommended)

### Environment Variables

No required environment variables. Optional:
- `GITHUB_PAGES=true` - Set in build script for base path

---

## 🔍 Monitoring

### View Workflow Status

1. **GitHub Actions Tab**: Shows all workflow runs
2. **Actions** → **Deployments**: See deployment history
3. **Branch protection**: Shows required status checks

### Check Deployment Health

```bash
# Locally verify build works
npm run build

# Check bundle size
du -sh dist/

# Type check
npm run type-check
```

---

## 🐛 Troubleshooting

### Workflow Won't Trigger

**Check**:
1. File path: `.github/workflows/deploy.yml` (exact path)
2. Branch name matches workflow (main or master)
3. YAML syntax valid (use YAML linter)
4. Permissions configured correctly

**Fix**:
```bash
# Verify workflow file exists
ls -la .github/workflows/

# Force push to trigger
git commit --allow-empty -m "Trigger workflow"
git push
```

### Build Fails

**Check**:
1. Local build works: `npm run build`
2. All dependencies installed: `npm install`
3. Node version correct: Node 18+
4. TypeScript errors: `npm run type-check`

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deploy But No Content

**Check**:
1. Settings → Pages → Source set to "GitHub Actions"
2. dist/ folder created successfully
3. Base path in vite.config.ts correct
4. Browser cache cleared

**Fix**:
```bash
# Hard refresh browser
Ctrl + Shift + R  # Windows/Linux
Cmd + Shift + R   # Mac

# Or deploy with cache clear
git push origin main --force-with-lease
```

---

## 📊 Workflow Statistics

### Typical Performance

| Stage | Time | Status |
|-------|------|--------|
| Checkout | 10s | ✅ |
| Setup Node | 15s | ✅ |
| Install (cached) | 20s | ✅ |
| Build | 45s | ✅ |
| Deploy | 20s | ✅ |
| **Total** | **~2 min** | ✅ |

### Cache Effectiveness

- **npm cache**: 80-90% hit rate (saves ~30s)
- **Subsequent builds**: 1-2 minute deployments
- **First deploy**: 2-3 minutes (includes cache setup)

---

## 🔐 Security

### Permissions (Principle of Least Privilege)

```yaml
permissions:
  contents: read         # Read source code only
  pages: write          # Write GitHub Pages artifacts
  id-token: write       # Generate OIDC token for deployment
```

### Best Practices

1. **Secrets Management**: Never commit secrets
   - Use GitHub Secrets for API keys
   - Reference as `${{ secrets.SECRET_NAME }}`

2. **Branch Protection**:
   - Require status checks before merge
   - Prevent direct pushes to main

3. **Code Review**:
   - Require PR reviews before merge
   - Use branch protection rules

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `.github/DEPLOYMENT_RUNBOOK.md` | Quick reference (5 min read) |
| `GITHUB_PAGES_DEPLOYMENT.md` | Complete guide (30 min read) |
| `.github/workflows/deploy.yml` | Workflow source code |
| `.github/workflows/validate.yml` | PR validation pipeline |

---

## 🎯 Next Steps

1. **Update homepage URL** in package.json
2. **Verify GitHub Pages settings** (Source: GitHub Actions)
3. **Push to main branch** to trigger deployment
4. **Monitor Actions tab** for status
5. **Access deployed dashboard** at GitHub Pages URL
6. **Customize workflows** as needed for your needs

---

## 📞 Support

### Workflow Logs

Debug workflow issues in GitHub:
1. Go to Actions tab
2. Click workflow run
3. View step logs
4. Check error messages

### Local Testing

Test build before pushing:
```bash
npm install
npm run build
npm run preview  # Preview build locally
```

### Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Run `npm install && npm run build` locally |
| 404 after deploy | Check GitHub Pages settings and base path |
| Old version showing | Hard refresh: Ctrl+Shift+R |
| Slow builds | npm cache may be cold on first run |

---

## 🚀 Deployment Quick Commands

```bash
# Test locally
npm run build

# Deploy (automatic)
git push origin main

# Deploy manually (via Actions UI)
# Actions → Deploy to GitHub Pages → Run workflow

# Preview locally
npm run preview

# Check build size
du -sh dist/
```

---

**Status**: ✅ Ready for GitHub Pages Deployment  
**Last Updated**: September 2026  
**Version**: 2.0 - Production Ready
