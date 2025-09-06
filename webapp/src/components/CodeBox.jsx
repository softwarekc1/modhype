import React, { useState } from 'https://esm.sh/react';

export default function CodeBox({ code, stage, onReveal }) {
  const masked = code.replace(/[A-Za-z0-9]/g, '•');
  const [copied, setCopied] = useState(false);

  const display = stage === 'unlocked' ? code : masked;

  async function copy() {
    if (stage !== 'unlocked') return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`border-2 border-dashed p-4 w-full text-center rounded select-none ${
          stage === 'unlocked' ? '' : 'blur-sm'
        }`}
        onClick={() => stage === 'verified' && onReveal()}
      >
        {display}
      </div>
      <button
        onClick={copy}
        disabled={stage !== 'unlocked'}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        aria-label="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {stage !== 'unlocked' && <p className="text-xs text-gray-500">Complete an offer to unlock.</p>}
    </div>
  );
}
