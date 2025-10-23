import React, { useState, useEffect } from 'react'

interface UploadedFile {
  id: string;
  name: string;
  filename: string;
  path: string;
  type?: string;
  size: number;
  uploadDate: string;
}

const FileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load files from server on mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files');
      const data = await response.json();
      if (data.success) {
        setUploadedFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh file list
        await fetchFiles();
        alert(`✅ ${data.message}`);
      } else {
        alert('❌ Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
    e.target.value = ''; // Reset input
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.path;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/files/${filename}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchFiles();
        alert('✅ File deleted');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Delete failed');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all files?')) return;
    
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchFiles();
        alert('✅ All files cleared');
      }
    } catch (error) {
      console.error('Clear all error:', error);
      alert('❌ Clear all failed');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          File Upload Test
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Upload and manage test files
        </p>

        {/* Google Drive Test Links */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            📁 Google Drive Test Files
          </h2>
          <div className="space-y-3 text-center">
            <div>
              <a
                id="gdrive-test-image-link"
                href="https://drive.google.com/file/d/12GNZ1JCq3o-kossYNIxcfpi0pQdqFpQM/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                https://drive.google.com/file/d/12GNZ1JCq3o-kossYNIxcfpi0pQdqFpQM/view?usp=sharing
              </a>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div
            id="upload-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-green-400'
            }`}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-700 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Support all file types
            </p>
            <div className="mt-4 flex flex-col items-center gap-3">
              <input
                id="file-upload-input"
                type="file"
                multiple
                onChange={handleFileInput}
                disabled={isUploading}
                className="block w-full max-w-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 disabled:opacity-50"
                aria-label="Select files to upload"
              />

              <button
                id="upload-btn"
                onClick={() => document.getElementById('file-upload-input')?.click()}
                type="button"
                disabled={isUploading}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? '⏳ Uploading...' : '📁 Select Files'}
              </button>

              <p className="text-xs text-gray-400">Or drag & drop files into the area above</p>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Uploaded Files ({uploadedFiles.length})
              </h2>
              <button
                id="clear-all-btn"
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
              >
                🗑️ Clear All
              </button>
            </div>

            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={file.id}
                  id={`uploaded-file-${index + 1}`}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {file.type?.startsWith('image/') ? '🖼️' :
                           file.type?.startsWith('text/') ? '📄' :
                           file.type?.startsWith('video/') ? '🎥' :
                           file.type?.startsWith('audio/') ? '🎵' :
                           '📎'}
                        </span>
                        <div>
                          <p className="font-semibold text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        id={`download-uploaded-file-${index + 1}`}
                        onClick={() => handleDownloadFile(file)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        ⬇️ Download
                      </button>
                      <button
                        id={`delete-file-${index + 1}`}
                        onClick={() => handleDeleteFile(file.filename)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        ❌
                      </button>
                    </div>
                  </div>

                  {/* Preview for images */}
                  {file.type?.startsWith('image/') && (
                    <div className="mt-3">
                      <img
                        src={file.path}
                        alt={file.name}
                        className="max-h-48 rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-500 text-lg">
              No files uploaded yet. Upload some files to see them here!
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <a 
            href="/" 
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            ← Single Download
          </a>
          <span className="text-gray-400">•</span>
          <a 
            href="/multiple" 
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Multiple Download →
          </a>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
