import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const uploadsDir = path.join('/tmp', 'uploads');
    const filePath = path.join(uploadsDir, filename);

    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileBuffer = await readFile(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ 
      error: 'Failed to download file', 
      details: error.message 
    });
  }
}
