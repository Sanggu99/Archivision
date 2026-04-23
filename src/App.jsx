import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import Gallery from './components/Gallery';
import Visualizer from './components/Visualizer';
import { X, RefreshCw, Layers, Database, Check, PieChart, Info, ClipboardList, Ruler } from 'lucide-react';

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
    setActiveFilters(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    try {
      const res = await fetch('http://localhost:5001/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');
      fetchData();
    } catch (err) {
      setError('이미지 업로드에 실패했습니다.');
    }
  };

  const selectedItem = data.find(d => d.id === selectedId);

  // 면적 및 통계 분석 로직
  const getStats = () => {
    if (!selectedItem || !selectedItem.annotation) return null;
    const anno = selectedItem.annotation;
    const objects = anno.objects || [];
    
    // 스케일 계산 (Feature 3 고도화)
    // 예: reference_scale: { pixel_dist_norm: 0.9, real_dist_m: 6.06 }
    const refScale = anno.reference_scale || { pixel_dist_norm: 1.0, real_dist_m: 10.0 };
    const scaleFactor = refScale.real_dist_m / (refScale.pixel_dist_norm || 1.0);

    const stats = {
      total: objects.length,
      byCategory: {},
      rooms: []
    };

    objects.forEach(obj => {
      stats.byCategory[obj.category] = (stats.byCategory[obj.category] || 0) + 1;
      if (obj.category === 'room') {
        const widthM = obj.bbox[2] * scaleFactor;
        const heightM = obj.bbox[3] * scaleFactor;
        const areaM2 = widthM * heightM;
        
        stats.rooms.push({ 
          label: obj.label, 
          area: areaM2.toFixed(1),
          dim: `${widthM.toFixed(1)}m x ${heightM.toFixed(1)}m`
        });
      }
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header images={data} />
      
      <main className="flex-1 py-8 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Archivision Hub
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">건축 도면 데이터 분석 및 MLOps 자동화</p>
            </div>
            <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {!selectedId ? (
            <div className="space-y-16">
              <Dropzone onUpload={handleUpload} />
              <Gallery images={data} onSelect={(id) => setSelectedId(id)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
              {/* Left Side: Visualizer (3/4) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-xl">
                  <div className="flex items-center gap-5">
                    <button onClick={() => setSelectedId(null)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all">
                      <X size={20} />
                    </button>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedItem.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Ruler size={14} className="text-blue-400" />
                        <span className="text-xs text-slate-400">Scale-based Area Analysis Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => toggleFilter(cat.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          activeFilters[cat.id] ? `${cat.color} text-white border-transparent shadow-lg` : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <Visualizer image={selectedItem} annotation={selectedItem.annotation} activeFilters={activeFilters} />
              </div>

              {/* Right Side: Analytics Dashboard (1/4) */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl h-full shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                      <PieChart size={22} />
                    </div>
                    <h4 className="font-bold text-xl text-white tracking-tight">건축 분석 대시보드</h4>
                  </div>

                  {stats ? (
                    <div className="space-y-8">
                      {/* Overall Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Total Objects</p>
                          <p className="text-3xl font-black text-white">{stats.total}</p>
                        </div>
                        <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">Net Area</p>
                          <p className="text-3xl font-black text-emerald-400">
                            {stats.rooms.reduce((acc, r) => acc + parseFloat(r.area), 0).toFixed(1)}<span className="text-xs ml-1">㎡</span>
                          </p>
                        </div>
                      </div>

                      {/* Room Area Measurement */}
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <Ruler size={18} className="text-amber-500" />
                          <h5 className="text-sm font-bold text-slate-200">실별 측정 면적 (Calculated)</h5>
                        </div>
                        <div className="space-y-4">
                          {stats.rooms.map((room, idx) => (
                            <div key={idx} className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-slate-300">{room.label}</span>
                                <span className="text-lg font-black text-white">{room.area} ㎡</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-slate-500 font-medium">Dimension: {room.dim}</span>
                                <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: `${(parseFloat(room.area) / 30) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Category Quantities */}
                      <div className="pt-6 border-t border-slate-800">
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5">Object Quantity Survey</h5>
                        <div className="grid grid-cols-2 gap-3">
                          {CATEGORIES.map(cat => (
                            <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl border border-slate-700/20">
                              <span className="text-[10px] font-bold text-slate-400">{cat.name}</span>
                              <span className="text-sm font-black text-white">{stats.byCategory[cat.id] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <Info size={40} className="text-slate-800" />
                      <p className="text-sm text-slate-600 font-medium">분석 데이터가 존재하지 않습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 text-center text-slate-600 text-[10px] tracking-[0.4em] font-black uppercase">
        Archivision • Computational Design Data Intelligence
      </footer>
    </div>
  );
}

export default App;
