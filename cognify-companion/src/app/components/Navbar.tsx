'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  navbarContainer,
  logoStyle,
  navLinks,
  navItem,
  darkToggle,
} from './styles/navbar.styles'
import logo from './images/logo.png';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={navbarContainer}
    >
      <Link href="/" className={logoStyle}>
        <Image src={logo} alt="Logo" width={32} height={32} className="dark:invert"/>
        <span>Cognify Companion</span>
      </Link>

      <nav className="flex items-center gap-6">
        <ul className={navLinks}>
          <li><Link href="/" className={navItem}>Home</Link></li>
          <li><Link href="/upload" className={navItem}>Upload</Link></li>
          
        </ul>

        <button
          onClick={() => setIsDark(!isDark)}
          className={darkToggle}
          aria-label="Toggle dark mode"
        >
          {isDark ? '🌙' : '☀️'}
        </button>
      </nav>
    </motion.header>
  );
};

export default Navbar;
