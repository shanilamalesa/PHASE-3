# Mctaba Shop

A full-stack e-commerce shop built with Next.js, PostgreSQL, M-Pesa (Daraja), and WhatsApp Cloud API. Customers browse products, check out, pay via M-Pesa STK Push, and receive WhatsApp order confirmations. Admins manage orders through a protected dashboard with status tracking and payment reconciliation.

Built as part of the Mctaba Labs Full-Stack Marathon, Phase 3.

---

## Features

- Product catalogue with categories, search, and SEO (sitemap, robots.txt, Open Graph images)
- Client-side cart with persistence (Zustand + localStorage)
- Multi-step checkout as a guarded state machine (cart → info → payment → confirmed)
- Real M-Pesa STK Push payments via Safaricom Daraja sandbox
- Idempotent payment callback handling with amount verification
- WhatsApp order confirmations sent automatically on successful payment
- Admin dashboard with login, order status transitions, and payment reconciliation
- Public order tracking page (no login required)
- Cash on Delivery (COD) support with its own order lifecycle
- Owner notifications and an admin dashboard chime for new orders

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4 |
| State | Zustand (cart + checkout state machines) |
| Database | PostgreSQL |
| Payments | Safaricom Daraja (M-Pesa STK Push) |
| Notifications | WhatsApp Cloud API (Meta Graph API) |
| Auth | JWT + HttpOnly cookies |
| Backend service | Express.js (payments and notifications) |

---

## Project Structure

\`\`\`
shop/
├── app/
│   ├── actions/          Server Actions (createOrder, payments, orders, auth)
│   ├── admin/             Admin login + orders dashboard
│   ├── api/admin/         Internal API routes (order count for chime)
│   ├── cart/               Cart page
│   ├── checkout/          Checkout flow (info, payment, awaiting-payment, confirmed)
│   ├── components/      Shared UI components
│   ├── my-orders/        Customer order lookup by phone
│   ├── products/           Product catalogue, category pages, product detail
│   ├── track/[shortId]/   Public order tracking
│   ├── layout.js, page.js, globals.css
│   ├── robots.js, sitemap.js
├── lib/                     Database connection, Zustand stores
├── server/                 Express service for payments + WhatsApp
│   ├── config/             Database and environment config
│   ├── controllers/      Request handlers
│   ├── routes/              /api/payments, /api/orders
│   ├── services/           STK push, callback handling, WhatsApp sending
│   └── index.js
└── public/                 Static assets (chime.wav, etc.)
\`\`\`

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A Safaricom Daraja sandbox account (consumer key/secret)
- A Meta WhatsApp Cloud API test number

### 1. Clone and install

\`\`\`bash
git clone https://github.com/shanilamalesa/PHASE-3.git
cd PHASE-3/shop
npm install

cd server
npm install
\`\`\`

### 2. Set up the database

\`\`\`sql
CREATE DATABASE crm;
\`\`\`

Run the schema migrations found in the project notes (products, orders, order_items, messages, users tables).

### 3. Environment variables

Create \`shop/.env.local\`:

\`\`\`
DB_HOST=localhost
DB_PORT=5432
DB_USER=crm_user
DB_PASSWORD=crm_dev_password
DB_NAME=crm
JWT_SECRET=your_jwt_secret
CRM_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_CRM_URL=http://localhost:5000
\`\`\`

Create \`shop/server/.env\`:

\`\`\`
PORT=5000
DATABASE_URL=postgresql://crm_user:crm_dev_password@localhost:5432/crm
JWT_SECRET=your_jwt_secret
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379
MPESA_PASSKEY=...
MPESA_CALLBACK_URL=https://<your-ngrok-url>/api/payments/callback
META_ACCESS_TOKEN=...
META_PHONE_NUMBER_ID=...
USE_WHATSAPP_TEMPLATE=false
SHOP_OWNER_PHONE=+254700000000
\`\`\`

### 4. Run the app

In one terminal, start the Express payments service:

\`\`\`bash
cd shop/server
node index.js
\`\`\`

In another terminal, start the Next.js shop:

\`\`\`bash
cd shop
npm run dev
\`\`\`

If testing M-Pesa callbacks locally, expose the Express server with ngrok and update \`MPESA_CALLBACK_URL\`:

\`\`\`bash
ngrok http 5000
\`\`\`

Visit **http://localhost:3000** for the shop, and **http://localhost:3000/admin/login** for the admin dashboard.

---

## How Payments Work

\`\`\`
Customer clicks Pay
  → Next.js Server Action creates the order in Postgres
  → Calls the Express server's STK Push endpoint
  → Express requests an OAuth token from Daraja
  → Express sends the STK Push to the customer's phone
  → Customer enters their M-Pesa PIN
  → Daraja calls the Express callback webhook
  → Express verifies the amount, marks the order paid
  → Express sends a WhatsApp confirmation to the customer and the shop owner
  → The customer's browser polls for status and redirects to the confirmation page
\`\`\`

All payment callbacks are idempotent — duplicate webhook calls from Daraja are detected and skipped safely.

---

## Admin Dashboard

Log in at \`/admin/login\`. From \`/admin/orders\`, an admin can:

- Filter orders by status
- View full order details, including items and customer info
- Move orders through their lifecycle: pending → paid → shipped → delivered
- Cancel orders (automatically restocks the items)
- Manually reconcile a payment with Daraja if a callback never arrives

---

## Known Limitations

- WhatsApp sandbox messages only deliver to numbers that have opted in within the last 24 hours
- M-Pesa STK Push only works with Kenyan-format phone numbers
- The admin chime requires a browser click before audio is allowed to autoplay

---

## License

Built for educational purposes as part of the Mctaba Labs Full-Stack Marathon.