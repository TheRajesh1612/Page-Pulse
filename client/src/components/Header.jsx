import { useState, useEffect } from 'react';
import { Activity, Code, Moon, Sun, History, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export const Header = ({ history, onSelectHistory }) => {
  const [isLight, setIsLight] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isLight]);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <Activity size={24} color="var(--accent-color)" />
        </div>
        <div className={styles.titleWrapper}>
          <span className={styles.title}>Page Pulse</span>
          <span className={styles.subtitle}>PRODUCTION URL AUDIT SERVICE</span>
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.historyContainer}>
          <button 
            className={styles.historyBtn} 
            onClick={() => setShowHistory(!showHistory)}
            aria-label="Recent Scans"
          >
            <History size={18} />
            <span className={styles.hideMobile}>Recent Scans</span>
            <ChevronDown size={14} />
          </button>
          
          {showHistory && (
            <div className={styles.historyDropdown}>
              <div className={styles.dropdownHeader}>Recent Scans</div>
              {history && history.length > 0 ? (
                <ul className={styles.historyList}>
                  {history.map((url, i) => (
                    <li key={i}>
                      <button onClick={() => {
                        onSelectHistory(url);
                        setShowHistory(false);
                      }}>
                        {url}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.noHistory}>No recent scans</div>
              )}
            </div>
          )}
        </div>

        <a href="https://github.com" target="_blank" rel="noreferrer" className={`${styles.link} ${styles.hideMobile}`}>
          <Code size={18} />
          GitHub
        </a>
        <button 
          className={styles.themeToggle} 
          onClick={() => setIsLight(!isLight)}
          aria-label="Toggle theme"
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};
