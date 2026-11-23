import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { DraftProvider } from './data/draft';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <DraftProvider>
        <App />
      </DraftProvider>
    </HashRouter>
  </StrictMode>,
);
