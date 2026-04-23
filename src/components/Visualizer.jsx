import React, { useEffect, useRef } from 'react';

const CATEGORY_COLORS = {
  door: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.2)', label: 'DOOR' },
  window: { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.2)', label: 'WINDOW' },
  room: { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.1)', label: 'ROOM' },
  wall: { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.2)', label: 'WALL' },
  furniture: { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.2)', label: 'FURNITURE' },
  equipment: { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.2)', label: 'EQUIPMENT' }
};

const Visualizer = ({ image, annotation }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = image.url || image.preview;

    img.onload = () => {
      const container = containerRef.current;
      const displayWidth = container.clientWidth;
      const scale = displayWidth / img.width;
      const displayHeight = img.height * scale;

      canvas.width = img.width;
      canvas.height = img.height;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // JSON Annotation 렌더링
      if (annotation && annotation.objects) {
        annotation.objects.forEach(obj => {
          const [xCenter, yCenter, width, height] = obj.bbox;
          const style = CATEGORY_COLORS[obj.category] || CATEGORY_COLORS.door;

          const x = (xCenter - width / 2) * canvas.width;
          const y = (yCenter - height / 2) * canvas.height;
          const w = width * canvas.width;
          const h = height * canvas.height;

          // 박스 채우기 (면적 표시)
          ctx.fillStyle = style.fill;
          ctx.fillRect(x, y, w, h);

          // 테두리 그리기
          ctx.strokeStyle = style.stroke;
          ctx.lineWidth = Math.max(2, canvas.width / 500);
          ctx.strokeRect(x, y, w, h);

          // 라벨 태그
          ctx.fillStyle = style.stroke;
          const fontSize = Math.max(12, canvas.width / 70);
          ctx.font = `bold ${fontSize}px sans-serif`;
          const text = obj.label || style.label;
          const textWidth = ctx.measureText(text).width;
          
          ctx.fillRect(x, y - fontSize - 4, textWidth + 8, fontSize + 4);
          ctx.fillStyle = 'white';
          ctx.fillText(text, x + 4, y - 4);
        });
      }
    };
  }, [image, annotation]);

  return (
    <div ref={containerRef} className="w-full relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <canvas ref={canvasRef} className="block mx-auto cursor-crosshair" />
      {(!annotation || !annotation.objects.length) && (
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700">
          <p className="text-[10px] text-slate-400 font-medium tracking-wider">NO ANNOTATIONS FOUND</p>
        </div>
      )}
    </div>
  );
};

export default Visualizer;
