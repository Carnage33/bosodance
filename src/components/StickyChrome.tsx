"use client";

import { usePathname } from "next/navigation";

/**
 * Sticky top chrome for the client site (demo banner + header).
 * On /admin the admin page owns its own sticky top bar — chrome is not sticky
 * so bars don't stack/overlap incorrectly.
 */
export function StickyChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="relative z-[60]">{children}</div>;
  }

  return (
    <div className="sticky top-0 z-[60] border-b border-border/60 bg-bg-elevated/95 shadow-sm backdrop-blur-md">
      {children}
    </div>
  );
}
