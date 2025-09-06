import React from 'https://esm.sh/react';

export default function CouponCard({ coupon, onOpen }) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col hover:shadow-lg transition-shadow">
      <img src={coupon.imageUrl} alt={coupon.brand} className="h-20 object-contain mb-2" />
      <h3 className="font-semibold">{coupon.title}</h3>
      {coupon.subtitle && <p className="text-sm text-gray-500">{coupon.subtitle}</p>}
      <div className="mt-auto flex items-center justify-between text-sm mt-4">
        <span>⭐ {coupon.rating}</span>
        <span>{coupon.usesToday} uses today</span>
      </div>
      <button
        onClick={() => onOpen(coupon)}
        className="mt-4 bg-blue-500 text-white rounded py-2 hover:bg-blue-600 w-full animate-pulse"
      >
        Get Code
      </button>
    </div>
  );
}
