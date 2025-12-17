import React, { useState, useRef, useEffect } from 'react';
import { useSheetStore } from '../store/useSheetStore';
import '../Spreadsheet.css';

const Cell = ({ rowIndex, colIndex, data }) => {
  const { updateCell, selectedCell, selectCell } = useSheetStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(data.formula || ''); // Show formula when editing
  const inputRef = useRef(null);


const isSelected =
  selectedCell &&
  selectedCell.row === rowIndex &&
  selectedCell.col === colIndex;


  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(data.formula); // Load the raw formula (e.g. =A1+B2)
    selectCell(rowIndex, colIndex);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateCell(rowIndex, colIndex, tempValue); // Commit changes
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
  };

  return (
    <div
      className={`cell-base cell-item ${isSelected ? 'cell-selected' : ''}`}
      onClick={() => selectCell(rowIndex, colIndex)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="cell-input"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span className="truncate w-full block px-1">
           {/* If value is empty, show nothing. If error, show red text */}
          {data.value}
        </span>
      )}
    </div>
  );
};

export default Cell;