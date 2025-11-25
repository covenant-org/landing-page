'use client';

import { useState } from 'react';
import { Sidebar, Header, Footer, BackgroundEffect } from '@/components/layout';
import styles from './layout.module.css';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <BackgroundEffect />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className={styles.layoutWrapper}>
        <Header onMenuClick={toggleSidebar} isMenuOpen={isSidebarOpen} />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
}
