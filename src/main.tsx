import { createRoot } from 'react-dom/client';
import App from './app/app.tsx';
import '@radix-ui/themes/styles.css';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
