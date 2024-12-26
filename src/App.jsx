import React, { useState } from 'react';
import Grid from './components/Grid';

const App = () => {
  const [gridSize, setGridSize] = useState({ rows: 15, columns: 20 });

  const handleSizeChange = (type, value) => {
    setGridSize(prev => ({
      ...prev,
      [type]: parseInt(value) || 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center mb-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Digital Rain Simulator
        </h1>
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm">Rows:</label>
            <input 
              type="number" 
              value={gridSize.rows}
              onChange={(e) => handleSizeChange('rows', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-800 rounded border border-gray-700"
              min="1"
              max="50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Columns:</label>
            <input 
              type="number" 
              value={gridSize.columns}
              onChange={(e) => handleSizeChange('columns', e.target.value)}
              className="w-20 px-2 py-1 bg-gray-800 rounded border border-gray-700"
              min="1"
              max="50"
            />
          </div>
        </div>
      </div>
      
      <div className="relative w-full max-w-full h-full overflow-hidden rounded-xl shadow-2xl">
        <Grid rows={gridSize.rows} columns={gridSize.columns} />
      </div>
    </div>
  );
};

export default App;
