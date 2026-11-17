# Happy Wall — Production Deployment Guide

## 1. Prerequisites
- Node.js `v18.17+` or `v20+` (Node 24 supported)
- Package Manager: `pnpm` (or `npm`)
- Production Environment Variables (if configuring custom analytics or WhatsApp numbers in the future)

---

## 2. Standard Deployment Steps

### 2.1 Build & Static Export
```bash
# Install dependencies
pnpm install

# Run TypeScript checks and production build
pnpm run build

# Start local production preview
pnpm run start
```

---

## 3. Hosting Platforms

### 3.1 Vercel (Recommended)
1. Push repository to GitHub or GitLab.
2. Import project into Vercel Dashboard.
3. Framework Preset: **Next.js**.
4. Root Directory: `./`.
5. Build Command: `next build` (or `pnpm run build`).
6. Output Directory: `.next`.
7. Click **Deploy**. Vercel will deploy globally to their edge network with automated SSL.

### 3.2 Netlify
1. Connect Git repository in Netlify.
2. Build command: `pnpm run build`.
3. Publish directory: `.next`.
4. Deploy site.

### 3.3 Static Docker / Node Server
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 4. Verification Smoke Tests Post-Deployment
1. Verify page loads with 200 OK status.
2. Check browser console for zero runtime JavaScript exceptions.
3. Verify all images load with valid WebP headers and without 404s.
4. Click header WhatsApp button and verify URL resolves to `https://wa.me/917339564538`.
5. Open Product Details Modal, select size A3, click "Order via WhatsApp", and verify prefilled message text.
6. Submit Custom Poster Form with sample values and verify WhatsApp redirection.

