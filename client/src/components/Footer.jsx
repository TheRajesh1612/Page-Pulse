import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} Page Pulse. Built for high-performance monitoring.
      </div>
      <div className={styles.techStack}>
        <span>React</span>
        <span>Vite</span>
        <span>Express</span>
        <span>Lucide</span>
      </div>
    </footer>
  );
};
