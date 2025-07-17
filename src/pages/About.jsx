import { Info } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-0 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center shadow-lg mb-2">
            <Info className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 dark:text-indigo-100 tracking-tight drop-shadow-lg">About QRloop</h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-2xl mt-2">
            QRloop is the next-generation QR code platform for modern creators, businesses, and teams. We combine advanced technology, beautiful design, and seamless collaboration.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">✨</span>
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Advanced QR Generation</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Create QR codes with custom colors, logos, and error correction. AI-powered enhancement and 3D preview included.</p>
          </div>
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🤝</span>
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Collaboration & Teamwork</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Invite team members, share QR libraries, and manage permissions. Real-time collaboration for projects and campaigns.</p>
          </div>
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🔒</span>
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Privacy & Security</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Your data is encrypted and never shared. We use industry best practices for security and privacy.</p>
          </div>
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-xl p-8 border border-indigo-100 dark:border-indigo-800 flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🚀</span>
            <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200 mb-2">Fast, Reliable, Modern</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Built with the latest web technologies for speed, reliability, and a delightful user experience on any device.</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-indigo-200/60 to-purple-200/60 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-3xl shadow-lg p-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-100 mb-2">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
            Empower everyone to create, share, and manage QR codes with ease, beauty, and security. We believe in open access, privacy, and innovation for all.
          </p>
        </div>

        {/* Team Section */}
        <div className="flex flex-col items-center text-center gap-4 mt-8">
          <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-200">Meet the Creator</h2>
          <div className="flex flex-col items-center gap-2">
            <img src="https://avatars.githubusercontent.com/u/10242663?v=4" alt="SharathcAcharya" className="w-20 h-20 rounded-full border-4 border-indigo-300 dark:border-indigo-700 shadow-lg" />
            <span className="font-semibold text-gray-900 dark:text-white">SharathcAcharya</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Founder & Lead Developer</span>
            <a href="https://github.com/SharathcAcharya" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-300 hover:underline text-sm">@SharathcAcharya</a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12">
          &copy; {new Date().getFullYear()} QRloop. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default About;
