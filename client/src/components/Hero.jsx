import { useState, useEffect } from 'react';
import { Link2, Play, StopCircle } from 'lucide-react';
import styles from './Hero.module.css';

export const Hero = ({ onAudit, isLoading, onCancel }) => {
  const [url, setUrl] = useState('');
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isLoading) {
      interval = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
    } else {
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const validateUrl = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;

    if (!validateUrl(cleanUrl)) {
      alert("Invalid URL. Please enter a valid URL (e.g. https://example.com)");
      return;
    }
    
    onAudit(cleanUrl);
  };

  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Audit Website</h1>
      <p className={styles.subtitle}>
        Analyze performance, SEO, and cache status in real-time. Enter a URL below to begin.
      </p>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <Link2 className={styles.icon} size={20} />
          <input 
            type="url" 
            className={styles.input}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        {isLoading ? (
          <button type="button" className={`${styles.submitBtn} ${styles.cancelBtn}`} onClick={onCancel}>
            Cancel <StopCircle size={16} fill="currentColor" />
          </button>
        ) : (
          <button type="submit" className={styles.submitBtn} disabled={!url}>
            Run Audit <Play size={16} fill="currentColor" />
          </button>
        )}
      </form>

      {isLoading && (
        <div className={styles.loadingTimer}>
          Scanning... {time.toFixed(1)}s
        </div>
      )}
    </div>
  );
};
