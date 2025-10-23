import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    if (req.method === 'GET') {
      // List all files
      if (!existsSync(uploadsDir)) {
        return res.status(200).json({ success: true, files: [] });
      }

      const filenames = await readdir(uploadsDir);
      const files = await Promise.all(
        filenames.map(async (filename) => {
          const filePath = path.join(uploadsDir, filename);
          const stats = await stat(filePath);
          
          return {
            id: filename,
            name: filename,
            filename: filename,
            path: `/uploads/${filename}`,
            size: stats.size,
            uploadDate: stats.birthtime.toISOString()
          };
        })
      );

      return res.status(200).json({ success: true, files });
    }

    if (req.method === 'DELETE') {
      // Delete all files
      if (!existsSync(uploadsDir)) {
        return res.status(200).json({ success: true, message: 'No files to delete' });
      }

      const { unlink } = await import('fs/promises');
      const filenames = await readdir(uploadsDir);
      
      await Promise.all(
        filenames.map(filename => 
          unlink(path.join(uploadsDir, filename))
        )
      );

      return res.status(200).json({ 
        success: true, 
        message: 'All files cleared' 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Files operation error:', error);
    return res.status(500).json({ 
      error: 'Operation failed', 
      details: error.message 
    });
  }
}
