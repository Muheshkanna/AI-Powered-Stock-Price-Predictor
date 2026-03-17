import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aethelgard_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('aethelgard_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aethelgard_theme', 'light');
    }
  }, [isDark]);

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsDark(!isDark)}
      className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-secondary/80 border border-border hover:border-primary/40 transition-all duration-300 group"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <Sun className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-amber-500'}`} />
      <Moon className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100 text-blue-400' : 'opacity-0 -rotate-90 scale-0'}`} />
    </motion.button>
  );
};

export default ThemeToggle;
