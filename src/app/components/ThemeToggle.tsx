import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../core/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-200 hover:bg-white/10 light:hover:bg-slate-200 transition-all flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
      ) : (
        <Sun className="w-5 h-5 text-blue-200 group-hover:text-blue-100" />
      )}
    </button>
  );
}
