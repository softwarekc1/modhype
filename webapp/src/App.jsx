import React, { useState, useEffect } from 'https://esm.sh/react';
import SearchBar from './components/SearchBar.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import CouponCard from './components/CouponCard.jsx';
import CouponModal from './components/CouponModal.jsx';
import { coupons } from './data/coupons.js';

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unlockedCoupons')) || [];
    } catch (e) {
      return [];
    }
  });

  function unlock(id) {
    setUnlocked((prev) => {
      const next = Array.from(new Set([...prev, id]));
      localStorage.setItem('unlockedCoupons', JSON.stringify(next));
      return next;
    });
  }

  const filtered = coupons.filter((c) => {
    const matchesCategory = category === 'All' || c.category === category;
    const term = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(term) || c.brand.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <SearchBar onSearch={setSearch} />
      <CategoryFilter value={category} onChange={setCategory} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <CouponCard key={c.id} coupon={c} onOpen={setSelected} />
        ))}
      </div>
      {selected && (
        <CouponModal
          coupon={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          unlocked={unlocked.includes(selected.id)}
          unlock={unlock}
        />
      )}
    </div>
  );
}
