# Coupon Locker Demo

This demo shows a coupon/deals interface built with React and Tailwind (via CDN). Coupon codes remain blurred until unlocked through an OGAds content locker. Unlock state persists in localStorage.

## Usage

Open `index.html` in a browser. Use the search bar or category filters to find coupons. Click `Get Code` to open the modal, then `Get Full Code` to trigger the locker. For local testing you can simulate completion in the console:

```
window.onOfferComplete('netflix1')
```

`app.js` passes `node --check` without syntax errors.
