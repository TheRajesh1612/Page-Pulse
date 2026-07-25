import { BoxSelect } from 'lucide-react';
import styles from './EmptyState.module.css';

export const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.iconContainer}>
        <BoxSelect size={48} className={styles.icon} />
      </div>
      <h2>Ready to Audit</h2>
      <p>Enter a URL above to get instant performance and SEO metrics.</p>
    </div>
  );
};
