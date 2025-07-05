/**
 * Custom hook to detect if we're on the client side
 * Helps prevent hydration mismatches
 */
'use client';

import { useEffect, useState } from 'react';

export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Component that only renders its children on the client side
 * Useful for preventing hydration mismatches with browser extensions
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}
