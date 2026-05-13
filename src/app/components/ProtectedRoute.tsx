import { Navigate } from 'react-router';
import { useAuth } from '../core/stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('CLIENT' | 'EXPERT' | 'ADMIN')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // On attend que l'utilisateur soit chargé (si persistance via localStorage)
  // Note: Dans ce store, l'effet de chargement est synchrone au premier render car on lit localStorage dans l'état initial (partiellement)
  // mais setUser est dans un useEffect.
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si on a un utilisateur, on vérifie ses rôles
  const userRole = user?.role?.toUpperCase();
  
  if (allowedRoles && userRole && !allowedRoles.includes(userRole as any)) {
    // Redirection vers le dashboard approprié si le rôle n'est pas permis
    if (userRole === 'CLIENT') return <Navigate to="/client" replace />;
    if (userRole === 'EXPERT') return <Navigate to="/expert" replace />;
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // Cas particulier : si l'utilisateur n'a pas de rôle valide
  if (allowedRoles && !userRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
