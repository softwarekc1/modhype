const { useState, useEffect, useRef } = React;

const coupons = [
  {
    id: 'netflix1',
    brand: 'Netflix',
    title: 'Free 12 Months',
    subtitle: '12 Months',
    rating: 4.8,
    usesToday: 32,
    couponsLeft: 5,
    imageUrl: 'https://via.placeholder.com/80',
    code: 'NETFLIX-1234-5678',
    description: 'Enjoy a year of Netflix on us!',
    category: 'Streaming'
  },
  {
    id: 'spotify1',
    brand: 'Spotify',
    title: 'Premium 6 Months',
    subtitle: '6 Months',
    rating: 4.6,
    usesToday: 18,
    couponsLeft: 8,
    imageUrl: 'https://via.placeholder.com/80',
    code: 'SPOTIFY-ABCD-EFGH',
    description: 'Listen without ads for six months.',
    category: 'Apps'
  }
];

function maskCode(code) {
  return code.replace(/[A-Za-z0-9]/g, (ch, idx) => (idx % 2 === 0 ? '•' : ch));
}

function useUnlocked() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('unlockedCoupons') || '[]');
    } catch (e) {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem('unlockedCoupons', JSON.stringify(unlocked));
  }, [unlocked]);
  return [unlocked, setUnlocked];
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState(null); // coupon id
  const [unlocked, setUnlocked] = useUnlocked();

  const filtered = coupons.filter(c =>
    (category === 'All' || c.category === category) &&
    (c.title.toLowerCase().includes(query.toLowerCase()) ||
     c.brand.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    React.createElement('main', { className: 'max-w-5xl mx-auto p-4' },
      React.createElement('h1', { className: 'text-2xl font-bold mb-4 text-center' }, 'Top Coupons'),
      React.createElement(SearchBar, { query, setQuery }),
      React.createElement(CategoryFilter, { category, setCategory }),
      React.createElement('div', { className: 'mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
        filtered.map(c => React.createElement(CouponCard, {
          key: c.id,
          coupon: c,
          unlocked: unlocked.includes(c.id),
          onOpen: () => setActive(c.id)
        }))
      ),
      active && React.createElement(CouponModal, {
        coupon: coupons.find(c => c.id === active),
        isOpen: true,
        unlocked: unlocked.includes(active),
        onUnlock: id => setUnlocked(prev => Array.from(new Set([...prev, id]))),
        onClose: () => setActive(null)
      })
    )
  );
}

function SearchBar({ query, setQuery }) {
  return React.createElement('input', {
    type: 'text',
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: 'Search here…',
    className: 'w-full p-2 border rounded'
  });
}

const cats = ['All', 'Streaming', 'Games', 'Apps', 'Other'];
function CategoryFilter({ category, setCategory }) {
  return React.createElement('div', { className: 'mt-2 flex gap-2 overflow-x-auto' },
    cats.map(cat => React.createElement('button', {
      key: cat,
      onClick: () => setCategory(cat),
      className: `px-3 py-1 rounded-full border ${category === cat ? 'bg-blue-600 text-white' : 'bg-white'}`
    }, cat))
  );
}

function CouponCard({ coupon, onOpen, unlocked }) {
  return React.createElement('div', {
    className: 'bg-white rounded shadow hover:shadow-lg transition relative p-4 flex flex-col'
  },
    React.createElement('img', { src: coupon.imageUrl, alt: coupon.brand, className: 'h-16 w-16 object-cover rounded mb-2' }),
    React.createElement('h3', { className: 'font-semibold' }, coupon.brand),
    React.createElement('p', { className: 'text-sm text-gray-500 flex-1' }, coupon.subtitle),
    React.createElement('div', { className: 'mt-2 flex items-center justify-between' },
      React.createElement('span', { className: 'text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded' }, coupon.rating.toFixed(1)),
      React.createElement('button', { onClick: onOpen, className: 'bg-blue-600 text-white px-3 py-1 rounded mt-2 animate-pulse' }, unlocked ? 'View Code' : 'Get Code')
    )
  );
}

function CouponModal({ coupon, isOpen, onClose, unlocked, onUnlock }) {
  const [state, setState] = useState(unlocked ? 'unlocked' : 'locked');
  const [progress, setProgress] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    function onKey(e){ if(e.key==='Escape') onClose(); }
    if(isOpen){ document.addEventListener('keydown', onKey); }
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    function onComplete(e){ if(e.detail.couponId === coupon.id){ setState('unlocked'); onUnlock(coupon.id); } }
    window.addEventListener('locker:complete', onComplete);
    return () => window.removeEventListener('locker:complete', onComplete);
  }, [coupon.id]);

  function startLocker(id){
    setState('verifying');
    setProgress(0);
    const verifyEvt = new CustomEvent('locker:verifying', { detail: { couponId: id }});
    window.dispatchEvent(verifyEvt);
    const interval = setInterval(()=>{
      setProgress(p=>{
        if(p>=100){ clearInterval(interval); return 100; }
        return p+5;
      });
    },100);
    if(typeof window.og_load==='function') window.og_load();
  }

  function mask(){ return maskCode(coupon.code); }
  function copy(){ navigator.clipboard.writeText(coupon.code); alert('Code copied'); }

  return React.createElement('div', { className: 'fixed inset-0 bg-black/50 flex items-center justify-center', role:'dialog', 'aria-modal':true, onClick:(e)=>{ if(e.target===e.currentTarget) onClose(); } },
    React.createElement('div', { ref:modalRef, className:'bg-white rounded p-4 w-11/12 max-w-md', tabIndex:-1 },
      React.createElement('div', { className:'flex items-center mb-4' },
        React.createElement('img', { src: coupon.imageUrl, alt: coupon.brand, className:'h-12 w-12 rounded mr-2' }),
        React.createElement('h2', { className:'text-lg font-semibold flex-1' }, coupon.title),
        React.createElement('button', { onClick:onClose, 'aria-label':'Close', className:'text-gray-500' }, '✕')
      ),
      state==='locked' && React.createElement('div', { className:'text-center space-y-4' },
        React.createElement('div', { className:'border-2 border-dashed p-4 rounded text-xl font-mono select-none blur-sm relative' },
          React.createElement('span', null, mask())
        ),
        React.createElement('button', { className:'bg-blue-600 text-white px-4 py-2 rounded', onClick:()=>startLocker(coupon.id) }, 'Get Full Code'),
        React.createElement('p', { className:'text-sm text-gray-500' }, coupon.description)
      ),
      state==='verifying' && React.createElement('div', { className:'text-center space-y-4' },
        React.createElement('div', { className:'w-16 h-16 mx-auto border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin' }),
        React.createElement('p', null, `Verifying... ${progress}%`)
      ),
      state==='unlocked' && React.createElement('div', { className:'text-center space-y-4' },
        React.createElement('div', { className:'border-2 border-dashed p-4 rounded text-xl font-mono' }, coupon.code),
        React.createElement('button', { className:'bg-green-600 text-white px-4 py-2 rounded', onClick:copy }, 'Copy Code'),
        React.createElement('p', { className:'text-sm text-gray-500' }, coupon.description)
      )
    )
  );
}

// Global locker callbacks
function startLockerGlobal(couponId){
  const evt = new CustomEvent('locker:verifying', { detail: { couponId }});
  window.dispatchEvent(evt);
  if(typeof window.og_load==='function') window.og_load();
}

// Called by OGAds
window.onOfferComplete = function(couponId){
  const evt = new CustomEvent('locker:complete', { detail: { couponId }});
  window.dispatchEvent(evt);
};

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
