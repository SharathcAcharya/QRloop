import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Github, 
  Twitter, 
  Heart, 
  Globe, 
  Mail, 
  Coffee,
  Star,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAdmin } = useAdmin();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'QR Generator', href: '/generator' },
        { label: 'QR Scanner', href: '/scanner' },
        { label: 'Templates', href: '/templates' },
        // Only show Analytics to admin users
        ...(isAdmin ? [{ label: 'Analytics', href: '/analytics' }] : []),
        { label: 'Collaboration', href: '/collaboration' },
      ],
    },
    {
      title: 'Features',
      links: [
        { label: '3D Visualization', href: '/features/3d' },
        { label: 'AI Enhancement', href: '/features/ai' },
        { label: 'Batch Generation', href: '/features/batch' },
        { label: 'Cloud Sync', href: '/features/sync' },
        { label: 'Team Management', href: '/features/team' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api' },
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Blog', href: '/blog' },
        { label: 'Community', href: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Changelog', href: '/changelog' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/SharathcAcharya/QRloop', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/qrloop', label: 'Twitter' },
    { icon: Globe, href: 'https://qrloop.com', label: 'Website' },
    { icon: Mail, href: 'mailto:hello@qrloop.com', label: 'Email' },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: QrCode, value: '1M+', label: 'QR Codes Generated' },
    { icon: Star, value: '4.9', label: 'User Rating' },
    { icon: Zap, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <QrCode size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">QRloop</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              The most advanced QR code generator with 3D visualization, AI enhancement, 
              and collaborative features. Create professional QR codes that stand out.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center space-x-2">
                    <Icon size={16} className="text-primary-500" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Stay updated with QRloop
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get the latest features, tips, and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button className="btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {currentYear} QRloop. All rights reserved.
              </p>
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <span>Made with</span>
                <Heart size={16} className="text-red-500" />
                <span>by</span>
                <a
                  href="https://github.com/SharathcAcharya"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  SharathcAcharya
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield size={16} className="text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  SSL Secured
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee size={16} className="text-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Buy me a coffee
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
