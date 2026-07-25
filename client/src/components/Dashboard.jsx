import { 
  Activity, 
  BarChart2, 
  CheckCircle2, 
  Clock, 
  Copy, 
  FileText, 
  Search, 
  X,
  AlertCircle,
  RefreshCw,
  Zap,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import styles from './Dashboard.module.css';

export const Dashboard = ({ data, isLoading, error, onRetry }) => {
  
  const handleCopyJSON = () => {
    if (data) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast.success('JSON copied to clipboard!', { icon: '📋' });
    }
  };

  const handleDownloadJSON = () => {
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pagepulse-audit-${new Date().getTime()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`${styles.card} ${styles.skeletonCard} ${i > 2 ? styles.fullWidth : ''}`}>
             <div className="skeleton" style={{ width: '120px', height: '20px' }}></div>
             {i === 2 ? (
                <div className={`${styles.skeletonCircle} skeleton`}></div>
             ) : (
                <>
                  <div className={`${styles.skeletonLine} skeleton`} style={{ width: '80%' }}></div>
                  <div className={`${styles.skeletonLine} skeleton`} style={{ width: '60%' }}></div>
                  <div className={`${styles.skeletonLine} skeleton`} style={{ width: '90%' }}></div>
                </>
             )}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.errorCard}`}>
          <div className={styles.errorIcon}>
            <AlertCircle size={32} />
          </div>
          <h2>Audit Failed</h2>
          <p>{error.message || "The website could not be reached. (Connection Timeout)"}</p>
          <div className={styles.errorCodeBox}>
            <span className={styles.errorCodeLabel}>Error Code</span>
            <span className={styles.errorCodeValue}>{error.code || 'ETIMEDOUT'}</span>
          </div>
          <button className={styles.tryAgainBtn} onClick={onRetry}>
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.grid}>
      {/* Status Card */}
      <div className={styles.card} style={{ borderTop: '3px solid var(--success-color)' }}>
        <div className={styles.cardHeader}>
          <Activity size={16} /> Status
          <span className={`${styles.cardHeaderRight} ${styles.badge} ${styles.badgeSuccess}`}>
            {data.statusCode} OK
          </span>
        </div>
        <div className={styles.statusContent}>
          <div className={styles.statusIcon}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statusText}>
            <h3>Success</h3>
            <p>Connection established</p>
          </div>
        </div>
      </div>

      {/* Performance Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Clock size={16} /> Performance
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.circularProgress}>
            <div className={styles.progressValue}>
              <strong>{data.responseTimeMs}</strong>
              <span>ms</span>
            </div>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>TTFB</span>
        </div>
      </div>

      {/* SEO Core Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Search size={16} /> SEO Core
        </div>
        <div>
          <div className={styles.seoRow}>
            <span>hasTitle</span>
            {data.seo.hasTitle ? <CheckCircle2 size={18} color="var(--success-color)" /> : <X size={18} color="var(--error-color)" />}
          </div>
          <div className={styles.seoRow}>
            <span>hasDescription</span>
            {data.seo.hasDescription ? <CheckCircle2 size={18} color="var(--success-color)" /> : <X size={18} color="var(--error-color)" />}
          </div>
          <div className={styles.seoTitle}>
            {data.seo.title || 'No Title Found'}
          </div>
        </div>
      </div>

      {/* Request Details */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <FileText size={16} /> Request Details
          <div className={styles.cardHeaderRight} style={{ display: 'flex', gap: '0.5rem' }}>
             <button className={styles.iconBtn} onClick={handleCopyJSON} title="Copy JSON">
               <Copy size={14} />
             </button>
             <button className={styles.iconBtn} onClick={handleDownloadJSON} title="Download JSON">
               <Download size={14} />
             </button>
          </div>
        </div>
        <div className={styles.detailsGrid}>
          <div>
            <div className={styles.detailLabel}>Request ID</div>
            <div className={styles.codeBox}>
              req_{Math.random().toString(36).substr(2, 9)}
            </div>
          </div>
          <div>
            <div className={styles.detailLabel}>Timestamp</div>
            <div style={{ fontFamily: 'monospace', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              {new Date(data.auditedAt).toISOString()}
            </div>
          </div>
        </div>
        <div className={styles.detailLabel}>Cache Status</div>
        <div className={styles.cacheStatus}>
          {data.cached ? (
            <span className={`${styles.badge} ${styles.badgeInfo}`} style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-color)' }}>
              <Zap size={12} style={{ display: 'inline', verticalAlign: 'text-top', marginRight: '4px' }} />
              Cached result
            </span>
          ) : (
            <span className={`${styles.badge} ${styles.badgeInfo}`} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)' }}>
              <RefreshCw size={12} style={{ display: 'inline', verticalAlign: 'text-top', marginRight: '4px' }} />
              Fresh scan
            </span>
          )}
        </div>
      </div>

      {/* Network Timeline */}
      <div className={`${styles.card} ${styles.fullWidth}`}>
        <div className={styles.cardHeader}>
          <BarChart2 size={16} /> Network Timeline
        </div>
        <div className={styles.barChart}>
           {[20, 30, 15, 60, 40, 80].map((h, i) => (
             <div key={i} className={styles.bar} style={{ height: `${h}%` }}></div>
           ))}
        </div>
      </div>

    </div>
  );
};
