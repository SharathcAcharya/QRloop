import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Zap, 
  Eye, 
  Users, 
  Palette, 
  Download, 
  Share2, 
  BarChart3,
  ArrowRight,
  Play,
  Star,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const Home = () => {
  const { isAdmin } = useAdmin();
  const [qrHistory] = useState([]);
  const [favorites] = useState([]);
  const [userStats] = useState({ qrCount: 0, scans: 0 });

  const trackFeatureUsage = (_feature) => {
    // Feature tracking would go here
  };

  const features = [
    {
      icon: QrCode,
      title: 'Advanced QR Generation',
      description: 'Create professional QR codes with customizable colors, patterns, and logos',
      color: 'from-blue-500 to-purple-500',
      demo: '/demos/generation.mp4',
    },
    {
      icon: Eye,
      title: '3D Visualization',
      description: 'Preview your QR codes in stunning 3D with interactive controls',
      color: 'from-purple-500 to-pink-500',
      demo: '/demos/3d-preview.mp4',
    },
    {
      icon: Zap,
      title: 'AI Enhancement',
      description: 'Let AI optimize your QR code designs for better scanning and aesthetics',
      color: 'from-pink-500 to-red-500',
      demo: '/demos/ai-enhance.mp4',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time collaborative workspace',
      color: 'from-green-500 to-blue-500',
      demo: '/demos/collaboration.mp4',
    },
  ];

  const stats = [
    { icon: QrCode, value: userStats.totalQRsGenerated, label: 'QR Codes Generated' },
    { icon: Download, value: qrHistory.length, label: 'Downloads' },
    { icon: Star, value: favorites.length, label: 'Favorites' },
    { icon: Users, value: '10K+', label: 'Active Users' },
  ];

  const quickActions = [
    {
      title: 'Generate QR Code',
      description: 'Create a new QR code with advanced customization',
      icon: QrCode,
      path: '/generator',
      color: 'bg-primary-500',
    },
    {
      title: 'Scan QR Code',
      description: 'Scan QR codes from camera or upload image',
      icon: Eye,
      path: '/scanner',
      color: 'bg-secondary-500',
    },
    {
      title: 'Browse Templates',
      description: 'Choose from professional QR code templates',
      icon: Palette,
      path: '/templates',
      color: 'bg-accent-500',
    },
    // Only show Analytics to admin users
    ...(isAdmin ? [{
      title: 'View Analytics',
      description: 'Track performance and usage statistics',
      icon: BarChart3,
      path: '/analytics',
      color: 'bg-purple-500',
    }] : []),
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      image: '/avatars/sarah.jpg',
      quote: 'QRloop transformed how we create QR codes for our campaigns. The 3D preview feature is incredible!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Developer',
      company: 'StartupXYZ',
      image: '/avatars/mike.jpg',
      quote: 'The API integration and batch generation saved us countless hours. Best QR tool I\'ve used.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Designer',
      company: 'Creative Studio',
      image: '/avatars/emily.jpg',
      quote: 'Beautiful interface and powerful customization options. Our clients love the professional results.',
      rating: 5,
    },
  ];

  // Features auto-rotation disabled for now
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentFeature((prev) => (prev + 1) % features.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [features.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                    <QrCode size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    Advanced QR Code Generator
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Create{' '}
                  <span className="gradient-text">Stunning</span>{' '}
                  QR Codes
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Generate professional QR codes with 3D visualization, AI enhancement, 
                  and team collaboration. The most advanced QR code generator available.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/generator"
                  onClick={() => trackFeatureUsage('hero-cta')}
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={20} />
                </Link>
                <button className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2">
                  <Play size={20} />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Icon size={20} className="text-primary-500" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Interactive Demo */}
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Live Preview
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 flex items-center justify-center">
                    <div className="w-48 h-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
                      <QrCode size={120} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="btn-primary text-sm">
                      <Zap size={16} />
                      AI Enhance
                    </button>
                    <button className="btn-secondary text-sm">
                      <Eye size={16} />
                      3D Preview
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-accent-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                <Sparkles size={20} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary-500 text-white p-3 rounded-full shadow-lg animate-pulse">
                <Share2 size={20} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, customize, and manage professional QR codes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Learn More →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Jump right into what you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group block p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join thousands of satisfied users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Amazing QR Codes?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust QRloop for their QR code needs. 
            Start creating professional QR codes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generator"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-4 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Creating</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium px-8 py-4 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
