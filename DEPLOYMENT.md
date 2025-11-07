# Deployment Guide - Vercel

## 🚀 Quick Deploy to Vercel

### Method 1: Vercel CLI (Fastest)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow prompts:**
   - Link to existing project? `No`
   - Project name? `gutendex-react` (or press Enter)
   - Directory? `.` (press Enter)
   - Override settings? `No` (press Enter)

4. **Production deployment:**
```bash
vercel --prod
```

---

### Method 2: Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `Rohi7875/gutendex-react`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
   
4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes for build to complete
   - Your app will be live at: `https://gutendex-react.vercel.app` (or similar)

---

## ⚙️ Environment Variables

No environment variables needed! The app uses the public Gutendex API.

---

## 🔗 Your Deployment URLs

After deployment, you'll get:

**Production URL:**
```
https://gutendex-react.vercel.app
```

**Preview URLs:**
Every git push creates a preview URL:
```
https://gutendex-react-git-main-rohi7875.vercel.app
```

---

## 📋 Deployment Checklist

✅ Code pushed to GitHub  
✅ `vercel.json` configuration created  
✅ `.gitignore` excludes node_modules and dist  
✅ Build command set to `npm run build`  
✅ Output directory set to `dist`  
✅ API base URL is external (no CORS issues)  

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** "Build failed"  
**Solution:** Check build logs in Vercel dashboard

**Common fixes:**
```bash
# Test build locally first
npm run build

# Check for errors
npm run preview
```

### 404 on Routes

**Issue:** Page refresh shows 404  
**Solution:** `vercel.json` has SPA rewrites configured ✅

### Fonts Not Loading

**Issue:** Fonts not displaying  
**Solution:** Fonts are in `/public/fonts/` - they'll be copied to `dist/` ✅

---

## 🔄 Automatic Deployments

Once connected to Vercel:

- **Push to `main`** → Automatic production deployment
- **Push to other branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URL

---

## 📊 Post-Deployment Testing

After deployment, test:

1. ✅ Home page loads
2. ✅ Click category → Books load
3. ✅ Infinite scroll works
4. ✅ Search works
5. ✅ Books open in new tab
6. ✅ Fonts load correctly
7. ✅ Images/icons display
8. ✅ Responsive on mobile

---

## 🎯 Performance Optimization

Vercel automatically provides:

- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Compression (gzip/brotli)
- ✅ Caching headers
- ✅ Edge network

Expected performance:
- **Load time:** < 2 seconds
- **Lighthouse score:** 90+

---

## 📱 Share Your App

Once deployed, share:

```
🌐 Live App: https://gutendex-react.vercel.app
📦 GitHub: https://github.com/Rohi7875/gutendex-react
```

---

## 🆘 Need Help?

**Vercel Docs:** https://vercel.com/docs  
**Vite Docs:** https://vitejs.dev/guide/  
**Support:** https://vercel.com/support

---

## ✨ You're All Set!

Your Gutendex Book Browser is ready for the world! 🎉

