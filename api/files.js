import { list, del } from '@vercel/blob';

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

  try {
    if (req.method === 'GET') {
      // List all files from Vercel Blob
      const { blobs } = await list();
      
      const files = blobs.map(blob => ({
        id: blob.pathname,
        name: blob.pathname,
        filename: blob.pathname,
        path: blob.url,
        downloadUrl: blob.downloadUrl,
        size: blob.size,
        uploadDate: blob.uploadedAt
      }));

      return res.status(200).json({ success: true, files });
    }

    if (req.method === 'DELETE') {
      // Delete all files from Vercel Blob
      const { blobs } = await list();
      
      for (const blob of blobs) {
        await del(blob.url);
      }

      return res.status(200).json({ 
        success: true, 
        message: `${blobs.length} file(s) cleared` 
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
