/** Shared theme-aware Tailwind class groups */
export const themeClasses = {
  pageTitle:
    'text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent',
  pageSubtitle: 'text-app-muted text-xs lg:text-sm font-medium',
  card: 'bg-app-surface backdrop-blur-xl border border-app-border rounded-2xl shadow-xl',
  cardInner: 'bg-app-surface-solid border border-app-border rounded-xl',
  input:
    'w-full px-4 py-3 bg-app-input border border-app-border text-app-heading font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-app-border-subtle transition-colors shadow-inner',
  label: 'block text-[11px] font-black text-app-muted uppercase tracking-widest mb-2',
  tableHead: 'bg-app-surface-solid border-b border-app-border',
  tableRow: 'hover:bg-app-surface-solid transition-colors',
  heading: 'text-app-heading font-bold',
  muted: 'text-app-muted',
};
