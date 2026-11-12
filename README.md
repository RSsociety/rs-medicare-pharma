# RS Medicare Pharma — B2B Pharma & Medical Products Platform

Premium B2B pharmaceutical distribution website with a searchable catalogue, guest ordering,
freight-review workflow, order tracking, enquiry pipeline and a secured admin console.

## Stack
- Next.js (App Router, TypeScript) + Tailwind CSS v4
- PostgreSQL + Drizzle ORM
- Cookie session admin auth (HMAC signed, httpOnly)

## Running locally
```bash
npm install
npx drizzle-kit push     # create tables
npm run dev              # http://localhost:3000
```
The catalogue seeds itself on first request (`src/db/seed.ts` → `ensureSeeded()`), using the
data in `src/db/seed-data.ts`.

## Environment variables
| Key | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | local sandbox URL |
| `ADMIN_EMAIL` | Admin login email | admin@rsmedicarepharma.com |
| `ADMIN_PASSWORD` | Admin login password | RSMedicare@2026 |
| `ADMIN_SESSION_SECRET` | HMAC secret for session cookies | dev fallback |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO/sitemap | https://rsmedicarepharma.com |

Set a strong `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` before deploying.

## Adding / editing products
1. Sign in at `/admin` → **Products**.
2. Create or edit a product. Required fields: name, SKU, base price. All catalogue fields are
   editable: description, specifications (`Key: Value` lines), applications, image paths, pack size,
   unit, weight, MOQ, stock, low-stock threshold, tax rate, freight rule, SEO metadata and status.
3. **Weight per unit (kg)** drives the consignment weight used by the freight worksheet — enter the
   real shipping weight of one sellable unit (e.g. a 100-glove box ≈ 0.55 kg).
4. Deactivate instead of deleting when a line is seasonal — inactive products stay out of the storefront.
4. Product images currently reference files in `public/images`. Replace those files or connect an
   object-storage provider and store the returning URL in the `images` array.

## ⚡ I need this: changing prices, images (and the ".html" question)

### There is no `.html` file — and you don't need one
This is a **Next.js** application, not a static HTML site. Pages are rendered by the server on every
request, so the source tree contains `.tsx` files (React components) and **zero `.html` files**.
URLs have no extension either.

| You want | Open this URL |
| --- | --- |
| Homepage | `http://localhost:3000/` (not `index.html`) |
| Products list | `http://localhost:3000/products` |
| One product | `http://localhost:3000/products/<product-slug>` |
| Admin panel | `http://localhost:3000/admin` |

Run the dev server with `npm run dev` (or `npm run build && npm run start` for production) and use
the URLs above. Never open files inside `.next/` — those are internal build artifacts, not pages.
To find a product's slug, open the product in the admin list, or check the `slug` column in the
`products` table.

### Change a PRICE (30 seconds, no code, no restart)
1. Go to **`/admin`** → sign in → **Products**.
2. On the product row click **“edit price”**.
3. Change **Base price (₹)**, **GST rate (%)**, **MOQ** or **Stock quantity** → **Save change**.
4. Refresh the storefront. The new price is live everywhere (catalogue, product page, cart, admin).

Notes:
- Price is stored in the database column `products.base_price` — **not** in any file, so edits
  survive rebuilds and redeploys.
- Quick edit covers price/tax/MOQ/stock. For name, description, specifications, images and SEO,
  click **Edit** to open the full product form.
- Keep base price **centralised**. Never fold freight into it — freight belongs on the order's
  freight worksheet.
- Changing `base_price` does **not** rewrite prices of orders already placed (order items store a
  snapshot of the price at order time). That is intentional.

### Change an IMAGE (upload it — no file access needed)
1. **`/admin`** → **Products** → **Edit** on the product you want.
2. In **“Specifications, applications & images”** use the image manager:
   - **⬆ Upload image** — pick a JPG/PNG/WEBP/AVIF/GIF file (max 4 MB; multiple files allowed).
   - or **…or paste an image URL** — for an externally hosted image.
3. Hover a thumbnail to **Remove** it, or **Make main** to set the primary catalogue image.
4. **Save** → the storefront shows the new image immediately.

How images are stored:
- Uploaded files are written to the **`uploads` table in PostgreSQL** and served from
  `/api/uploads/<id>` with a one-year immutable cache header. They survive rebuilds and need no
  server or FTP access.
- The bundled demo photos live in `public/images/*.jpg` and can be referenced as
  `/images/glovx-nitrile.jpg`. Replacing those files requires repository access and a rebuild, so
  prefer uploading.
- Recommended size: **1200 × 900 px**, under 300 KB, product on a light background.
- Cache tip: because URLs are content-addressed by id, a newly uploaded image is always fresh.
  If you overwrite an old URL and still see the old picture, hard-refresh (Ctrl/Cmd + Shift + R).

### Change PRICE or IMAGE for many products at once
Use SQL against the `products` table (or connect any Postgres client):
```sql
-- raise every Glov-X glove price by 10%
UPDATE products SET base_price = round(base_price * 1.10, 2)
WHERE brand_id = (SELECT id FROM brands WHERE slug = 'glov-x');

-- point one product at a different uploaded image
UPDATE products SET images = '["/api/uploads/12"]' WHERE sku = 'GLX-NIT-ECO-3G';
```

### New products, categories and brands
- **New product**: `/admin` → Products → **+ Add Product** (only name, SKU and base price are required).
- **Categories / brands**: seeded from `src/db/seed-data.ts`; edit rows directly in the `categories`
  and `brands` tables — the storefront filters read them live.

## Pricing, tax & freight architecture (Option A — manual freight)
- `products.base_price` is the single centralised price per `unit` and is identical in every market.
- GST is applied at checkout using `products.tax_rate`, or disabled globally in Admin → Settings.
- **Freight is manual-only.** The automated / flat-rate freight mode has been removed so freight can
  never be absorbed into a product price.
  - Checkout always shows *Freight — under review*; `orders.freight` is stored as `null`.
  - Every new order is created with status **"Freight Under Review"** (risk-flagged orders go to
    "Order Under Review").
  - `products.weight_kg` (weight per sellable unit) is multiplied by the ordered quantity to
    pre-fill the consignment weight on the order.

### Admin freight worksheet
On **Admin → Orders → order detail**, the dispatch desk calculates freight from:
- delivery location (city / state / pincode, shown automatically)
- billable weight in kg (pre-filled from the catalogue, editable for chargeable weight)
- shipment mode — Road, Courier, Air, Rail, Customer Pickup
- itemised charges: line-haul/courier, packing & handling, fuel surcharge, loading/unloading,
  transit insurance, other (out-of-area, tolls, detention)
- a free-text route / transporter / slab reference

The worksheet live-computes the freight total plus **per-kg**, **per-unit** and **freight share of
order value**, shows the recomputed final payable, and writes the breakdown to
`orders.freight_breakdown`. **Confirm freight & notify** sets the status to "Freight Calculated";
**Save draft** keeps the order at "Freight Under Review".

Final payable is always `product value + GST + confirmed freight − discount`, itemised on the
customer tracking page, order confirmation and the printable invoice.

## Order lifecycle
`Order Received → Order Under Review → Freight Under Review → Freight Calculated → Payment Pending →
Payment Confirmed → Processing → Packed → Dispatched → In Transit → Delivered` (or `Cancelled`).

Customers track orders at `/track` with Order ID + mobile/email. Reorder is available from the
tracking and confirmation pages.

## API surface
| Route | Method | Purpose |
| --- | --- | --- |
| `/api/orders` | POST | Guest checkout, server-side repricing + stock update |
| `/api/enquiries` | POST | Bulk / dealer / institutional / contact enquiries |
| `/api/admin/login`, `/api/admin/logout` | POST | Admin session |
| `/api/admin/products` | POST | Create product |
| `/api/admin/products/[id]` | PATCH / DELETE | Update, toggle, delete |
| `/api/admin/orders/[id]` | PATCH | Status, payment, freight, tracking |
| `/api/admin/orders/export` | GET | CSV export of orders |
| `/api/admin/enquiries/[id]` | PATCH | Enquiry status + notes |
| `/api/admin/settings` | PATCH | Store settings |
| `/api/health` | GET | Healthcheck |

All admin routes verify the signed session cookie. Public writes are rate-limited
(`src/lib/rate-limit.ts`). Orders are always repriced on the server from the database.

## SEO
Per-page metadata, canonical URLs, Open Graph, Organization + WebSite + Product + Breadcrumb + FAQ
JSON-LD, dynamic `sitemap.xml` and `robots.txt`. Checkout, confirmation, admin and API routes are
excluded from indexing.

## Before production
- Replace placeholder contact details (phone, address) through Admin → Settings and `src/lib/site.ts`.
- Confirm GST rates and invoicing format with your tax advisor.
- Connect a payment gateway, WhatsApp Business API / SMS provider and shipping API (the order and
  settings models already separate payment method, payment status and freight).
- Configure object storage for product images and move rate limiting to a shared store.
- Review the privacy, returns and shipping policies with legal counsel.
