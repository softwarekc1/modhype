export function startLocker(couponId) {
  const verifying = new CustomEvent('locker:verifying', { detail: { couponId } });
  window.dispatchEvent(verifying);
  const params = new URLSearchParams(window.location.search);
  if (params.get('unlock') === 'true') {
    window.onOfferComplete(couponId);
    return;
  }
  if (typeof window.og_load === 'function') {
    window.og_load();
  }
}

// Global callback for offer completion
window.onOfferComplete = function (couponId) {
  const evt = new CustomEvent('locker:complete', { detail: { couponId } });
  window.dispatchEvent(evt);
};
