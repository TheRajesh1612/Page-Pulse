import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { Footer } from './components/Footer.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import styles from './App.module.css';
import './index.css';

const API_URL = 'http://localhost:3000/api/v1/audit';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('pagepulse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const abortControllerRef = useRef(null);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('pagepulse_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (url) => {
    setHistory(prev => {
      const filtered = prev.filter(item => item !== url);
      return [url, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      toast('Audit cancelled', { icon: '🛑' });
    }
  };

  const handleAudit = async (url) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await axios.post(
        API_URL, 
        { url },
        { signal: abortControllerRef.current.signal }
      );
      
      if (response.data.success) {
        setTimeout(() => {
           setData({
             ...response.data.data,
             cached: response.data.cached
           });
           addToHistory(url);
           setIsLoading(false);
           toast.success('Audit complete!');
        }, 800);
      } else {
        throw new Error(response.data.error?.message || 'Failed to fetch audit data');
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        return; // Handled by handleCancel
      }
      
      setTimeout(() => {
        setIsLoading(false);
        if (err.response) {
           const status = err.response.status;
           
           if (status === 429) {
             const retryAfter = err.response.headers['retry-after'] || '15';
             const msg = `Too many requests. Please retry in ${retryAfter} seconds.`;
             toast.error(msg, { duration: 5000 });
             setError({ message: msg, code: 'HTTP_429_TOO_MANY_REQUESTS' });
             return;
           }

           setError({
             message: err.response.data?.error?.message || 'Server error occurred',
             code: status === 504 || status === 408 ? 'ETIMEDOUT' : `HTTP_${status}`
           });
           toast.error('Audit failed');
        } else {
           setError({
             message: err.message || 'The website could not be reached. (Connection Timeout)',
             code: err.code || 'ETIMEDOUT'
           });
           toast.error('Connection failed');
        }
      }, 500);
    }
  };

  const clearState = () => {
    setError(null);
    setData(null);
  };

  return (
    <div className={styles.appContainer}>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }
      }}/>
      <Header history={history} onSelectHistory={handleAudit} />
      
      <main className={styles.mainContent}>
        <Hero 
          onAudit={handleAudit} 
          isLoading={isLoading} 
          onCancel={handleCancel}
        />
        
        {(isLoading || data || error) ? (
          <Dashboard 
            data={data} 
            isLoading={isLoading} 
            error={error} 
            onRetry={clearState}
          />
        ) : (
          <EmptyState />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
