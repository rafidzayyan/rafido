import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Digital Product Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
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
    </div>
  );
}
