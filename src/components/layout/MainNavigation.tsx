/**
 * Main Navigation Component for Proofly
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState, useCallback } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function MainNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  
  const navItems = useMemo(() => [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/cv', label: 'CV Builder', icon: '📄' },
    { href: '/ats', label: 'ATS Checker', icon: '🎯' },
    { href: '/cover-letter', label: 'Cover Letter', icon: '💼' },
    { href: '/blog', label: 'Career Tips', icon: '📝' },
  ], []);

  const handleNavigation = useCallback((href: string, e: React.MouseEvent) => {
    if (href === pathname) return;
    
    // Show loading state
    setLoadingRoute(href);
    
    // Pre-load the route
    router.prefetch(href);
    
    // Clear loading state after navigation
    setTimeout(() => {
      setLoadingRoute(null);
    }, 1000);
  }, [pathname, router]);

  return (
    <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
            prefetch={true}
            aria-label="Proofly CV - Home"
          >
            <div className="relative w-30 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">Proofly CV</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </div>

          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                aria-label={`Navigate to ${item.label}`}
                onClick={(e) => handleNavigation(item.href, e)}
                className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } ${loadingRoute === item.href ? 'opacity-75' : ''}`}
              >
                {loadingRoute === item.href ? (
                  <LoadingSpinner size="sm" color="blue" />
                ) : (
                  <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Get Started Button (only on homepage) */}
            {pathname === '/' && (
              <Link
                href="/cv"
                prefetch={true}
                aria-label="Get Started with CV Builder"
                className="hidden sm:inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >                Get Started
                <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" suppressHydrationWarning>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              aria-label={`Navigate to ${item.label}`}
              onClick={(e) => handleNavigation(item.href, e)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              } ${loadingRoute === item.href ? 'opacity-75' : ''}`}
            >
              {loadingRoute === item.href ? (
                <LoadingSpinner size="sm" color="blue" />
              ) : (
                <span className="text-lg" role="img" aria-label={item.label}>{item.icon}</span>
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
