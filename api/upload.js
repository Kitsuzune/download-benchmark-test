import formidable from 'formidable';
import { mkdir, copyFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use /tmp directory which is writable in Vercel
    const uploadsDir = path.join('/tmp', 'uploads');
    
    // Create uploads directory if not exists
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Parse form with formidable
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFiles: 10,
      multiples: true,
    });

    const [fields, files] = await form.parse(req);
    
    const uploadedFiles = [];
    const fileArray = files.files || [];
    
    for (const file of fileArray) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = uniqueSuffix + '-' + file.originalFilename;
      const newPath = path.join(uploadsDir, filename);
      
      // Move file to new location with unique name
      await copyFile(file.filepath, newPath);
      
      uploadedFiles.push({
        id: filename,
        name: file.originalFilename,
        filename: filename,
        path: `/api/download?filename=${filename}`,
        type: file.mimetype,
        size: file.size,
        uploadDate: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}
