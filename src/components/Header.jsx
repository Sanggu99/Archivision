import React from 'react';
import { Download, LayoutPanelLeft } from 'lucide-react';
import JSZip from 'jszip';

const Header = ({ images }) => {
  const handleExport = async () => {
    if (!images || images.length === 0) {
      alert('데이터가 없습니다.');
      return;
    }

    const zip = new JSZip();
    const imgFolder = zip.folder('images');
    const labelFolder = zip.folder('labels');

    for (const img of images) {
      const fileName = img.name || (img.file ? img.file.name : `image_${img.id}.png`);
      const baseName = fileName.split('.')[0];

      // 1. 이미지 추가
      if (img.file) {
        imgFolder.file(fileName, img.file);
      } else if (img.url) {
        // 서버에서 이미지를 가져와서 zip에 넣기
        try {
          const response = await fetch(img.url);
          const blob = await response.blob();
          imgFolder.file(fileName, blob);
        } catch (e) {
          console.error(`Failed to fetch image for zip: ${fileName}`, e);
        }
      }

      // 2. 라벨 추가 (JSON에서 YOLO 텍스트 생성)
      if (img.annotation && img.annotation.objects) {
        const CLASS_MAPPING = { "door": 0, "window": 1, "room": 2, "wall": 3, "furniture": 4, "equipment": 5 };
        const lines = img.annotation.objects.map(obj => {
          const classId = CLASS_MAPPING[obj.category] ?? 0;
          return `${classId} ${obj.bbox.join(' ')}`;
        });
        labelFolder.file(`${baseName}.txt`, lines.join('\n'));
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = 'dataset_mlops.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-900">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl shadow-lg shadow-blue-500/20">
          <LayoutPanelLeft size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white uppercase">AI DRAWING CENTER</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">MLOps Pipeline v2.0</p>
        </div>
      </div>

      <button
        onClick={handleExport}
        className="group relative flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95"
      >
        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
        <span>코랩용 데이터셋 (.zip)</span>
      </button>
    </header>
  );
};

export default Header;
