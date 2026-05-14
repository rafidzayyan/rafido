'use client';

import { useState } from 'react';
import NavBar from '../../components/NavBar';

export default function WorksheetGenerator() {
  const [prompt, setPrompt] = useState('');
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
      const response = await fetch('/api/generate/worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate worksheet');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      // Store in localStorage
      const recent = JSON.parse(localStorage.getItem('recentGenerations') || '[]');
      recent.unshift({
        type: 'worksheet',
        prompt,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('recentGenerations', JSON.stringify(recent.slice(0, 5)));
    } catch (err) {
      setError('An error occurred while generating the worksheet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Children Worksheet Generator</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Worksheet Description</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the worksheet, e.g., 'Simple addition worksheet for 6-year-olds with 10 problems'"
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-center mt-4">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Worksheet'}
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating your worksheet...</p>
          </div>
        )}
        {downloadUrl && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Download Your Worksheet</h2>
            <a
              href={downloadUrl}
              download="worksheet.pdf"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Download PDF
            </a>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}