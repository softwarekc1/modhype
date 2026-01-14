import React, { useState, useEffect } from 'https://esm.sh/react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const id = setTimeout(() => onSearch(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <input
      type="text"
      aria-label="Search coupons"
      placeholder="Search here..."
      className="w-full p-2 border rounded mb-4"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
