# React Spreadsheet Engine

A robust, React-based spreadsheet application that mimics core Excel functionalities. This project features a custom formula parser, dependency graph logic for automatic updates, and a dynamic 2D grid system.

## Features

### Core Requirements
* **Formula Evaluation:** Supports mathematical operations (`+`, `-`, `*`, `/`) and cell references (e.g., `=A1+B2`).
* **Dependency Tracking:** Updates propagate automatically when a dependent cell changes.
* **Circular Reference Detection:** Prevents infinite loops (e.g., A1 referencing B1, which references A1).
* **Sanitization:** Handles errors gracefully without crashing the app.

### Bonus Features (Implemented)
* **Dynamic Grid Sizing:** Users can define custom grid dimensions (Rows x Cols).
* **Range Functions:** Supports range-based math like `=SUM(A1:A5)` and `=AVERAGE(B1:B3)`.
* **Data Persistence:** Auto-saves data to LocalStorage so you never lose work on refresh.
* **Time Travel:** Full **Undo/Redo** functionality.
* **2D Array Architecture:** Uses a scalable matrix structure for performance.

## 🛠 Tech Stack
* **Frontend:** React.js (Vite)
* **State Management:** Zustand (with Persistence middleware)
* **Styling:** CSS Grid & Tailwind CSS
* **Logic:** Custom graph-based dependency engine (No external heavy math libraries)

## Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/AdityaVerma19/spreadsheet-formula-engine.git](https://github.com/AdityaVerma19/spreadsheet-formula-engine.git)
    cd spreadsheet-engine
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```
## Live Link 
 link - https://spreadsheet-formula-engine.vercel.app/
## Testing Formulas
To verify the engine, try entering these values:
1.  **Basic Math:** Enter `=10+20` in `A1`.
2.  **Reference:** Enter `=A1*2` in `B1`. Change `A1` and watch `B1` update.
3.  **Range Sum:** Enter values in `C1`, `C2`, `C3` and type `=SUM(C1:C3)` in `C4`.
4.  **Range Average:** Type `=AVERAGE(C1:C3)` in `C5`.
