import {Plus} from 'lucide-react';
import {NavTab} from '../types/todo';

interface TopBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  counts: {
    today: number;
    all: number;
    completed: number;
  };
}

export function TopBar({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  counts,
}: TopBarProps) {
  const navItems: {id: NavTab; label: string; count: number}[] = [
    {id: 'today', label: '오늘 집중', count: counts.today},
    {id: 'all', label: '전체 일정', count: counts.all},
    {id: 'completed', label: '완료 기록', count: counts.completed},
  ];

  return (
    <header className="sticky top-0 z-30 h-14 bg-[var(--color-bg-surface,#FFFFFF)]/95 backdrop-blur-md border-b border-[var(--color-border,#E2E7F0)] transition-colors">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('today')}
          className="text-lg font-bold tracking-tight text-[var(--color-primary,#3B66C4)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] rounded-md px-1 -ml-1 transition-colors"
        >
          FocusDo
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="주요 화면 이동"
          className="hidden md:flex items-center gap-7"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] rounded-md px-1 ${
                  isActive
                    ? 'text-[var(--color-primary,#3B66C4)] font-semibold'
                    : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]'
                }`}
              >
                <span>{item.label}</span>
                <span className="ml-1.5 font-mono text-xs tabular-nums opacity-75">
                  {item.count}
                </span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-[var(--color-primary,#3B66C4)] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-[var(--color-primary,#3B66C4)] hover:bg-[var(--color-primary-dark,#254696)] active:scale-[0.98] text-white text-sm font-medium shadow-xs transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] focus-visible:ring-offset-2"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>할 일 추가</span>
          </button>
        </div>
      </div>
    </header>
  );
}
