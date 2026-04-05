import React, { useState } from 'react';
import { X, Download, Plus, Minus } from 'lucide-react';

export default function PDFViewer({ pdfUrl, title, onClose }) {
  const [scale, setScale] = useState(100);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 10, 300));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'document.pdf';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col z-50" dir="rtl">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-lg font-semibold truncate max-w-2xl">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition ml-2"
        >
          <X size={24} />
        </button>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded text-sm transition flex items-center gap-1"
          >
            <Minus size={16} /> تصغير
          </button>
          <span className="text-sm font-medium w-16 text-center">
            {scale}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded text-sm transition flex items-center gap-1"
          >
            تكبير <Plus size={16} />
          </button>
        </div>

        <button
          onClick={handleDownload}
          title="تحميل الملف"
          className="p-2 hover:bg-gray-700 rounded-lg transition text-green-400 flex items-center gap-1"
        >
          <Download size={20} /> تحميل
        </button>
      </div>

      {/* PDF Viewer using iframe */}
      <div className="flex-1 overflow-auto bg-black p-4">
        <div className="w-full h-full flex justify-center items-center">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&zoom=${scale}`}
              style={{
                width: '95%',
                height: '95%',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}
              title="PDF Viewer"
              allowFullScreen
            />
          ) : (
            <div className="text-white text-center">
              <p>لا يوجد ملف لعرضه</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
