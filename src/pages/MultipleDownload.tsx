import React from 'react'

const MultipleDownload = () => {
  const handleDownload = (fileNumber: number) => {
    // Teks dalam bahasa Jepang: "tes download sukses"
    const content = `ダウンロードテスト成功 - File ${fileNumber}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `multiple-download-${fileNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Download semua file secara berurutan dengan delay kecil
    [1, 2, 3].forEach((num, index) => {
      setTimeout(() => {
        handleDownload(num);
      }, index * 300); // 300ms delay antar download
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Multiple Download
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Test multiple file downloads
        </p>
        
        <div className="space-y-3 mb-6">
          <button
            id="download-file-1"
            onClick={() => handleDownload(1)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            📥 Download File 1
          </button>

          <button
            id="download-file-2"
            onClick={() => handleDownload(2)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            📥 Download File 2
          </button>

          <button
            id="download-file-3"
            onClick={() => handleDownload(3)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            📥 Download File 3
          </button>
        </div>

        <button
          id="download-all-files"
          onClick={handleDownloadAll}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          📦 Download All Files
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center mb-1">
            Files: <span className="font-mono text-purple-600">multiple-download-[1-3].txt</span>
          </p>
          <p className="text-xs text-gray-500 text-center">
            Content: ダウンロードテスト成功
          </p>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            ← Go to Single Download
          </a>
        </div>
      </div>
    </div>
  )
}

export default MultipleDownload