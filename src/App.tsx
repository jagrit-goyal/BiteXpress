import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AuthForm from './components/auth/AuthForm';
import StudentDashboard from './components/student/StudentDashboard';
import ShopkeeperDashboard from './components/shopkeeper/ShopkeeperDashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'shopkeeper' | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.userType === 'student') {
      return <StudentDashboard />;
    } else if (user.userType === 'shopkeeper') {
      return <ShopkeeperDashboard />;
    }
  }

  if (selectedRole) {
    return (
      <AuthForm
        userType={selectedRole}
        onBack={() => setSelectedRole(null)}
      />
    );
  }

  return <LandingPage onRoleSelect={setSelectedRole} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;