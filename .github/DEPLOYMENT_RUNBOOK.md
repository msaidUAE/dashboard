# 🚀 Deployment Runbook

Quick reference guide for deploying Professional KPI Analysis Dashboard.

---

## Prerequisites Checklist

```bash
✓ Node.js v18+ installed
✓ npm v9+ installed
✓ Git configured
✓ Repository cloned locally
✓ All changes committed
```

---

## Quick Deployment Steps

### 1. Verify Local Build (5 min)

```bash
# Navigate to project
cd "Professional-KPI-Analysis-Dashboard"

# Install dependencies
npm install

# Build locally
npm run build

# Verify dist folder created
ls dist/
```

### 2. Update Homepage (1 min)

Edit `package.json`:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/Professional-KPI-Analysis-Dashboard/"
```

### 3. Push to GitHub (2 min)

```bash
git add .
git commit -m "feat: github pages deployment ready"
git push -u origin main
```

### 4. Monitor Deployment (3 min)

- Go to GitHub repository
- Click **Actions** tab
- Wait for "Deploy to GitHub Pages" workflow to complete
- Check for ✅ status

### 5. Access Dashboard (1 min)

Navigate to:
```
https://YOUR_GITHUB_USERNAME.github.io/Professional-KPI-Analysis-Dashboard/
```

---

## Common Commands

| Task | Command |
|------|---------|
| Test build locally | `npm run build` |
| Preview build | `npm run preview` |
| Check types | `npm run type-check` |
| Install deps | `npm install` |
| Clean & reinstall | `rm -rf node_modules && npm install` |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails locally | Run `npm install` then `npm run build` |
| 404 after deploy | Check GitHub Pages settings (must be "GitHub Actions") |
| Blank page | Hard refresh: `Ctrl+Shift+R` or clear cache |
| Old version showing | Wait 5 mins for cache expiration |

---

## Rollback Procedure

```bash
# Find previous commit
git log --oneline

# Checkout previous version
git checkout COMMIT_HASH

# Push rollback
git push -f origin main
```

---

## Support Resources

- **Full Guide**: See `GITHUB_PAGES_DEPLOYMENT.md`
- **Documentation**: https://docs.github.com/en/pages
- **Status**: Check Actions tab in GitHub
