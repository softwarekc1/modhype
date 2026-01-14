import React, { useEffect, useState } from 'https://esm.sh/react';
import CodeBox from './CodeBox.jsx';
import { startLocker } from '../locker.js';

export default function CouponModal({ coupon, isOpen, onClose, unlocked, unlock }) {
  const [stage, setStage] = useState(unlocked ? 'unlocked' : 'locked');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStage(unlocked ? 'unlocked' : 'locked');
      setProgress(0);
    }
  }, [isOpen, unlocked]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    function onComplete(e) {
      if (e.detail.couponId === coupon.id) {
        setStage('unlocked');
        unlock(coupon.id);
      }
    }
    window.addEventListener('locker:complete', onComplete);
    return () => window.removeEventListener('locker:complete', onComplete);
  }, [coupon.id]);

  useEffect(() => {
    if (stage === 'verifying') {
      setProgress(0);
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(id);
            setStage('verified');
            return 100;
          }
          return p + 10;
        });
      }, 200);
      return () => clearInterval(id);
    }
  }, [stage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded p-4 w-11/12 max-w-md"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <img src={coupon.imageUrl} alt={coupon.brand} className="h-12" />
          <div>
            <h2 className="font-semibold">{coupon.title}</h2>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Verified</span>
          </div>
        </div>

        {stage === 'locked' && (
          <div className="flex flex-col gap-4">
            <CodeBox code={coupon.code} stage="locked" />
            <button
              onClick={() => setStage('verifying')}
              className="bg-blue-500 text-white py-2 rounded"
            >
              Get Full Code
            </button>
            <p className="text-sm">{coupon.description}</p>
          </div>
        )}

        {stage === 'verifying' && (
          <div className="text-center p-8">
            <p>Verifying... {progress}%</p>
          </div>
        )}

        {stage === 'verified' && (
          <div className="flex flex-col gap-4">
            <p className="text-green-600">Code valid! Click the box to reveal.</p>
            <CodeBox
              code={coupon.code}
              stage="verified"
              onReveal={() => startLocker(coupon.id)}
            />
            <p className="text-sm">{coupon.description}</p>
          </div>
        )}

        {stage === 'unlocked' && (
          <div className="flex flex-col gap-4">
            <CodeBox code={coupon.code} stage="unlocked" />
            <p className="text-sm">{coupon.description}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
