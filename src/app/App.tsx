import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './core/stores/auth';
import { ThemeProvider } from './core/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}