import React from 'react';
import { X, Search } from 'lucide-react';

const Gallery = ({ images, onRemove, onSelect }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
          <Search size={22} className="text-blue-500" />
          데이터셋 라이브러리 ({images.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((img) => {
          // 서버 데이터 또는 로컬 파일 객체에서 정보 추출
          const fileName = img.name || (img.file ? img.file.name : 'Unknown File');
          const fileSize = img.size || (img.file ? img.file.size : 0);
          const previewUrl = img.url || img.preview;

          return (
            <div 
              key={img.id} 
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 cursor-pointer shadow-lg"
              onClick={() => onSelect(img.id)}
            >
              <div className="aspect-square bg-slate-950 overflow-hidden">
                <img
                  src={previewUrl}
                  alt={fileName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 bg-slate-900/80 backdrop-blur-sm">
                <p className="text-sm font-semibold truncate text-slate-200" title={fileName}>
                  {fileName}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                  {(fileSize / 1024).toFixed(1)} KB
                </p>
              </div>

              {/* Remove Button (서버 데이터인 경우 비활성화 가능) */}
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(img.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
