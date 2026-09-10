import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full sm:w-80">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar por nombre, apellido o especialidad..."
        className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
