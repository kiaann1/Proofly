/**
 * Fully Responsive Main Navigation Component for Proofly
 * Features: Mobile hamburger menu, tablet sidebar, desktop navigation
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

export default function MainNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = useMemo(() => [
    { href: '/', label: 'Dashboard', icon: '🏠', description: 'Home and overview' },
    { href: '/cv', label: 'CV Builder', icon: '📄', description: 'Create and edit your CV' },
    { href: '/ats', label: 'ATS Checker', icon: '🎯', description: 'Check ATS compatibility' },
    { href: '/cover-letter', label: 'Cover Letter', icon: '💼', description: 'Generate cover letters' },
    { href: '/blog', label: 'Career Tips', icon: '📝', description: 'Expert career advice' },
  ], []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setSidebarOpen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Tablet Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Mobile hamburger & Tablet sidebar toggle */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.innerWidth >= 768 ? toggleSidebar() : toggleMobileMenu();
                  } else {
                    toggleMobileMenu();
                  }
                }}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={mobileMenuOpen || sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                  />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              prefetch={true}
              aria-label="Proofly CV - Home"
            >
              <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm lg:text-base">P</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
              </div>
              <span className="font-bold text-lg lg:text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                Proofly CV
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  aria-label={`Navigate to ${item.label}`}
                  className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Get Started Button */}
              {pathname === '/' && (
                <Link
                  href="/cv"
                  prefetch={true}
                  aria-label="Get Started with CV Builder"
                  className="inline-flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <svg className="w-4 h-4 ml-1 sm:ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Dropdown Menu */}
      <div className={`
        fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
      `}>
        <div className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              aria-label={`Navigate to ${item.label}`}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl" role="img" aria-label={item.label}>{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Tablet Sidebar */}
      <div className={`
        fixed top-16 left-0 bottom-0 w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out hidden md:block lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                aria-label={`Navigate to ${item.label}`}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl" role="img" aria-label={item.label}>{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
