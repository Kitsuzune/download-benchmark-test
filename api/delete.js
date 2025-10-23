import { del, list } from '@vercel/blob';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    // Find blob by pathname
    const { blobs } = await list();
    const blob = blobs.find(b => b.pathname === filename);

    if (!blob) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete from Vercel Blob
    await del(blob.url);

    return res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      error: 'Failed to delete file', 
      details: error.message 
    });
  }
}
