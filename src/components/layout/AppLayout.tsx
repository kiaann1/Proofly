/**
 * Modern responsive app layout component for Proofly
 * Uses the global MainNavigation and provides responsive content container
 */

'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export default function AppLayout({ children, className = '', fullWidth = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content with responsive padding that accounts for navigation */}
      <div className={`
        ${fullWidth ? '' : 'max-w-7xl mx-auto'}
        ${className}
      `}>
        <main className={`
          ${fullWidth ? '' : 'px-4 sm:px-6 lg:px-8'}
        `}>
          {children}
        </main>
      </div>
    </div>
  );
}
