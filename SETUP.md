# Setup & Verification Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables** (`.env.local`):
   ```env
   # Firebase (Required for order storage)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # EmailJS (Required for order emails)
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_CUSTOMER_TEMPLATE_ID=customer_template_id
   EMAILJS_SHOP_TEMPLATE_ID=shop_template_id
   SHOP_EMAIL=your_shop_email@example.com
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

## Verification Checklist

### ✅ Cart Functionality
- [ ] Select a size on product page
- [ ] "Add to Cart" button turns black when size is selected
- [ ] Item appears in cart with correct size
- [ ] Can add multiple items
- [ ] Cart persists after page refresh (localStorage)

### ✅ Order Processing
- [ ] Fill in name and email in cart
- [ ] Click "Check out"
- [ ] Success message appears
- [ ] Cart clears after successful order

### ✅ Firestore Integration
- [ ] Order appears in Firestore `orders` collection
- [ ] Order document contains:
  - customerEmail
  - customerName
  - items array
  - total
  - createdAt timestamp
  - status: "pending"

### ✅ EmailJS Integration
- [ ] Customer receives confirmation email
- [ ] Shop receives notification email
- [ ] Both emails contain:
  - Order items with sizes
  - Total amount
  - Order ID

## Troubleshooting

### Firebase Not Working
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Verify Firebase project has Firestore enabled
- Check browser console for Firebase errors
- Orders will still process (emails will send) even if Firestore fails

### EmailJS Not Working
- Verify `EMAILJS_SERVICE_ID` and `EMAILJS_PUBLIC_KEY` are set
- Check template IDs are correct
- Verify email templates have correct variable names
- Check EmailJS dashboard for send logs

### Cart Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Check browser console for errors

## Current Web Standards Compliance

✅ **Next.js 14** - App Router
✅ **React 18** - Latest hooks and patterns
✅ **TypeScript** - Full type safety
✅ **Firebase 10** - Latest SDK
✅ **Modern ES6+** - Async/await, arrow functions
✅ **Responsive Design** - Works on all devices

