import React from 'react';
import { useSheetStore } from '../store/useSheetStore';
import { Undo, Redo, RefreshCw } from 'lucide-react';

const Toolbar = () => {
  const { undo, redo, history, future } = useSheetStore();

  return (
    <div className="flex gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm border items-center">
      <h1 className="text-xl font-bold text-blue-600 mr-8">React Spreadsheet</h1>
      
      <button 
        onClick={undo} 
        disabled={history.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <Undo size={16} /> Undo
      </button>

      <button 
        onClick={redo} 
        disabled={future.length === 0}
        className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
      >
        <Redo size={16} /> Redo
      </button>
      
      <div className="ml-auto text-sm text-gray-500 flex gap-4">
        <span>Supports: + - * /</span>
        <br/>
        <span> Specialities :Drag/Drop and </span>
        <span>Auto-save</span>
      </div>
    </div>
  );
};

export default Toolbar;