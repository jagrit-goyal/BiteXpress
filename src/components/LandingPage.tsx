import React from 'react';
import { Users, Store, ArrowRight, Clock, Shield, Star } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: 'student' | 'shopkeeper') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BiteXpress</h1>
                <p className="text-sm text-gray-600">Thapar University</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Campus Food Ordering
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600"> Made Easy</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Skip the lines, order ahead, and enjoy your favorite campus food.
            Connect students with local vendors for a seamless dining experience.
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Card */}
          <div 
            onClick={() => onRoleSelect('student')}
            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-orange-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Student</h3>
              <p className="text-gray-600 mb-6">
                Browse campus vendors, place orders, and track your food delivery in real-time.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Skip waiting in lines</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>Secure Thapar email verification</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span>Rate and review vendors</span>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Shopkeeper Card */}
          <div 
            onClick={() => onRoleSelect('shopkeeper')}
            className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Vendor</h3>
              <p className="text-gray-600 mb-6">
                List your food items, manage orders, and grow your campus business digitally.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Store className="w-4 h-4 text-blue-500" />
                  <span>Manage your digital menu</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Real-time order notifications</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Reach more students</span>
                </div>
              </div>
              
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 mx-auto group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose BiteXpress?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast & Convenient</h4>
              <p className="text-gray-600">Order in advance and skip the waiting lines during peak hours.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure & Verified</h4>
              <p className="text-gray-600">Only verified Thapar students and approved vendors on the platform.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-gray-600">Built by students, for students. Supporting our campus community.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">BiteXpress</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Connecting Thapar University students with campus vendors
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-8">
              <a href="#" className="hover:text-gray-700 transition-colors duration-200">About Us</a>
              <a href="#" className="hover:text-gray-700 transition-colors duration-200">Contact</a>
              <a href="#" className="hover:text-gray-700 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors duration-200">Terms of Service</a>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 BiteXpress. Made with ❤️ for Thapar University
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;