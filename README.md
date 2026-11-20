# Nxrdenstore

Digital storefront web application featuring automated QRIS payment verification, Firebase persistence, and Cloudinary media storage.

## Features

* Digital product catalog and checkout workflow
* QRIS payment processing with automated QR decoding (`jsqr`, `jimp`)
* Dynamic QR code generation with `qrcode.react`
* Real-time database and administration with Firebase and Firebase Admin
* Fluid UI transitions powered by Framer Motion and Tailwind CSS

## Tech Stack

* Next.js 16
* React 19
* Firebase and Firebase Admin SDK
* Cloudinary
* Framer Motion
* Tailwind CSS v4

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env.local`:

```ini
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_URL=your_cloudinary_url
```

3. Start development server:

```bash
npm run dev
```