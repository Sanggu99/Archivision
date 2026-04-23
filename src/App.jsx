import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import Gallery from './components/Gallery';
import Visualizer from './components/Visualizer';
import { X, RefreshCw, Layers, Database, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'room', name: 'ROOM', color: 'bg-amber-500' },
  { id: 'door', name: 'DOOR', color: 'bg-blue-500' },
  { id: 'window', name: 'WINDOW', color: 'bg-emerald-500' },
  { id: 'furniture', name: 'FURNITURE', color: 'bg-violet-500' },
  { id: 'equipment', name: 'EQUIPMENT', color: 'bg-pink-500' },
  { id: 'wall', name: 'WALL', color: 'bg-red-500' }
];

function App() {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 필터 상태 관리 (기본값은 모두 활성화)
  const [activeFilters, setActiveFilters] = useState(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/data');
      if (!res.ok) throw new Error('서버 응답 오류');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError('서버에 연결할 수 없습니다. 백엔드 서버(node server.js)가 실행 중인지 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleFilter = (categoryId) => {
    setActiveFilters(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('업로드 실패');
      fetchData();
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    }
  };

  const selectedItem = data.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <Header images={data} />
      
      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Archivision Hub
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium tracking-tight">지능형 도면 데이터 자산 관리 및 MLOps 센터</p>
            </div>
            <button 
              onClick={fetchData}
              className="group p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
            >
              <RefreshCw size={20} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-bounce">
              <RefreshCw size={16} className="animate-spin" />
              {error}
            </div>
          )}

          {!selectedId ? (
            <div className="space-y-16">
              <Dropzone onUpload={handleUpload} />
              <Gallery 
                images={data} 
                onSelect={(id) => setSelectedId(id)} 
              />
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
              {/* Inspection Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
                <div className="flex items-center gap-5">
                  <button onClick={() => setSelectedId(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all active:scale-90">
                    <X size={20} />
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Layers size={14} className="text-blue-400" />
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {selectedItem.annotation?.objects?.length || 0} Entities Detected
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => {
                    const isActive = activeFilters[cat.id];
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleFilter(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 border ${
                          isActive 
                          ? `${cat.color} text-white border-transparent shadow-lg shadow-${cat.color.split('-')[1]}-500/20` 
                          : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {isActive && <Check size={12} />}
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Visualizer 
                image={selectedItem} 
                annotation={selectedItem.annotation} 
                activeFilters={activeFilters}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-500 text-[10px] tracking-[0.3em] font-bold uppercase">
        <Database size={14} className="inline-block mr-3 mb-1 opacity-40 text-blue-500" />
        Archivision Engine • Precision AI Data Engineering
      </footer>
    </div>
  );
}

export default App;
