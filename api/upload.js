import multiparty from 'multiparty';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    const form = new multiparty.Form();
    
    const uploadedFiles = await new Promise((resolve, reject) => {
      const files = [];
      
      form.on('part', async (part) => {
        if (!part.filename) {
          part.resume();
          return;
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = uniqueSuffix + '-' + part.filename;
        const filepath = path.join(uploadsDir, filename);

        const chunks = [];
        part.on('data', (chunk) => chunks.push(chunk));
        
        part.on('end', async () => {
          try {
            await writeFile(filepath, Buffer.concat(chunks));
            files.push({
              id: filename,
              name: part.filename,
              filename: filename,
              path: `/api/download?filename=${filename}`,
              type: part.headers['content-type'],
              size: Buffer.concat(chunks).length,
              uploadDate: new Date().toISOString()
            });
          } catch (err) {
            reject(err);
          }
        });
      });

      form.on('close', () => resolve(files));
      form.on('error', (err) => reject(err));
      
      form.parse(req);
    });

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
