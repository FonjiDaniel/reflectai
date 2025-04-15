"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Icons for mobile menu

interface AppHeaderProps {
  logoSrc: string;
  logoAlt: string;
  siteName: string;
}

export default function AppHeader({ logoSrc, logoAlt, siteName }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItemClasses = "font-medium hover:text-purple-200 transition-colors py-2 md:py-0";
  const mobileNavItemClasses = `${navItemClasses} block px-4 text-lg`; // Specific styles for mobile

  return (
    <header className=" text-white  bg-[rgba(102,59,138,0.5)] backdrop-blur-md t py-4 md:py-5 sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo and Site Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
              width={40}
              height={40}
              alt={logoAlt}
              className="h-8 w-8 md:h-10 md:w-10 rounded-full" 
            />
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{siteName}</h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex space-x-6 lg:space-x-8 items-center"
          > 
            <Link href="/#features" className={navItemClasses}>Features</Link>
            <Link href="/#demo" className={navItemClasses}>Demo</Link>
            <Link href="/#contact" className={navItemClasses}>Contact</Link>
            
              <Link href="/login"
                className="bg-white text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition-colors shadow-sm"
              >
                Login
              </Link>
          
          </motion.ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="text-white hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-purple-800 to-indigo-700 shadow-lg z-40"
        >
          <nav className="px-6 pt-2 pb-4">
            <ul className="space-y-2">
              <li><Link href="/#features" className={mobileNavItemClasses} onClick={toggleMobileMenu}>Features</Link></li>
              <li><Link href="/#demo" className={mobileNavItemClasses} onClick={toggleMobileMenu}>Demo</Link></li>
              <li><Link href="/#contact" className={mobileNavItemClasses} onClick={toggleMobileMenu}>Contact</Link></li>
              <li>
                <Link href="/login"
                  className="mt-2 block w-full text-center bg-white text-purple-700 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition-colors shadow-sm"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </motion.div>
      )}
    </header>
  );
}