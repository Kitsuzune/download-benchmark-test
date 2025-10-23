import { put } from '@vercel/blob';

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
    // Parse multipart form data manually
    const contentType = req.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    
    if (!boundary) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Simple multipart parser
    const parts = buffer.toString('binary').split(`--${boundary}`);
    const uploadedFiles = [];

    for (const part of parts) {
      if (part.includes('filename=')) {
        // Extract filename
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (!filenameMatch) continue;
        
        const originalFilename = filenameMatch[1];
        
        // Extract content type
        const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/);
        const mimeType = contentTypeMatch ? contentTypeMatch[1] : 'application/octet-stream';
        
        // Extract file data (after double CRLF)
        const dataStart = part.indexOf('\r\n\r\n') + 4;
        const dataEnd = part.lastIndexOf('\r\n');
        const fileData = part.substring(dataStart, dataEnd);
        const fileBuffer = Buffer.from(fileData, 'binary');
        
        if (fileBuffer.length === 0) continue;

        // Upload to Vercel Blob with unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${originalFilename}`;
        
        const blob = await put(filename, fileBuffer, {
          access: 'public',
          contentType: mimeType,
        });

        uploadedFiles.push({
          id: filename,
          name: originalFilename,
          filename: filename,
          path: blob.url,
          downloadUrl: blob.downloadUrl,
          type: mimeType,
          size: fileBuffer.length,
          uploadDate: new Date().toISOString()
        });
      }
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
