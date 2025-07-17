import { useState, useEffect } from 'react';
import { 
  Library as LibraryIcon, 
  Search, 
  Grid, 
  List, 
  Download, 
  Trash2, 
  Star, 
  Copy, 
  Eye,
  SortAsc,
  SortDesc,
  FolderPlus,
  Share2
} from 'lucide-react';

const LibraryPage = () => {
  // Local state to replace stores
  const [qrHistory, setQRHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const addToFavorites = (id) => {
    // Add to favorites logic
    setFavorites(prev => [...prev, id]);
  };
  
  const removeFromFavorites = (id) => {
    // Remove from favorites logic
    setFavorites(prev => prev.filter(fav => fav !== id));
  };
  
  const deleteQRCode = (id) => {
    // Delete QR code logic
    setQRHistory(prev => prev.filter(qr => qr.id !== id));
  };
  
  const isFavorite = (id) => {
    return favorites.includes(id);
  };
  
  const showSuccess = (_message) => {
    // Success notification would go here
  };
  
  const trackFeatureUsage = (_feature) => {
    // Feature tracking would go here
  };

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'favorites', 'recent'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'type'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock data
  useEffect(() => {
    const mockData = [
      {
        id: '1',
        name: 'Website QR',
        data: 'https://example.com',
        type: 'url',
        timestamp: new Date().toISOString(),
        scans: 42,
        style: { color: '#3B82F6' }
      },
      {
        id: '2',
        name: 'Contact Info',
        data: 'John Doe\nPhone: +1234567890',
        type: 'vcard',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        scans: 18,
        style: { color: '#10B981' }
      },
      {
        id: '3',
        name: 'WiFi Access',
        data: 'WIFI:T:WPA;S:MyNetwork;P:password123;;',
        type: 'wifi',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        scans: 67,
        style: { color: '#F59E0B' }
      }
    ];
    setQRHistory(mockData);
  }, []);

  // Filter and sort QR codes
  const filteredQRs = qrHistory
    .filter(qr => {
      const matchesSearch = qr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qr.data.toLowerCase().includes(searchTerm.toLowerCase());
      
      switch (filterBy) {
        case 'favorites':
          return matchesSearch && isFavorite(qr.id);
        case 'recent': {
          const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
          return matchesSearch && new Date(qr.timestamp) > threeDaysAgo;
        }
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = (a.type || 'text').localeCompare(b.type || 'text');
          break;
        case 'date':
        default:
          comparison = new Date(a.timestamp) - new Date(b.timestamp);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleToggleFavorite = (qr) => {
    if (isFavorite(qr.id)) {
      removeFromFavorites(qr.id);
      showSuccess(`Removed "${qr.name}" from favorites`);
    } else {
      addToFavorites(qr.id);
      showSuccess(`Added "${qr.name}" to favorites`);
    }
    trackFeatureUsage('toggle_favorite');
  };

  const handleDeleteItem = (id) => {
    const qr = qrHistory.find(q => q.id === id);
    if (qr) {
      deleteQRCode(id);
      showSuccess(`Deleted "${qr.name}"`);
      trackFeatureUsage('delete_qr');
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => deleteQRCode(id));
    showSuccess(`Deleted ${selectedItems.length} items`);
    setSelectedItems([]);
    trackFeatureUsage('bulk_delete');
  };

  const QRCard = ({ qr }) => {
    const isStarred = isFavorite(qr.id);
    const isSelected = selectedItems.includes(qr.id);

    return (
      <div className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        hover:shadow-md transition-all duration-200 cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {qr.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {qr.type?.toUpperCase() || 'TEXT'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleToggleFavorite(qr)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isStarred 
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => handleDeleteItem(qr.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3 flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: qr.style?.color || '#6B7280' }}
            >
              QR
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
            {qr.data}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{new Date(qr.timestamp).toLocaleDateString()}</span>
            <span>{qr.scans} scans</span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex space-x-1">
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-0 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-green-400 flex items-center justify-center shadow-lg mb-2">
            <LibraryIcon className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-blue-100 tracking-tight drop-shadow-lg">QR Library</h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mt-2">
            Manage, organize, and search your QR codes. Favorite, share, and download with ease.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-800 p-8 mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="all">All QR Codes</option>
            <option value="favorites">Favorites</option>
            <option value="recent">Recent</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-base"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-base"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
          </button>

          {/* View Mode */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} transition-colors`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'} transition-colors`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400 text-base">
            {filteredQRs.length} QR codes found
          </p>
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center transition-colors text-base"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Selected ({selectedItems.length})
            </button>
          )}
        </div>

        {/* QR Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredQRs.map(qr => (
              <QRCard key={qr.id} qr={qr} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQRs.map(qr => (
              <QRCard key={qr.id} qr={qr} />
            ))}
          </div>
        )}

        {filteredQRs.length === 0 && (
          <div className="text-center py-16">
            <LibraryIcon className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No QR codes found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first QR code to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
