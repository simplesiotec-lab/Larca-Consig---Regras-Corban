import React, { useState } from 'react';
import { initialData } from './data/initialData';
import { AppData, ViewMode, Section, EntityType } from './types';
import EntityView from './components/EntityView';
import { AnalyzerView } from './components/AnalyzerView';
import { ShieldCheck, Building2, Search, BookOpen, Sparkles } from './components/Icons';

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('EXERCITO');
  const [data, setData] = useState<AppData>(initialData);

  // Handlers for modifying data
  const handleUpdateSection = (sectionId: string, updatedSection: Section) => {
    if (activeView === 'ANALYZER') return;
    
    setData(prevData => {
      const view = activeView as EntityType;
      const entityData = prevData[view];
      const newSections = entityData.sections.map(s => 
        s.id === sectionId ? updatedSection : s
      );
      
      return {
        ...prevData,
        [view]: {
          ...entityData,
          sections: newSections,
          lastUpdated: new Date().toLocaleDateString('pt-BR')
        }
      };
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (activeView === 'ANALYZER') return;

    if (window.confirm('Tem certeza que deseja excluir esta seção?')) {
      setData(prevData => {
        const view = activeView as EntityType;
        const entityData = prevData[view];
        const newSections = entityData.sections.filter(s => s.id !== sectionId);
        
        return {
          ...prevData,
          [view]: {
            ...entityData,
            sections: newSections,
            lastUpdated: new Date().toLocaleDateString('pt-BR')
          }
        };
      });
    }
  };

  const handleAddAttachment = (fileInfo: any) => {
    if (activeView === 'ANALYZER') return;

    setData(prevData => {
      const view = activeView as EntityType;
      const entityData = prevData[view];
      return {
        ...prevData,
        [view]: {
          ...entityData,
          documents: [...entityData.documents, fileInfo]
        }
      };
    });
  };

  const handleDeleteAttachment = (docId: string) => {
    if (activeView === 'ANALYZER') return;

    setData(prevData => {
      const view = activeView as EntityType;
      const entityData = prevData[view];
      return {
        ...prevData,
        [view]: {
          ...entityData,
          documents: entityData.documents.filter(d => d.id !== docId)
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar - Premium Navy */}
      <aside className="w-64 bg-[#0A192F] shadow-2xl flex-shrink-0 flex flex-col fixed h-full z-10 border-r border-[#1c355c]">
        <div className="p-6 border-b border-[#1c355c] flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-amber-600 flex items-center justify-center text-[#0A192F]">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-white">LARCA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold">Consig Rules</span>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-2 mt-4">
          <button
            onClick={() => setActiveView('EXERCITO')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
              activeView === 'EXERCITO'
                ? 'bg-[#1c355c] text-[#D4AF37] shadow-inner border border-[#2a4d85]'
                : 'text-slate-400 hover:bg-[#112240] hover:text-white'
            }`}
          >
            <ShieldCheck size={20} className={activeView === 'EXERCITO' ? 'text-[#D4AF37]' : ''} />
            Regras Exército
          </button>

          <button
            onClick={() => setActiveView('SIAPE')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
              activeView === 'SIAPE'
                ? 'bg-[#1c355c] text-[#D4AF37] shadow-inner border border-[#2a4d85]'
                : 'text-slate-400 hover:bg-[#112240] hover:text-white'
            }`}
          >
            <Building2 size={20} className={activeView === 'SIAPE' ? 'text-[#D4AF37]' : ''} />
            Regras SIAPE
          </button>

          <div className="pt-4 pb-2">
            <div className="h-px w-full bg-[#1c355c]"></div>
          </div>

          <button
            onClick={() => setActiveView('ANALYZER')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
              activeView === 'ANALYZER'
                ? 'bg-gradient-to-r from-[#D4AF37] to-amber-600 text-[#0A192F] shadow-lg shadow-[#D4AF37]/20'
                : 'text-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10'
            }`}
          >
            <Sparkles size={20} className={activeView === 'ANALYZER' ? 'text-[#0A192F]' : 'text-[#D4AF37]'} />
            Analisador IA
          </button>
        </nav>

        <div className="p-6 border-t border-[#1c355c] text-xs text-slate-500 text-center">
          v2.0.0 • Portal Corban
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#0A192F 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar em regras..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#0A192F]">Portal Operacional</p>
              <p className="text-xs text-slate-500">Corban Access</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0A192F] text-[#D4AF37] flex items-center justify-center font-bold shadow-md border-2 border-[#D4AF37]">
              CB
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          {activeView === 'ANALYZER' ? (
            <AnalyzerView />
          ) : (
            <EntityView 
              data={data[activeView as EntityType]} 
              onUpdateSection={handleUpdateSection}
              onDeleteSection={handleDeleteSection}
              onAddAttachment={handleAddAttachment}
              onDeleteAttachment={handleDeleteAttachment}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
