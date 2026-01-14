import React from 'https://esm.sh/react';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import App from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
