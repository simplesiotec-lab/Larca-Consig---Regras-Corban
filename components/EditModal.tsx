import React, { useState, useEffect } from 'react';
import { Section, ListSection, TableSection, SectionItem, TableRow } from '../types';
import { X, Plus, Trash2, Save, Edit3 } from './Icons';

interface EditModalProps {
  section: Section | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSection: Section) => void;
}

const EditModal: React.FC<EditModalProps> = ({ section, isOpen, onClose, onSave }) => {
  const [editedSection, setEditedSection] = useState<Section | null>(null);

  useEffect(() => {
    if (section) {
      // Deep clone to avoid mutating state directly during edits
      setEditedSection(JSON.parse(JSON.stringify(section)));
    } else {
      setEditedSection(null);
    }
  }, [section]);

  if (!isOpen || !editedSection) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSection({ ...editedSection, title: e.target.value });
  };

  const renderListEditor = () => {
    const listSection = editedSection as ListSection;
    
    const handleItemChange = (id: string, newText: string) => {
      const newItems = listSection.items.map(item => 
        item.id === id ? { ...item, text: newText } : item
      );
      setEditedSection({ ...listSection, items: newItems });
    };

    const handleAddItem = () => {
      const newItem: SectionItem = { id: `item-${Date.now()}`, text: '' };
      setEditedSection({ ...listSection, items: [...listSection.items, newItem] });
    };

    const handleRemoveItem = (id: string) => {
      const newItems = listSection.items.filter(item => item.id !== id);
      setEditedSection({ ...listSection, items: newItems });
    };

    return (
      <div className="space-y-4">
        {listSection.items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="text-slate-400 font-medium w-6 text-right">{index + 1}.</span>
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemChange(item.id, e.target.value)}
              className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
              placeholder="Digite a regra..."
            />
            <button 
              onClick={() => handleRemoveItem(item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Remover item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        <button 
          onClick={handleAddItem}
          className="flex items-center gap-2 text-[#D4AF37] font-medium hover:text-[#b5952f] transition-colors"
        >
          <Plus size={18} /> Adicionar Item
        </button>
      </div>
    );
  };

  const renderTableEditor = () => {
    const tableSection = editedSection as TableSection;

    const handleHeaderChange = (index: number, newText: string) => {
      const newHeaders = [...tableSection.headers];
      newHeaders[index] = newText;
      setEditedSection({ ...tableSection, headers: newHeaders });
    };

    const handleCellChange = (rowIndex: number, cellIndex: number, newText: string) => {
      const newRows = [...tableSection.rows];
      newRows[rowIndex].cells[cellIndex] = newText;
      setEditedSection({ ...tableSection, rows: newRows });
    };

    const handleAddRow = () => {
      const newRow: TableRow = { 
        id: `row-${Date.now()}`, 
        cells: Array(tableSection.headers.length).fill('') 
      };
      setEditedSection({ ...tableSection, rows: [...tableSection.rows, newRow] });
    };

    const handleRemoveRow = (id: string) => {
      const newRows = tableSection.rows.filter(row => row.id !== id);
      setEditedSection({ ...tableSection, rows: newRows });
    };

    return (
      <div className="space-y-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {tableSection.headers.map((header, index) => (
                <th key={index} className="p-2 border border-slate-300 bg-slate-100">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => handleHeaderChange(index, e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    placeholder="Cabeçalho..."
                  />
                </th>
              ))}
              <th className="p-2 border border-slate-300 bg-slate-100 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {tableSection.rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border border-slate-300">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                      className="w-full border-none focus:ring-2 focus:ring-[#D4AF37] outline-none"
                      placeholder="Valor..."
                    />
                  </td>
                ))}
                <td className="p-2 border border-slate-300 text-center">
                  <button 
                    onClick={() => handleRemoveRow(row.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button 
          onClick={handleAddRow}
          className="flex items-center gap-2 text-[#D4AF37] font-medium hover:text-[#b5952f] transition-colors"
        >
          <Plus size={18} /> Adicionar Linha
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-[#0A192F] text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Edit3 className="text-[#D4AF37]" />
            Editar Seção
          </h2>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Título da Seção</label>
            <input
              type="text"
              value={editedSection.title}
              onChange={handleTitleChange}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none font-medium text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">Conteúdo</label>
            {editedSection.type === 'list' && renderListEditor()}
            {editedSection.type === 'table' && renderTableEditor()}
            {editedSection.type === 'text' && (
              <textarea
                value={(editedSection as any).content}
                onChange={(e) => setEditedSection({...editedSection, content: e.target.value} as any)}
                className="w-full p-3 border border-slate-300 rounded-lg h-40 focus:ring-2 focus:ring-[#D4AF37] outline-none"
              />
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              onSave(editedSection);
              onClose();
            }}
            className="px-6 py-2.5 rounded-lg font-medium bg-[#D4AF37] text-[#0A192F] hover:bg-[#b5952f] transition-colors flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;