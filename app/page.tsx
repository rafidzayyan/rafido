'use client';

import Link from 'next/link';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';

interface RecentItem {
  type: string;
  prompt: string;
  timestamp: string;
}

export default function Home() {
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentGenerations') || '[]');
    setRecent(stored);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex flex-col items-center justify-center p-4 pt-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Digital Product Generator</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
          <Link href="/generate/spreadsheet" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Excel Spreadsheet</h2>
              <p className="text-gray-600">Generate custom Excel spreadsheets with your data.</p>
            </div>
          </Link>
          <Link href="/generate/worksheet" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Children Worksheet</h2>
              <p className="text-gray-600">Create fun worksheets for kids as PDF files.</p>
            </div>
          </Link>
          <Link href="/generate/ebook" className="block">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ebook</h2>
              <p className="text-gray-600">Generate complete ebooks in PDF format.</p>
            </div>
          </Link>
        </div>
        {recent.length > 0 && (
          <div className="max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recent Generations</h2>
            <div className="space-y-4">
              {recent.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium capitalize">
                        {item.type}
                      </span>
                      <p className="text-gray-700 mt-2">{item.prompt}</p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
