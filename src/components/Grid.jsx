import React, { useState } from 'react';
import Cell from './Cell';
import { useSheetStore } from '../store/useSheetStore';
import { getColLabel } from '../utils/spreadsheetLogic';
import '../Spreadsheet.css';

const Grid = () => {
  const { grid, rows, cols, setDimensions } = useSheetStore();
  const [newRows, setNewRows] = useState(rows);
  const [newCols, setNewCols] = useState(cols);

  const handleResize = () => {
    if (window.confirm("Changing size will clear the grid. Continue?")) {
      setDimensions(Number(newRows), Number(newCols));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      
      {/* Dynamic Size Controls */}
      <div className="flex gap-2 items-center bg-white p-3 rounded shadow">
        <label className="text-sm font-bold text-gray-600">Rows:</label>
        <input 
          type="number" 
          value={newRows} 
          onChange={(e) => setNewRows(e.target.value)}
          className="border p-1 w-16 rounded text-center"
        />
        <span className="text-gray-400">x</span>
        <label className="text-sm font-bold text-gray-600">Cols:</label>
        <input 
          type="number" 
          value={newCols} 
          onChange={(e) => setNewCols(e.target.value)}
          className="border p-1 w-16 rounded text-center"
        />
        <button 
          onClick={handleResize}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          Update Grid
        </button>
      </div>

      {/* The 2D Grid */}
      <div className="spreadsheet-container border rounded overflow-auto shadow-lg bg-white max-w-[90vw] max-h-[70vh]">
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `50px repeat(${cols}, 100px)` 
          }}
        >
          {/* Top-Left Corner */}
          <div className="cell-base header-col z-20 sticky top-0 left-0"></div>

          {/* Column Headers (A, B, C...) */}
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="cell-base header-col sticky top-0 z-10">
              {getColLabel(c)}
            </div>
          ))}

          {/* Render Rows from 2D Array */}
          {grid.map((rowArray, rIndex) => (
            <React.Fragment key={rIndex}>
              {/* Row Header (1, 2, 3...) */}
              <div className="cell-base header-col sticky left-0 z-10">
                {rIndex + 1}
              </div>

              {/* Data Cells */}
              {rowArray.map((cellData, cIndex) => (
                <Cell 
                  key={`${rIndex}-${cIndex}`} 
                  rowIndex={rIndex} 
                  colIndex={cIndex} 
                  data={cellData} 
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;