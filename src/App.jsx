import React from 'react';
import Grid from './components/Grid';
import Toolbar from './components/Toolbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <Toolbar />
      <Grid />
      <div className="mt-8 text-gray-500 text-sm max-w-2xl text-center">
        <p>
          <strong>Features:</strong> Type numbers or text. Use <code>=A1+B2</code> for formulas. 
          Handles dependencies and detects circular references (e.g., A1=B1, B1=A1).
        </p>
      </div>
    </div>
  );
}

export default App;