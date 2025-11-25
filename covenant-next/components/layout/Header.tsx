'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export default function Header({ onMenuClick, isMenuOpen = false }: HeaderProps) {
  const pathname = usePathname();

  const isAccountPage = pathname?.startsWith('/account');

  return (
    <header className={styles.header}>
      {/* Mobile Logo */}
      <div className={styles.mobileLogo}>COVENANT</div>

      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        <Link href="/shop" className={pathname === '/shop' ? styles.active : ''}>
          Shop
        </Link>
        <Link href="/account/dashboard" className={isAccountPage ? styles.active : ''}>
          Account
        </Link>
      </nav>

      {/* Right side icons */}
      <div className={styles.icons}>
        {/* Cart Icon */}
        <Link href="/cart" className={styles.iconLink}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </Link>

        {/* User Avatar (desktop only) */}
        <div className={styles.avatar}>
          <span>M</span>
        </div>

        {/* Hamburger Menu (mobile only) */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <div />
          <div />
          <div />
        </button>
      </div>
    </header>
  );
}
