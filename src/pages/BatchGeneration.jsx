import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, Download, Sparkles } from 'lucide-react';

const BatchGeneration = () => {
  const [csvData, setCsvData] = useState('');
  const [qrList, setQrList] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleCsvChange = (e) => {
    setCsvData(e.target.value);
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    const lines = csvData.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      setError('Please enter at least one value.');
      setProcessing(false);
      return;
    }
    const newQrs = lines.map((val, idx) => ({
      value: val,
      url: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(val)}`
    }));
    setQrList(newQrs);
    setProcessing(false);
    setStep(3);
  };

  const handleSample = () => {
    setCsvData('https://example.com\nContact Info\nProduct 1\nProduct 2');
    setStep(2);
  };

  const handleReset = () => {
    setCsvData('');
    setQrList([]);
    setError('');
    setStep(1);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-4 flex justify-center items-center gap-3">
            <Sparkles className="w-8 h-8 animate-pulse" /> Batch QR Code Generator
          </h1>
          <p className="text-center text-gray-700 dark:text-gray-200 mb-8 text-lg">
            Paste or upload data and generate multiple QR codes instantly. Preview and download in bulk.
          </p>

          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            <span className="bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 px-4 py-1 rounded-full text-sm font-semibold">CSV Upload</span>
            <span className="bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-100 px-4 py-1 rounded-full text-sm font-semibold">ZIP Download</span>
            <span className="bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100 px-4 py-1 rounded-full text-sm font-semibold">Preview Grid</span>
          </div>

          {step === 1 && (
            <div className="text-center">
              <textarea
                value={csvData}
                onChange={handleCsvChange}
                rows={6}
                className="w-full p-4 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-indigo-700 dark:text-white resize-y shadow"
                placeholder="Paste each item in a new line (e.g. URL, text, etc.)"
              ></textarea>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button onClick={handleSample} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold shadow">
                  Use Sample Data
                </button>
                <button onClick={() => setStep(2)} disabled={!csvData.trim()} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleGenerate} className="text-center">
              <textarea
                value={csvData}
                onChange={handleCsvChange}
                rows={6}
                disabled={processing}
                className="w-full p-4 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-indigo-700 dark:text-white resize-y shadow"
              ></textarea>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <button onClick={handleReset} disabled={processing} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold shadow">
                  Back
                </button>
                <button type="submit" disabled={processing} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow">
                  {processing ? 'Generating...' : 'Generate QRs'}
                </button>
              </div>
              {error && <p className="text-red-500 mt-2 flex justify-center items-center gap-2"><AlertTriangle className="w-4 h-4" /> {error}</p>}
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mb-6 flex flex-wrap justify-center gap-4">
                <button onClick={handleReset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold shadow">
                  Start Over
                </button>
                <button onClick={() => alert('ZIP Download feature coming soon!')} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow flex items-center gap-2">
                  <Download className="w-5 h-5" /> Download All (ZIP)
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {qrList.map((qr, idx) => (
                  <div key={idx} className="p-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl shadow bg-white dark:bg-gray-800 flex flex-col items-center">
                    <img src={qr.url} alt={`QR ${idx + 1}`} className="w-32 h-32 object-contain mb-2 rounded-lg shadow-lg" />
                    <p className="text-sm text-center text-indigo-800 dark:text-indigo-100 break-words font-semibold">{qr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12">
            Planned: Excel support, ZIP download, error handling, and CSV export coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchGeneration;
