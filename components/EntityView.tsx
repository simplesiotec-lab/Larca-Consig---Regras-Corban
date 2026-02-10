import React, { useState } from 'react';
import { EntityData, Section, ListSection, TableSection } from '../types';
import { Edit3, CheckCircle2, XCircle, FileText, Upload, Trash2, Plus } from './Icons';
import EditModal from './EditModal';

interface EntityViewProps {
  data: EntityData;
  onUpdateSection: (sectionId: string, updatedSection: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddAttachment: (fileInfo: {id: string, name: string, date: string, size: string}) => void;
  onDeleteAttachment: (docId: string) => void;
}

const EntityView: React.FC<EntityViewProps> = ({ 
  data, 
  onUpdateSection, 
  onDeleteSection,
  onAddAttachment,
  onDeleteAttachment
}) => {
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const handleEditClick = (section: Section) => {
    setEditingSection(section);
  };

  const handleSaveSection = (updatedSection: Section) => {
    onUpdateSection(updatedSection.id, updatedSection);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: file.name,
        date: new Date().toLocaleDateString('pt-BR'),
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      onAddAttachment(newDoc);
      // Reset input
      e.target.value = '';
    }
  };

  const renderListSection = (section: ListSection) => {
    const getIcon = () => {
      switch(section.listStyle) {
        case 'check': return <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />;
        case 'cross': return <XCircle className="text-rose-500 mt-0.5 shrink-0" size={20} />;
        default: return <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2 shrink-0"></div>;
      }
    };

    return (
      <ul className="space-y-3">
        {section.items.map(item => (
          <li key={item.id} className="flex items-start gap-3 text-slate-700">
            {getIcon()}
            <span className="leading-relaxed">{item.text}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderTableSection = (section: TableSection) => (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#0A192F] text-white">
            {section.headers.map((header, idx) => (
              <th key={idx} className="p-3 font-semibold text-sm border-b border-[#1c355c]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {section.rows.map((row, idx) => (
            <tr key={row.id} className={`border-b border-slate-100 hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
              {row.cells.map((cell, cellIdx) => (
                <td key={cellIdx} className="p-3 text-slate-700 text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header Area */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]"></div>
        
        <div>
          <h1 className="text-3xl font-bold text-[#0A192F] mb-2">{data.name}</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Regras Operacionais Atualizadas em: <span className="font-semibold text-slate-700">{data.lastUpdated}</span>
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Rules */}
        <div className="lg:col-span-2 space-y-8">
          {data.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
                <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#D4AF37] rounded-full"></span>
                  {section.title}
                </h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEditClick(section)}
                    className="p-2 text-slate-500 hover:text-[#0A192F] hover:bg-slate-200 rounded-lg transition-colors"
                    title="Editar Seção"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteSection(section.id)}
                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir Seção"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {section.type === 'list' && renderListSection(section as ListSection)}
                {section.type === 'table' && renderTableSection(section as TableSection)}
                {section.type === 'text' && (
                  <div className="prose prose-slate max-w-none text-slate-700">
                    <p>{(section as any).content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Attachments & Sidebar Tools */}
        <div className="space-y-6">
          <div className="bg-[#0A192F] rounded-2xl shadow-lg border border-[#1c355c] overflow-hidden text-white">
            <div className="p-5 border-b border-[#1c355c] flex items-center gap-3">
              <FileText className="text-[#D4AF37]" size={24} />
              <h3 className="text-lg font-bold">Material de Apoio</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-400 mb-4">
                Documentos anexados para consulta das regras operacionais.
              </p>

              {data.documents.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-[#1c355c] rounded-lg text-slate-400">
                  Nenhum documento anexado.
                </div>
              ) : (
                <ul className="space-y-3">
                  {data.documents.map(doc => (
                    <li key={doc.id} className="flex items-start justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                      <div className="flex items-start gap-3 overflow-hidden">
                        <FileText className="text-rose-400 shrink-0 mt-1" size={18} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onDeleteAttachment(doc.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Remover anexo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-4 mt-4 border-t border-[#1c355c]">
                <label className="flex items-center justify-center gap-2 w-full p-3 border border-dashed border-[#D4AF37] rounded-xl text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer font-medium">
                  <Upload size={18} />
                  Anexar Novo PDF
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    onChange={handleSimulateUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal 
        isOpen={!!editingSection} 
        section={editingSection} 
        onClose={() => setEditingSection(null)} 
        onSave={handleSaveSection}
      />
    </div>
  );
};

export default EntityView;
