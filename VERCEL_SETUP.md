# Vercel Deployment Setup Guide

This guide will help you deploy your Facade e-commerce app to Vercel.

## Prerequisites

- All environment variables ready from your `.env.local` file
- Vercel account (sign up at [vercel.com](https://vercel.com))

## Deployment Options

You have **two ways** to deploy:

### Option A: Direct Upload (Quick & Simple) ⚡
**Best for:** Quick deployment without Git setup
- Upload your project folder directly to Vercel
- No GitHub/Git required
- Manual updates (re-upload when you make changes)

### Option B: GitHub Integration (Recommended) 🚀
**Best for:** Automatic deployments and version control
- Connect GitHub repository
- Auto-deploys on every push
- Better for ongoing development

---

## Option A: Direct Upload to Vercel

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2: Deploy from Your Project Folder

```bash
cd C:\Users\mammo\Documents\Facade
vercel
```

Follow the prompts:
- Login to Vercel (will open browser)
- Link to existing project or create new
- Confirm settings (Vercel auto-detects Next.js)

### Alternative: Drag & Drop via Web

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"** (main button on dashboard)
3. Look for **"Deploy"** tab or **"Import"** button
4. Drag your project folder or select it
5. Vercel will upload and deploy

**Note:** If you don't see drag & drop option, use the Vercel CLI method above instead.

**Note:** After first deployment, you'll need to manually upload again for updates.

---

## Option B: GitHub Integration (Recommended)

### Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository** - select the Facade repository
5. **Vercel will auto-detect Next.js** - no build settings needed!

## Step 3: Configure Environment Variables (Both Options)

**Important:** You need to add environment variables regardless of which deployment method you choose.

In the Vercel project setup page (or later in Settings → Environment Variables), add **ALL** of these variables:

### Firebase Configuration (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### EmailJS Configuration (Required)
```
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
EMAILJS_CUSTOMER_TEMPLATE_ID=your_customer_template_id
EMAILJS_SHOP_TEMPLATE_ID=your_shop_template_id
SHOP_EMAIL=your_shop_email@example.com
```

### Cloudinary Configuration (Required for payment slip uploads)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Site URL (Required)
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```
**Note:** After deployment, update this to your actual Vercel URL (e.g., `https://facade-store.vercel.app`)

### Environment Selection

For each variable, select which environments to apply it to:
- ✅ **Production** (your live site)
- ✅ **Preview** (pull request previews)
- ✅ **Development** (local development)

**Important:** Copy the exact values from your `.env.local` file. Make sure there are no extra spaces or quotes.

## Step 4: Deploy

### If using Direct Upload:
- The deployment starts automatically after upload
- Wait 2-3 minutes for build to complete

### If using GitHub Integration:
1. **Click "Deploy"** in Vercel dashboard
2. **Wait 2-3 minutes** for the build to complete

**Your app will be live!** 🎉

You'll get a URL like: `https://your-project.vercel.app`

## Step 5: Update Site URL

After deployment:

1. Go to **Settings → Environment Variables**
2. Find `NEXT_PUBLIC_SITE_URL`
3. Update it to your actual Vercel URL
4. **Redeploy** (or it will auto-update on next push)

## Step 6: Configure Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication → Settings → Authorized domains**
4. Add your Vercel domain: `your-project.vercel.app`
5. If using a custom domain, add that too

## Updating Your App

### If using Direct Upload:
1. Make your changes locally
2. Run `vercel --prod` from your project folder
3. Or drag & drop the updated folder again via Vercel dashboard

### If using GitHub Integration:
**Super simple!** Just push changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel automatically:
- ✅ Detects the new commit
- ✅ Builds your app
- ✅ Deploys the update (~2-3 minutes)
- ✅ Makes it live instantly

You can see deployment progress in the Vercel Dashboard.

## Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Click **Add Domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
6. Update Firebase authorized domains

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard → Deployments
- Verify all environment variables are set correctly
- Make sure all dependencies are in `package.json`

### Environment Variables Not Working
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding/updating variables
- Check for typos in variable names (case-sensitive!)

### Firebase Not Working
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check Firebase Console → Authorized domains includes your Vercel URL
- Verify Firestore Security Rules allow your app

### Emails Not Sending
- Verify all EmailJS variables are set (including `EMAILJS_PRIVATE_KEY`)
- Check EmailJS dashboard for API usage/quota
- Review EmailJS service logs

### Images Not Loading
- Check `next.config.js` has correct image domains
- Ensure images are in `public/images` folder
- For Cloudinary images, verify Cloudinary config is correct

## Quick Checklist

Before deploying, make sure:
- [ ] Code is pushed to GitHub
- [ ] All environment variables are ready
- [ ] Firebase project is set up
- [ ] EmailJS templates are configured
- [ ] Cloudinary account is set up
- [ ] `NEXT_PUBLIC_SITE_URL` will be updated after first deployment

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**That's it!** Your app should now be live on Vercel. 🚀

