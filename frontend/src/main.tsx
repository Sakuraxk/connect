import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { OrderProvider } from './contexts/OrderContext';
import { StarProvider } from './contexts/StarContext';
import { ChatProvider } from './contexts/ChatContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrderProvider>
      <StarProvider>
        <BrowserRouter>
          <ChatProvider>
            <App />
          </ChatProvider>
        </BrowserRouter>
      </StarProvider>
    </OrderProvider>
  </StrictMode>
);
