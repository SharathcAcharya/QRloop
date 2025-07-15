import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingScreen from './LoadingScreen';

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    // Redirect non-admin users to home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
