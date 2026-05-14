'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {!isHome && (
              <Link href="/" className="text-gray-600 hover:text-gray-900 mr-4">
                ← Back
              </Link>
            )}
            <Link href="/" className="text-xl font-bold text-gray-900">
              Digital Product Generator
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}