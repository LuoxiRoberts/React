import React from 'react';
import Home from './pages/Home';
import styles from './styles/App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <h1>Data Import and Management</h1>
      <Home />
    </div>
  );
}

export default App;