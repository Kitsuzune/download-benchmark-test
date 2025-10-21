const SingleDownload = () => {
  const handleDownload = () => {
    // Teks dalam bahasa Jepang: "tes download sukses"
    const content = "ダウンロードテスト成功";
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'single-download.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Single Download
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Test single file download
        </p>
        
        <button
          id="single-download-btn"
          onClick={handleDownload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          📥 Download File
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            File: <span className="font-mono text-blue-600">single-download.txt</span>
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            Content: ダウンロードテスト成功
          </p>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/multiple" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Multiple Download →
          </a>
          <span className="text-gray-400 mx-2">•</span>
          <a 
            href="/upload" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            File Upload →
          </a>
        </div>
      </div>
    </div>
  )
}

export default SingleDownload