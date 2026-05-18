import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type ThemePreference } from '../context/ThemeContext';

type Props = {
  variant?: 'compact' | 'settings';
};

const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

export default function ThemeToggle({ variant = 'compact' }: Props) {
  const { theme, setTheme } = useTheme();

  if (variant === 'settings') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
              theme === value
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-inner'
                : 'bg-app-surface-solid text-app-muted border-app-border hover:border-app-border-subtle hover:text-app-heading'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-sm font-bold">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  const cycle = () => {
    const order: ThemePreference[] = ['light', 'dark', 'system'];
    const i = order.indexOf(theme);
    setTheme(order[(i + 1) % order.length]);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={cycle}
      title={`Theme: ${theme}`}
      className="p-2 rounded-xl bg-app-surface-solid border border-app-border text-app-muted hover:text-app-heading hover:border-app-border-subtle transition-colors"
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
