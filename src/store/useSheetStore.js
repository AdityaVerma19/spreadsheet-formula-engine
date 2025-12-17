import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { evaluateFormula, getColLabel } from '../utils/spreadsheetLogic';

//to create a fresh 2D grid
const createGrid = (rows, cols) => {
  return Array.from({ length: rows }, (_, r) => 
    Array.from({ length: cols }, (_, c) => ({
      id: `${getColLabel(c)}${r + 1}`,
      value: '',
      formula: '',
    }))
  );
};

export const useSheetStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      rows: 10,
      cols: 10,
      grid: createGrid(10, 10),
      selectedCell: null,
      
      // History for Undo/Redo
      history: [],
      future: [],

      // --- ACTIONS ---

      setDimensions: (rows, cols) => {
        set({ 
          rows, 
          cols, 
          grid: createGrid(rows, cols),
          history: [], // Clear history on resize
          future: []
        });
      },

      selectCell: (row, col) => set({ selectedCell: { row, col } }),

      updateCell: (row, col, value) => {
        const { grid, history } = get();
        
        // 1. Save current state to history before modifying
        const newHistory = [...history, JSON.parse(JSON.stringify(grid))];

        // 2. Create deep copy of grid to modify
        const newGrid = grid.map(row => [...row]); // Shallow copy rows
        // We modify the specific cell structure
        newGrid[row][col] = {
          ...newGrid[row][col],
          value: value,
          formula: value
        };

        // 3. Evaluate Formula if needed
        if (value.startsWith('=')) {
          newGrid[row][col].value = evaluateFormula(value, newGrid);
        }

        // 4. Update the state
        set({ 
          grid: newGrid, 
          history: newHistory, 
          future: [] // Clear redo stack on new change
        });
      },

      undo: () => {
        const { grid, history, future } = get();
        if (history.length === 0) return;

        const previousGrid = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
          grid: previousGrid,
          history: newHistory,
          future: [grid, ...future] // Push current to future
        });
      },

      redo: () => {
        const { grid, history, future } = get();
        if (future.length === 0) return;

        const nextGrid = future[0];
        const newFuture = future.slice(1);

        set({
          grid: nextGrid,
          history: [...history, grid],
          future: newFuture
        });
      }
    }),
    {
      name: 'spreadsheet-storage',
      // Safety check to prevent crashes if data is corrupted
      onRehydrateStorage: () => (state) => {
        if (!state.grid || !Array.isArray(state.grid)) {
          console.warn("Resetting storage due to format mismatch.");
          state.rows = 10;
          state.cols = 10;
          state.grid = createGrid(10, 10);
          state.history = [];
          state.future = [];
        }
      }
    }
  )
);