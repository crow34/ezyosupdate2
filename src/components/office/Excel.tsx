import React, { useState } from 'react';
import { Save, Plus, Minus, Percent, Calculator } from 'lucide-react';

interface Cell {
  value: string;
  formula?: string;
}

const Excel: React.FC = () => {
  const [cells, setCells] = useState<Record<string, Cell>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaInput, setFormulaInput] = useState('');

  const columns = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleCellChange = (id: string, value: string) => {
    setCells(prev => ({
      ...prev,
      [id]: { value, formula: value.startsWith('=') ? value : undefined }
    }));
    setFormulaInput(value);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b">
        <div className="flex items-center gap-2 p-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Save className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-200" />
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Minus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Percent className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Calculator className="w-4 h-4" />
          </button>
        </div>
        {/* Formula Bar */}
        <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 border-t">
          <div className="text-gray-500 text-sm">fx</div>
          <input
            value={formulaInput}
            onChange={(e) => {
              setFormulaInput(e.target.value);
              if (selectedCell) {
                handleCellChange(selectedCell, e.target.value);
              }
            }}
            className="flex-1 px-2 py-1 border rounded text-sm"
            placeholder="Enter formula"
          />
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-10 bg-gray-100 border" />
              {columns.map(col => (
                <th key={col} className="w-24 bg-gray-100 border px-2 py-1 text-sm">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                <td className="bg-gray-100 border text-center text-sm">{row}</td>
                {columns.map(col => {
                  const id = `${col}${row}`;
                  return (
                    <td key={id} className="border">
                      <input
                        value={cells[id]?.value || ''}
                        onChange={(e) => handleCellChange(id, e.target.value)}
                        onFocus={() => {
                          setSelectedCell(id);
                          setFormulaInput(cells[id]?.value || '');
                        }}
                        className="w-full h-full px-2 py-1 focus:outline-none focus:bg-blue-50"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-gray-100 text-gray-600 text-sm">
        Ready
      </div>
    </div>
  );
};

export default Excel;