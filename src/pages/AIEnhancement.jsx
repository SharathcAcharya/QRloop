import React, { useState } from 'react';

const AIEnhancement = () => {
  const [prompt, setPrompt] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setAiSuggestion('🤖 AI Suggestion: Use a colored QR code with your logo embedded for better brand visibility.');
    setQrValue(prompt);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen w-full px-4 py-10 flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 transition-all">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          AI-Powered QR Code Enhancer
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-6">
          Let AI help you design smarter, better QR codes. Just describe what you want, and we’ll do the rest!
        </p>

        {/* Feature List */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 sm:p-6 mb-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 dark:text-gray-100 text-sm list-disc pl-4">
            <li>AI-powered QR design suggestions</li>
            <li>Auto-detect content type & optimize</li>
            <li>Error correction & readability analysis</li>
            <li>Voice/text prompt generation</li>
            <li>Batch QR creation using AI</li>
            <li>Style transfer from uploaded image</li>
            <li>Live AI tips panel</li>
          </ul>
        </div>

        {/* Prompt Form */}
        <form onSubmit={handleGenerate} className="flex flex-col items-center gap-4 mb-10">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. Link to my LinkedIn, product page, contact card..."
            className="w-full sm:w-4/5 px-5 py-3 text-base rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition shadow"
          >
            Generate with AI
          </button>
        </form>

        {/* AI Suggestion Display */}
        {aiSuggestion && (
          <div className="text-center bg-purple-50 dark:bg-purple-800/30 text-purple-800 dark:text-purple-200 px-6 py-4 rounded-xl font-medium mb-8">
            {aiSuggestion}
          </div>
        )}

        {/* QR Preview */}
        {showPreview && (
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">QR Code Preview</h2>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`}
              alt="Generated QR"
              className="w-40 h-40 rounded-lg border border-gray-300 dark:border-gray-700 mb-3"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 break-words text-center">
              <strong>Prompt:</strong> {qrValue}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEnhancement;
