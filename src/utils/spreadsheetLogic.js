export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Converts a zero-based column index into its spreadsheet label.
 * Example:
 *   0  -> A
 *   25 -> Z
 *   26 -> AA
 *
 * This supports dynamic grids with more than 26 columns.
 */
export const getColLabel = (index) => {
  let label = "";
  let currentIndex = index;

  while (currentIndex >= 0) {
    label =
      String.fromCharCode((currentIndex % 26) + 65) + label;
    currentIndex = Math.floor(currentIndex / 26) - 1;
  }

  return label;
};

/**
 * Parses a spreadsheet-style cell ID (e.g., "A1", "AA10")
 * and converts it into zero-based row and column indices.
 *
 * Example:
 *   "A1"  -> { row: 0, col: 0 }
 *   "B3"  -> { row: 2, col: 1 }
 */
export const parseCellId = (cellId) => {
  const match = cellId.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;

  const columnPart = match[1];
  const rowPart = match[2];

  let columnIndex = 0;
  for (let i = 0; i < columnPart.length; i++) {
    columnIndex =
      columnIndex * 26 + (columnPart.charCodeAt(i) - 64);
  }

  return {
    row: parseInt(rowPart, 10) - 1,
    col: columnIndex - 1,
  };
};

/**
 * Core Formula Evaluator
 *
 * Supports:
 *  - Basic arithmetic (=A1 + B2)
 *  - Cell references (=A1 * 2)
 *  - Range-based functions:
 *      - SUM(A1:A5)
 *      - AVERAGE(B1:D1)
 *
 * @param {string} formula - Formula entered by the user
 * @param {Array} grid - 2D grid containing cell objects
 * @returns {number|string} - Computed value or error
 */
export const evaluateFormula = (formula, grid) => {
  // If it's not a formula, return the value as-is
  if (!formula.startsWith("=")) return formula;

  // Remove '=' and normalize input
  let expression = formula.substring(1).toUpperCase();

  /**
   * Fetches numeric values from a given cell range
   * (e.g., A1:A3 or B2:D4).
   */
  const getRangeValues = (startCell, endCell) => {
    const start = parseCellId(startCell);
    const end = parseCellId(endCell);
    const values = [];

    if (!start || !end) return values;

    for (
      let row = Math.min(start.row, end.row);
      row <= Math.max(start.row, end.row);
      row++
    ) {
      for (
        let col = Math.min(start.col, end.col);
        col <= Math.max(start.col, end.col);
        col++
      ) {
        const cellValue =
          grid[row]?.[col]?.value ?? 0;
        const numericValue = Number(cellValue);

        values.push(isNaN(numericValue) ? 0 : numericValue);
      }
    }

    return values;
  };

  // Handle SUM(range)
  expression = expression.replace(
    /SUM\(([A-Z0-9:]+)\)/g,
    (_, range) => {
      const [start, end] = range.split(":");
      if (!start || !end) return 0;

      const values = getRangeValues(start, end);
      return values.reduce((sum, val) => sum + val, 0);
    }
  );

  // Handle AVERAGE(range)
  expression = expression.replace(
    /AVERAGE\(([A-Z0-9:]+)\)/g,
    (_, range) => {
      const [start, end] = range.split(":");
      if (!start || !end) return 0;

      const values = getRangeValues(start, end);
      return values.length
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : 0;
    }
  );

  // Replace single-cell references (A1, B2, etc.)
  expression = expression.replace(
    /[A-Z]+[0-9]+/g,
    (cellRef) => {
      const position = parseCellId(cellRef);
      if (!position) return 0;

      const cellValue =
        grid[position.row]?.[position.col]?.value ?? 0;
      const numericValue = parseFloat(cellValue);

      return isNaN(numericValue) ? 0 : numericValue;
    }
  );

  // Safely evaluate the final expression
  try {
    return new Function(`return ${expression}`)();
  } catch {
    return "#ERR";
  }
};
