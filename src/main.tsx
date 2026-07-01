import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { IntlProvider } from './components/IntlProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </StrictMode>,
);
