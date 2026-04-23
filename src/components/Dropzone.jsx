import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const Dropzone = ({ onUpload }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="relative group cursor-pointer"
      >
        <input
          type="file"
          multiple
          accept="image/*,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-700 bg-surface/30 rounded-2xl transition-all duration-300 group-hover:border-blue-500/50 group-hover:bg-blue-500/5">
          <div className="p-4 bg-slate-800 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-900/30">
            <UploadCloud size={40} className="text-slate-400 group-hover:text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-slate-200">
            도면 이미지를 드래그하거나 클릭하여 업로드하세요
          </p>
          <p className="text-sm text-slate-500 mt-2">
            PNG, JPG 형식 지원 (여러 장 선택 가능)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
