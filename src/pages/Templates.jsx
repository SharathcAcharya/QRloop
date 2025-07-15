import { useState } from 'react';
import { Star, Download, Eye, Zap, Check } from 'lucide-react';

const Templates = () => {
  // Replace store functions with local implementations
  const applyTemplate = (_templateId) => {
    // Template application logic would go here
    // Applying template: templateId
  };
  
  const showSuccess = (_message) => {
    // Success notification would go here
    // Success: message
  };
  
  const trackFeatureUsage = (_feature) => {
    // Feature tracking would go here
    // Feature used: feature
  };
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState('grid'); // 'grid' or 'detail'

  // Enhanced template data with more options
  const enhancedTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      category: 'Business',
      description: 'Clean, professional design with rounded corners',
      thumbnail: '/templates/modern.svg',
      preview: '🔲',
      options: {
        colorDark: '#1f2937',
        colorLight: '#ffffff',
        dotOptions: { type: 'rounded' },
        cornerSquareOptions: { type: 'extra-rounded', color: '#1f2937' },
        cornerDotOptions: { type: 'rounded', color: '#1f2937' }
      },
      tags: ['professional', 'clean', 'business'],
      downloads: 1250,
      rating: 4.8
    },
    {
      id: 'colorful',
      name: 'Colorful',
      category: 'Creative',
      description: 'Vibrant blue design with dot patterns',
      thumbnail: '/templates/colorful.svg',
      preview: '🟦',
      options: {
        colorDark: '#3b82f6',
        colorLight: '#ffffff',
        dotOptions: { type: 'dots', color: '#3b82f6' },
        cornerSquareOptions: { type: 'square', color: '#1d4ed8' },
        cornerDotOptions: { type: 'dots', color: '#2563eb' }
      },
      tags: ['creative', 'colorful', 'modern'],
      downloads: 980,
      rating: 4.6
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'Simple',
      description: 'Classic black and white design',
      thumbnail: '/templates/minimal.svg',
      preview: '⬛',
      options: {
        colorDark: '#000000',
        colorLight: '#ffffff',
        dotOptions: { type: 'square', color: '#000000' },
        cornerSquareOptions: { type: 'square', color: '#000000' },
        cornerDotOptions: { type: 'square', color: '#000000' }
      },
      tags: ['minimal', 'classic', 'simple'],
      downloads: 2100,
      rating: 4.9
    },
    {
      id: 'gradient',
      name: 'Gradient',
      category: 'Creative',
      description: 'Purple gradient with smooth transitions',
      thumbnail: '/templates/gradient.svg',
      preview: '🟣',
      options: {
        colorDark: '#8b5cf6',
        colorLight: '#ffffff',
        dotOptions: { type: 'classy-rounded', color: '#8b5cf6' },
        cornerSquareOptions: { type: 'extra-rounded', color: '#7c3aed' },
        cornerDotOptions: { type: 'rounded', color: '#6d28d9' }
      },
      tags: ['gradient', 'purple', 'elegant'],
      downloads: 760,
      rating: 4.7
    },
    {
      id: 'retro',
      name: 'Retro',
      category: 'Vintage',
      description: 'Vintage-inspired design with warm colors',
      thumbnail: '/templates/retro.svg',
      preview: '🟤',
      options: {
        colorDark: '#d97706',
        colorLight: '#fef3c7',
        dotOptions: { type: 'classy', color: '#d97706' },
        cornerSquareOptions: { type: 'rounded', color: '#b45309' },
        cornerDotOptions: { type: 'classy', color: '#92400e' }
      },
      tags: ['retro', 'vintage', 'warm'],
      downloads: 540,
      rating: 4.5
    },
    {
      id: 'tech',
      name: 'Tech',
      category: 'Technology',
      description: 'Futuristic design with sharp edges',
      thumbnail: '/templates/tech.svg',
      preview: '⚡',
      options: {
        colorDark: '#10b981',
        colorLight: '#f0fdfa',
        dotOptions: { type: 'square', color: '#10b981' },
        cornerSquareOptions: { type: 'square', color: '#047857' },
        cornerDotOptions: { type: 'square', color: '#065f46' }
      },
      tags: ['tech', 'futuristic', 'green'],
      downloads: 820,
      rating: 4.6
    }
  ];

  const categories = ['All', 'Business', 'Creative', 'Simple', 'Vintage', 'Technology'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = enhancedTemplates.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  );

  const handleApplyTemplate = (template) => {
    applyTemplate(template.id);
    showSuccess(`Applied ${template.name} template`);
    trackFeatureUsage('apply-template');
  };

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewMode('detail');
    trackFeatureUsage('preview-template');
  };

  const handleDownloadTemplate = (template) => {
    // Create and download template configuration
    const templateConfig = {
      name: template.name,
      options: template.options,
      metadata: {
        category: template.category,
        description: template.description,
        tags: template.tags
      }
    };

    const blob = new Blob([JSON.stringify(templateConfig, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-template-${template.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showSuccess(`Downloaded ${template.name} template`);
    trackFeatureUsage('download-template');
  };

  const TemplateCard = ({ template }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group">
      {/* Template Preview */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 h-48 flex items-center justify-center">
        <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform">
          {template.preview}
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePreviewTemplate(template)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => handleApplyTemplate(template)}
              className="p-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors"
            >
              <Check size={16} />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs">
          <Star size={12} className="text-yellow-500" fill="currentColor" />
          <span className="text-gray-600 dark:text-gray-400">{template.rating}</span>
        </div>

        {/* Downloads */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs">
          <Download size={12} className="text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">{template.downloads}</span>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {template.name}
          </h3>
          <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
            {template.category}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleApplyTemplate(template)}
            className="flex-1 btn-primary text-sm"
          >
            Apply Template
          </button>
          <button
            onClick={() => handleDownloadTemplate(template)}
            className="p-2 btn-secondary"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (previewMode === 'detail' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => setPreviewMode('grid')}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Templates</span>
          </button>

          {/* Template Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Template Preview
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg h-96 flex items-center justify-center">
                <div className="text-8xl">
                  {selectedTemplate.preview}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedTemplate.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedTemplate.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">{selectedTemplate.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
                      <Download size={16} />
                      <span className="font-semibold">{selectedTemplate.downloads}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Downloads</span>
                  </div>
                  <div className="text-center">
                    <div className="text-primary-500 font-semibold mb-1">
                      {selectedTemplate.category}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApplyTemplate(selectedTemplate)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Check size={16} />
                    <span>Apply Template</span>
                  </button>
                  <button
                    onClick={() => handleDownloadTemplate(selectedTemplate)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Technical Details */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Technical Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Foreground Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: selectedTemplate.options.colorDark }}
                      />
                      <span className="font-mono">{selectedTemplate.options.colorDark}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Background Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: selectedTemplate.options.colorLight }}
                      />
                      <span className="font-mono">{selectedTemplate.options.colorLight}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dot Style:</span>
                    <span className="capitalize">{selectedTemplate.options.dotOptions?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Corner Style:</span>
                    <span className="capitalize">{selectedTemplate.options.cornerSquareOptions?.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose from professional QR code templates to get started quickly
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Custom Template Section */}
        <div className="mt-12">
          <div className="card">
            <div className="text-center py-8">
              <Zap size={48} className="mx-auto text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Custom Template
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Design your own QR code template with our advanced customization options
              </p>
              <a href="/generator" className="btn-primary">
                Start Creating
              </a>
            </div>
          </div>
        </div>

        {/* Popular Templates */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Most Popular Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {enhancedTemplates
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((template) => (
                <div key={`popular-${template.id}`} className="relative">
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    Popular
                  </div>
                  <TemplateCard template={template} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
