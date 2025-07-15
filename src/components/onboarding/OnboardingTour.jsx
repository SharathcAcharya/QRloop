import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Target, Zap, Eye, Users, Check } from 'lucide-react';

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const completeTour = () => {
    // Track tour completion - analytics would go here
  };

  const steps = [
    {
      title: 'Welcome to QRloop!',
      description: 'The most advanced QR code generator with professional features.',
      icon: Target,
      color: 'from-blue-500 to-purple-500',
      features: [
        'Professional QR code generation',
        'Advanced customization options',
        'Real-time preview',
        'Multiple export formats',
      ],
    },
    {
      title: '3D Visualization',
      description: 'Experience your QR codes in stunning 3D with interactive controls.',
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Interactive 3D preview',
        'Real-time rotation controls',
        'Multiple viewing angles',
        'Animation effects',
      ],
    },
    {
      title: 'AI Enhancement',
      description: 'Let AI optimize your QR code designs for better performance.',
      icon: Zap,
      color: 'from-pink-500 to-red-500',
      features: [
        'Automatic style optimization',
        'Smart color suggestions',
        'Pattern enhancement',
        'Readability improvement',
      ],
    },
    {
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time workspace.',
      icon: Users,
      color: 'from-green-500 to-blue-500',
      features: [
        'Real-time collaboration',
        'Team workspace',
        'Shared templates',
        'Comment system',
      ],
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    completeTour();
    onComplete();
  };

  const handleSkip = () => {
    setIsVisible(false);
    completeTour();
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentStepData.color} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-white/90">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/80 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Features
              </h3>
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="flex items-center justify-center">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center shadow-lg`}>
                <Icon size={48} className="text-white" />
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              💡 Pro Tip
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {currentStep === 0 && "Use the floating action button for quick access to all features."}
              {currentStep === 1 && "Press and hold on the 3D preview to rotate your QR code in any direction."}
              {currentStep === 2 && "AI enhancement works best with high-contrast color combinations."}
              {currentStep === 3 && "Invite team members via email to start collaborating instantly."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
              <button
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Skip Tour
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Step Indicators */}
              <div className="flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep
                        ? 'bg-primary-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
