import Router from './router/router.tsx';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode, useEffect } from 'react';
import { startWorker } from '../worker/client.ts';
import { Theme } from '@radix-ui/themes';
import styles from './app.module.css';

function App() {
  useEffect(() => {
    startWorker();
  }, []);

  return (
    <StrictMode>
      <Theme
        className={styles.theme}
        appearance="dark"
        accentColor="cyan"
        grayColor="slate"
        panelBackground="translucent"
        radius="large"
        scaling="100%"
      >
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Theme>
    </StrictMode>
  );
}

export default App;
