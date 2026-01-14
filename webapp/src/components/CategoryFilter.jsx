import React from 'https://esm.sh/react';

const categories = ['All', 'Streaming', 'Games', 'Apps'];

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${
            value === cat ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
