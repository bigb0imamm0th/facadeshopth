# Facade E-commerce (Next.js + Firestore + EmailJS)

A simplified e-commerce storefront with:
- Next.js App Router
- Simplified shopping cart with localStorage
- Firestore integration for order storage
- EmailJS integration (2 templates: customer confirmation + shop notification)

## Setup

### 1. Install Dependencies

```bash
npm install
npm install cloudinary
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC80UCIs7V9JRMMyBZIg-Mk8jVQEhUZZY4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=facadeinventory.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=facadeinventory
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=facadeinventory.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=429837493518
NEXT_PUBLIC_FIREBASE_APP_ID=1:429837493518:web:a6afb6571c2c8b5abde35f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-FCNGE8BKXM

# EmailJS Configuration
EMAILJS_SERVICE_ID=facadeemailservices
EMAILJS_PUBLIC_KEY=GlvB80Eqt-dLeBNc-
EMAILJS_CUSTOMER_TEMPLATE_ID=customersidetemplate
EMAILJS_SHOP_TEMPLATE_ID=sidesidetemplate
SHOP_EMAIL=facadeshopth@gmail.com

# Cloudinary (for payment slip uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a collection named `orders` (will be created automatically on first order)
4. Copy your Firebase config values to `.env.local`

### 4. EmailJS Setup

1. Sign up at [EmailJS](https://dashboard.emailjs.com)
2. Create a service (Gmail, Outlook, etc.)
3. Create two email templates:
   - **Customer Template**: Variables: `customer_email`, `customer_name`, `customer_phone`, `customer_address`, `order_lines`, `order_total`, `order_id`
   - **Shop Template**: Variables: `shop_email`, `customer_email`, `customer_name`, `customer_phone`, `customer_address`, `orders` (array), `shipping`, `tax`, `order_total`, `order_id`, `website_link`, `payment_slip`
4. Copy template IDs to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## How It Works

### Cart System
- Simplified cart stored in localStorage
- Items require size selection
- Add/remove items only (quantity increases when adding same item+size)

### Order Flow
1. User adds items to cart
2. User enters name and email
3. On checkout:
   - Order saved to Firestore (`orders` collection)
   - Customer confirmation email sent (EmailJS Template 1)
   - Shop notification email sent (EmailJS Template 2)
   - Cart cleared

### File Structure
- `lib/products.ts` - Product data
- `lib/firebase.ts` - Firebase initialization
- `lib/firestore.ts` - Firestore order saving
- `components/cart/CartContext.tsx` - Simplified cart state
- `app/api/order/route.ts` - Order API (Firestore + EmailJS)

## Deploy

Set all environment variables on your hosting platform (Vercel, etc.)

## EmailJS Shop Template (HTML)

Paste the following HTML into your **shop-side** EmailJS template. EmailJS uses Handlebars-style variables ( `{{variable}}` ), so keep the braces intact. The `orders` loop renders every line item, and the optional `payment_slip` block shows an uploaded receipt when present.

```html
<div
  style="
    font-family: system-ui, sans-serif, Arial;
    font-size: 14px;
    color: #333;
    padding: 14px 8px;
    background-color: #f5f5f5;
  "
>
  <div style="max-width: 600px; margin: auto; background-color: #fff">
    <div style="border-top: 6px solid #458500; padding: 16px">
      <a
        style="text-decoration: none; outline: none; margin-right: 8px; vertical-align: middle"
        href="{{website_link}}"
        target="_blank"
      >
        <img
          style="height: 32px; vertical-align: middle"
          height="32px"
          src="https://i.postimg.cc/6qBYqJWY/facadelogo.png"
          alt="logo"
        />
      </a>
      <span
        style="
          font-size: 16px;
          vertical-align: middle;
          border-left: 1px solid #333;
          padding-left: 8px;
        "
      >
        <strong>Thank You for Your Order</strong>
      </span>
    </div>

    <div style="padding: 0 16px">
      <p>We'll send tracking info once the order ships.</p>

      <div
        style="
          text-align: left;
          font-size: 14px;
          padding-bottom: 4px;
          border-bottom: 2px solid #333;
        "
      >
        <strong>Order # {{order_id}}</strong><br />
        <small>
          Customer: {{customer_name}} · {{customer_email}} · {{customer_phone}}<br />
          Address: {{customer_address}}
        </small>
      </div>

      {{#orders}}
      <table style="width: 100%; border-collapse: collapse">
        <tr style="vertical-align: top">
          <td style="padding: 24px 8px 0 4px; width: 80px">
            <img style="height: 64px" height="64px" src="{{image_url}}" alt="item" />
          </td>
          <td style="padding: 24px 8px 0 8px; width: 100%">
            <div>{{name}}</div>
            <div style="font-size: 14px; color: #888; padding-top: 4px">
              Size: {{size}} · QTY: {{units}}
            </div>
          </td>
          <td style="padding: 24px 4px 0 0; white-space: nowrap">
            <strong>{{price}}</strong>
          </td>
        </tr>
      </table>
      {{/orders}}

      {{#payment_slip}}
      <div style="padding: 24px 0">
        <div style="border-top: 2px solid #333"></div>
        <p style="margin: 16px 0 8px 0"><strong>Payment Slip</strong></p>
        <img
          src="{{payment_slip}}"
          alt="Payment slip"
          style="max-width: 100%; border: 1px solid #eee; border-radius: 4px"
        />
      </div>
      {{/payment_slip}}

      <div style="padding: 24px 0">
        <div style="border-top: 2px solid #333"></div>
      </div>

      <table style="border-collapse: collapse; width: 100%; text-align: right">
        <tr>
          <td style="width: 60%"></td>
          <td>Shipping</td>
          <td style="padding: 8px; white-space: nowrap">{{shipping}}</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td>Taxes</td>
          <td style="padding: 8px; white-space: nowrap">{{tax}}</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td style="border-top: 2px solid #333">
            <strong style="white-space: nowrap">Order Total</strong>
          </td>
          <td style="padding: 16px 8px; border-top: 2px solid #333; white-space: nowrap">
            <strong>{{order_total}}</strong>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div style="max-width: 600px; margin: auto">
    <p style="color: #999">
      Notification sent to {{shop_email}}
    </p>
  </div>
</div>
```

## EmailJS Customer Template (HTML)

Use this for the **customer-side** EmailJS template to match the Facade branding. Update the `href` with your site link if desired.

```html
<div
  style="
    font-family: system-ui, sans-serif, Arial;
    font-size: 14px;
    color: #333;
    padding: 14px 8px;
    background-color: #f5f5f5;
  "
>
  <div style="max-width: 600px; margin: auto; background-color: #fff">
    <div style="border-top: 6px solid #458500; padding: 16px">
      <a
        style="text-decoration: none; outline: none; margin-right: 8px; vertical-align: middle"
        href="{{website_link}}"
        target="_blank"
      >
        <img
          style="height: 32px; vertical-align: middle"
          height="32px"
          src="https://i.postimg.cc/6qBYqJWY/facadelogo.png"
          alt="logo"
        />
      </a>
      <span
        style="
          font-size: 16px;
          vertical-align: middle;
          border-left: 1px solid #333;
          padding-left: 8px;
        "
      >
        <strong>Thank You for Your Order</strong>
      </span>
    </div>

    <div style="padding: 0 16px">
      <p>We'll send you tracking information when the order ships.</p>

      <div
        style="
          text-align: left;
          font-size: 14px;
          padding-bottom: 4px;
          border-bottom: 2px solid #333;
        "
      >
        <strong>Order # {{order_id}}</strong>
      </div>

      {{#orders}}
      <table style="width: 100%; border-collapse: collapse">
        <tr style="vertical-align: top">
          <td style="padding: 24px 8px 0 4px; width: 80px">
            <img style="height: 64px" height="64px" src="{{image_url}}" alt="item" />
          </td>
          <td style="padding: 24px 8px 0 8px; width: 100%">
            <div>{{name}}</div>
            <div style="font-size: 14px; color: #888; padding-top: 4px">QTY: {{units}}</div>
          </td>
          <td style="padding: 24px 4px 0 0; white-space: nowrap">
            <strong>{{price}}</strong>
          </td>
        </tr>
      </table>
      {{/orders}}

      <div style="padding: 24px 0">
        <div style="border-top: 2px solid #333"></div>
      </div>

      <table style="border-collapse: collapse; width: 100%; text-align: right">
        <tr>
          <td style="width: 60%"></td>
          <td>Shipping</td>
          <td style="padding: 8px; white-space: nowrap">{{shipping}}</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td>Taxes</td>
          <td style="padding: 8px; white-space: nowrap">{{tax}}</td>
        </tr>
        <tr>
          <td style="width: 60%"></td>
          <td style="border-top: 2px solid #333">
            <strong style="white-space: nowrap">Order Total</strong>
          </td>
          <td style="padding: 16px 8px; border-top: 2px solid #333; white-space: nowrap">
            <strong>{{order_total}}</strong>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div style="max-width: 600px; margin: auto">
    <p style="color: #999">
      The email was sent to {{customer_email}}<br />
      You received this email because you placed the order.
    </p>
  </div>
</div>
```
## Customization

- Replace products in `lib/products.ts`
- Adjust styles in `app/globals.css`
- Modify email templates in EmailJS using the sample above