# Download & Upload Testing App

Aplikasi testing untuk download dan upload file dengan Tailwind CSS.

## Features

- ✅ **Single Download** - Download satu file .txt
- ✅ **Multiple Download** - Download beberapa file sekaligus
- ✅ **File Upload** - Upload file ke server dan preview
- ✅ **Google Drive Links** - Link test ke Google Drive
- ✅ **Drag & Drop** - Upload dengan drag & drop
- ✅ **File Preview** - Preview untuk image files
- ✅ **File Management** - Delete individual atau clear all

## Local Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Ini akan menjalankan:
- Vite dev server di http://localhost:5173
- Express backend di http://localhost:3001

### Build for Production
```bash
npm run build
```

## Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Import Project ke Vercel
1. Buka [vercel.com](https://vercel.com)
2. Klik "Add New" → "Project"
3. Import repository GitHub Anda
4. Vercel akan auto-detect Vite project

### 3. Environment & Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)
- **Install Command**: `npm install` (default)

### 4. Deploy!
Klik "Deploy" dan tunggu beberapa menit.

## Cara Kerja di Vercel

### Serverless Functions
Backend Express diubah menjadi Vercel Serverless Functions:
- `/api/upload.js` - Handle file upload
- `/api/files.js` - List & delete all files
- `/api/delete.js` - Delete single file

### File Storage
⚠️ **PENTING**: File yang diupload di Vercel bersifat **temporary**!
- Files disimpan di `/tmp` atau ephemeral filesystem
- Files akan hilang setelah function timeout atau redeploy
- Untuk production, gunakan:
  - **Vercel Blob** (recommended)
  - **AWS S3**
  - **Cloudinary**
  - **UploadThing**

### Local vs Vercel
| Feature | Local (`npm run dev`) | Vercel |
|---------|----------------------|--------|
| Backend | Express server (port 3001) | Serverless Functions |
| File Storage | `public/uploads/` (persistent) | Ephemeral (temporary) |
| Hot Reload | ✅ Yes | ❌ No (need redeploy) |
| API Routes | Proxied via Vite | Native `/api/*` |

## Project Structure

```
tes-download/
├── api/                    # Vercel Serverless Functions
│   ├── upload.js          # Upload handler
│   ├── files.js           # List & clear files
│   └── delete.js          # Delete single file
├── src/
│   ├── pages/
│   │   ├── SingleDownload.tsx
│   │   ├── MultipleDownload.tsx
│   │   └── FileUpload.tsx
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── uploads/           # Local uploads (gitignored)
├── server.js              # Express server (local dev only)
├── vercel.json            # Vercel configuration
└── package.json
```

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body: FormData with 'files' field
```

### List Files
```
GET /api/files
```

### Delete Single File
```
DELETE /api/files/:filename
```

### Delete All Files
```
DELETE /api/files
```

## Button Selectors (for Testing)

### Single Download Page
- `#single-download-btn` - Download button

### Multiple Download Page
- `#download-file-1`, `#download-file-2`, `#download-file-3` - Individual download
- `#download-all-files` - Download all files

### Upload Page
- `#file-upload-input` - File input element
- `#upload-btn` - Upload button trigger
- `#upload-drop-zone` - Drag & drop area
- `#uploaded-file-1`, `#uploaded-file-2`, etc - Uploaded file cards
- `#download-uploaded-file-1`, etc - Download uploaded file
- `#delete-file-1`, etc - Delete file
- `#clear-all-btn` - Clear all files
- `#gdrive-test-image-link` - Google Drive link

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Backend (Local)**: Express + Multer
- **Backend (Vercel)**: Serverless Functions + Multiparty
- **Deployment**: Vercel

## Notes

- File content dalam bahasa Jepang: "ダウンロードテスト成功" (tes download sukses)
- Uploaded files di Vercel akan hilang setelah beberapa waktu
- Untuk persistent storage, integrate dengan cloud storage service
