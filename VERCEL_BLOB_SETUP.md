# Vercel Blob Setup Guide

## 🚀 Setup Vercel Blob Storage

### 1. Create Blob Store di Vercel Dashboard

1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Klik tab **"Storage"**
4. Klik **"Create Database"** atau **"Connect Store"**
5. Pilih **"Blob"**
6. Klik **"Create"**
7. Berikan nama (contoh: `upload-storage`)

### 2. Copy Environment Variable

Setelah Blob store dibuat:
1. Vercel akan otomatis generate `BLOB_READ_WRITE_TOKEN`
2. Token ini akan otomatis tersedia di environment variables project Anda
3. **Tidak perlu setup manual!** ✅

### 3. Deploy

```bash
git add .
git commit -m "Add Vercel Blob storage"
git push
```

Vercel akan auto-deploy dan inject `BLOB_READ_WRITE_TOKEN` ke serverless functions.

## 📦 Cara Kerja

### Upload Flow:
1. User upload file via frontend
2. File dikirim ke `/api/upload`
3. Backend upload ke **Vercel Blob** menggunakan `@vercel/blob`
4. Blob return public URL (permanent!)
5. Frontend dapat URL untuk display/download

### Storage:
- ✅ **Persistent** - Files tidak hilang
- ✅ **Public URLs** - Bisa diakses langsung
- ✅ **Free tier**: 500MB storage
- ✅ **CDN optimized** - Fast global access

### API Endpoints:

#### Upload File
```
POST /api/upload
Content-Type: multipart/form-data
```

#### List Files
```
GET /api/files
```

#### Delete File
```
DELETE /api/files/:filename
```

#### Delete All
```
DELETE /api/files
```

## 🔑 Environment Variables

### Vercel (Production)
Tidak perlu setup manual! Setelah create Blob store, Vercel auto-inject:
- `BLOB_READ_WRITE_TOKEN`

### Local Development
Untuk testing di local:

1. Copy `.env.example` ke `.env.local`
2. Get token dari Vercel Dashboard → Settings → Environment Variables
3. Copy `BLOB_READ_WRITE_TOKEN` value
4. Paste ke `.env.local`

```bash
# .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

Jalankan dengan:
```bash
npm run dev
```

## 💰 Vercel Blob Pricing

### Free Tier (Hobby):
- ✅ 500 MB storage
- ✅ Unlimited bandwidth
- ✅ Perfect untuk testing

### Pro:
- 100 GB storage ($0.15/GB after)
- Unlimited bandwidth

## 🎯 Benefits vs /tmp Filesystem

| Feature | /tmp Filesystem | Vercel Blob |
|---------|----------------|-------------|
| **Persistent** | ❌ Files hilang | ✅ Permanent |
| **Cross-invocation** | ❌ Per container | ✅ Shared |
| **CDN** | ❌ No | ✅ Yes |
| **Direct URLs** | ❌ Need proxy | ✅ Direct access |
| **Reliability** | ❌ Low | ✅ High |

## 🔧 Troubleshooting

### Error: "Missing BLOB_READ_WRITE_TOKEN"
**Solution:**
1. Pastikan sudah create Blob store di Vercel Dashboard
2. Redeploy project setelah create store
3. Check di Settings → Environment Variables

### Files tidak muncul
**Solution:**
1. Check browser console untuk errors
2. Verify Blob store sudah connected
3. Test upload sekali lagi

### Local dev tidak jalan
**Solution:**
1. Copy token dari Vercel Dashboard
2. Create `.env.local` dengan `BLOB_READ_WRITE_TOKEN`
3. Restart dev server

## ✨ Done!

Setelah setup Blob store dan push, aplikasi akan:
- ✅ Upload files ke Vercel Blob (persistent!)
- ✅ List files dari Blob storage
- ✅ Delete files dari Blob
- ✅ Display images with direct URLs
- ✅ Download files with direct URLs

**No more temporary files!** 🎉
