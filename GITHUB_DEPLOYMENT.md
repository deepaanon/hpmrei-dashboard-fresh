# 🚀 GitHub + Vercel Deployment Guide

## Current Status ✅
- ✅ Next.js project builds successfully  
- ✅ All dependencies installed
- ✅ Local backend system started
- ✅ Ready for GitHub deployment

## 📋 Step-by-Step Deployment Process

### Step 1: Create GitHub Repository (5 minutes)

1. **Go to GitHub.com** and sign in with your account
2. **Click "New Repository"** (green button)
3. **Repository Settings**:
   - Name: `hpmrei-dashboard`
   - Description: `Secure HPMREI Trading Dashboard`
   - Set as **Public** (required for Vercel free tier)
   - ✅ Initialize with README (uncheck this - we have our own files)

4. **Copy the repository URL** (will look like: `https://github.com/YOUR_USERNAME/hpmrei-dashboard.git`)

### Step 2: Connect Local Project to GitHub

```bash
# Run these commands in your terminal:
cd "/Users/veronaugustin/Documents/Pinescripts/Mean Reversion/vercel-deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/hpmrei-dashboard.git

# Push your code to GitHub
git push -u origin main
```

### Step 3: Deploy to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Continue with GitHub"**
3. **Import Project**:
   - Find your `hpmrei-dashboard` repository
   - Click "Import"
4. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `.` (default)
   - Click **"Deploy"**

### Step 4: Set Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```
Variable Name: BACKEND_API_URL
Value: YOUR_NGROK_URL (we'll set this up next)

Variable Name: NEXT_PUBLIC_DASHBOARD_PASSWORD  
Value: hpmrei2025

Variable Name: NEXT_PUBLIC_ALLOWED_IPS
Value: (leave empty for now)
```

### Step 5: Set Up ngrok for Backend Connection

Since Vercel needs to connect to your local HPMREI system:

1. **Install ngrok** (if not installed):
   ```bash
   brew install ngrok
   ```

2. **Start ngrok tunnel**:
   ```bash
   ngrok http 5000
   ```

3. **Copy the HTTPS URL** (like `https://abc123.ngrok.io`)

4. **Update Vercel Environment Variables**:
   - Go back to Vercel → Settings → Environment Variables
   - Edit `BACKEND_API_URL` and paste your ngrok URL
   - **Redeploy** your project (Vercel → Deployments → click "..." → Redeploy)

## 🎉 Your Dashboard Will Be Live At:
**https://your-project-name.vercel.app**

## 🔐 Access Instructions:
- Password: `hpmrei2025`
- The dashboard will show real-time data from your local HPMREI system
- Works on any device, anywhere in the world

## 🛠️ If You Encounter Issues:

### Build Errors:
```bash
# Test build locally first:
cd "/Users/veronaugustin/Documents/Pinescripts/Mean Reversion/vercel-deployment"
npm run build
```

### Connection Issues:
1. Ensure your HPMREI system is running: `python3 advanced_control.py status`
2. Ensure ngrok is active and the URL is correct in Vercel
3. Check Vercel function logs in your dashboard

### Authentication Issues:
- Clear browser cache/cookies
- Verify password in Vercel environment variables
- Check browser developer console for errors

## 💡 Pro Tips:
1. **Keep ngrok running** - your dashboard stops working when ngrok closes
2. **Bookmark your Vercel URL** - easy access from anywhere
3. **Use Vercel's preview deployments** - every git push creates a preview
4. **Monitor in Vercel dashboard** - see real-time usage and errors

## 🔄 Future Updates:
When you make changes to the dashboard:
```bash
git add .
git commit -m "Update dashboard features"
git push origin main
# Vercel auto-deploys the changes!
```

---

## 📞 Support:
If you encounter any issues, the most common solutions are:
1. Restart ngrok and update the URL in Vercel
2. Restart your HPMREI backend system
3. Clear browser cache and try again
