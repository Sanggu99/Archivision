import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import Gallery from './components/Gallery';
import Visualizer from './components/Visualizer';
import { X, Search, Database, RefreshCw } from 'lucide-react';

function App() {
  const [data, setData] = useState([]); // [{ id, name, url, annotation }]
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. 서버에서 데이터 가져오기 (JSON 기반)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/data');
      if (!res.ok) throw new Error('서버 응답 오류');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('서버에 연결할 수 없습니다. 백엔드 서버(node server.js)가 실행 중인지 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('업로드 실패');
      fetchData(); // 업로드 후 목록 갱신
    } catch (err) {
      console.error('Upload failed:', err);
      setError('이미지 업로드에 실패했습니다.');
    }
  };

  const selectedItem = data.find(d => d.id === selectedId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header images={data} />
      
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                도면 데이터베이스
              </h1>
              <p className="text-slate-500 text-sm mt-1">JSON 기반의 지능형 도면 데이터 관리 시스템</p>
            </div>
            <button 
              onClick={fetchData}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
              <RefreshCw size={16} className="animate-pulse" />
              {error}
            </div>
          )}

          {!selectedId ? (
            <div className="space-y-12">
              <Dropzone onUpload={handleUpload} />
              <Gallery 
                images={data.map(d => ({ ...d, preview: d.url }))} 
                onSelect={(id) => setSelectedId(id)} 
              />
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedId(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-md border border-blue-500/20 uppercase tracking-tighter">
                        JSON Annotations
                      </span>
                      <span className="text-xs text-slate-500">
                        {selectedItem.annotation?.objects?.length || 0} objects detected
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Visualizer image={selectedItem} annotation={selectedItem.annotation} />
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-slate-900 text-center text-slate-500 text-xs tracking-widest">
        <Database size={16} className="inline-block mr-2 mb-1 opacity-50" />
        AI-POWERED ARCHITECTURAL DRAWING MLOps CENTER
      </footer>
    </div>
  );
}

export default App;
