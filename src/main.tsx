import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
    <ToastProvider>
      <DataProvider>
      <App />
    </DataProvider>
    </ToastProvider>
    </MotionConfig>
      </QueryClientProvider>
  </StrictMode>,
);
