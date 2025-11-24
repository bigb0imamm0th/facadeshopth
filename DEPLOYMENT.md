# Deployment Guide

This guide covers how to deploy your Facade e-commerce app and update it later.

## 🚀 Quick Start: Deploy to Vercel (Recommended)

**Vercel** is made by the Next.js team and offers the easiest deployment experience.

### First-Time Deployment

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/facade-store.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Your Project → Settings → Environment Variables, add all these:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   
   EMAILJS_SERVICE_ID=your_emailjs_service_id
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_PRIVATE_KEY=your_emailjs_private_key
   EMAILJS_CUSTOMER_TEMPLATE_ID=your_emailjs_customer_template_id
   EMAILJS_SHOP_TEMPLATE_ID=your_emailjs_shop_template_id
   SHOP_EMAIL=your_shop_email@example.com
   
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

   ⚠️ **Important**: Copy values from your `.env.local` file. Use the same values for Production, Preview, and Development environments.

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Updating Your App Later

**It's super simple!** Just push changes to GitHub:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel automatically:
- ✅ Detects the new commit
- ✅ Builds your app
- ✅ Deploys the update (takes ~2-3 minutes)
- ✅ Makes it live instantly

You can see deployment progress in the Vercel Dashboard.

---

## 🔄 Alternative Deployment Options

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add all the same env vars from `.env.local`

5. **Updates**: Same as Vercel - just `git push` and Netlify auto-deploys

### Option 3: Self-Hosted (VPS/Server)

If you want to host on your own server:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Run in production**
   ```bash
   npm start
   ```

3. **Use a process manager** (PM2 recommended)
   ```bash
   npm install -g pm2
   pm2 start npm --name "facade-store" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up reverse proxy** (nginx/Apache) to handle HTTPS
5. **For updates**: Pull latest code, rebuild, and restart:
   ```bash
   git pull
   npm install
   npm run build
   pm2 restart facade-store
   ```

---

## 📝 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All environment variables are ready
- [ ] `NEXT_PUBLIC_SITE_URL` points to your deployment URL
- [ ] Firebase allows your production domain (check Firebase Console → Authentication → Authorized domains)
- [ ] EmailJS templates are configured correctly
- [ ] Cloudinary is set up
- [ ] All images are in the `public` folder (they'll be deployed automatically)
- [ ] Test the checkout flow locally one more time

---

## 🔧 Important Notes

### Environment Variables

- **`NEXT_PUBLIC_*`** variables are exposed to the browser (safe for public keys)
- **Non-prefixed** variables (like `EMAILJS_PRIVATE_KEY`, `CLOUDINARY_API_SECRET`) are server-only
- **Never commit** `.env.local` to Git (it should be in `.gitignore`)

### Updating Environment Variables

If you need to change env vars after deployment:

1. **Vercel**: Settings → Environment Variables → Edit → Redeploy
2. **Netlify**: Site settings → Environment variables → Edit → Trigger redeploy

### Custom Domain

1. **Vercel**: Settings → Domains → Add your domain
2. **Netlify**: Domain settings → Add custom domain
3. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
4. Update Firebase authorized domains

### Rollback

If something breaks:

- **Vercel/Netlify**: Dashboard → Deployments → Click the old deployment → "Promote to Production"
- Or revert the commit and push again

---

## 🐛 Troubleshooting

### Build Fails

- Check build logs in Vercel/Netlify dashboard
- Make sure all dependencies are in `package.json`
- Verify environment variables are set

### Images Not Loading

- Check `next.config.js` has correct image domains
- Ensure images are in `public/images` folder
- For external images, add domains to `remotePatterns`

### Firebase Not Working

- Verify all Firebase env vars are set
- Check Firebase Console → Project Settings → Add your production domain to authorized domains
- Make sure Firestore Security Rules allow your app

### Emails Not Sending

- Verify EmailJS env vars (including private key)
- Check EmailJS dashboard for API usage/quota
- Review EmailJS service logs

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**TL;DR**: Push to GitHub → Connect to Vercel → Add env vars → Deploy. For updates, just `git push` - it auto-deploys! 🎉

