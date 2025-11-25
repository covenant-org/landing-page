import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.copyright}>
          © {currentYear} <Link href="/">Covenant Communications</Link>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
