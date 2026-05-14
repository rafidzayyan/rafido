'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';

export default function SpreadsheetGenerator() {
  const [prompt, setPrompt] = useState('');
  const [reference, setReference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setDownloadUrl('');

    try {
      const response = await fetch('/api/generate/spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, reference }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate spreadsheet');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Store in localStorage
      const recent = JSON.parse(localStorage.getItem('recentGenerations') || '[]');
      recent.unshift({
        type: 'spreadsheet',
        prompt,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('recentGenerations', JSON.stringify(recent.slice(0, 5)));
    } catch (err) {
      setError('An error occurred while generating the spreadsheet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Excel Spreadsheet Generator</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the spreadsheet you want to create, e.g., 'Monthly budget tracker with income, expenses, and savings columns'"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Reference Table</h2>
            <textarea
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional: Provide reference data or structure for the spreadsheet"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Spreadsheet</h2>
            {isLoading && (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {downloadUrl && (
              <div className="text-center">
                <a
                  href={downloadUrl}
                  download="spreadsheet.xlsx"
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Download Spreadsheet
                </a>
              </div>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Spreadsheet'}
          </button>
        </div>
      </div>
    </div>
  );
}