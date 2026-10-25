import Router from './router/router.tsx';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </StrictMode>
  );
}

export default App;
