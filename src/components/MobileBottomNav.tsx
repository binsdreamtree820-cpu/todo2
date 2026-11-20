import {CheckSquare, Layers, MessageSquare, Target} from 'lucide-react';
import {NavTab} from '../types/todo';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  counts: {
    today: number;
    all: number;
    completed: number;
  };
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  counts,
}: MobileBottomNavProps) {
  const items: {
    id: NavTab;
    label: string;
    count?: number;
    icon: typeof Target;
  }[] = [
    {id: 'today', label: '오늘 집중', count: counts.today, icon: Target},
    {id: 'board', label: '메시지 보드', icon: MessageSquare},
    {id: 'all', label: '전체 일정', count: counts.all, icon: Layers},
    {
      id: 'completed',
      label: '완료 기록',
      count: counts.completed,
      icon: CheckSquare,
    },
  ];

  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[var(--color-bg-surface,#FFFFFF)]/95 backdrop-blur-md border-t border-[var(--color-border,#E2E7F0)] grid grid-cols-4 transition-colors"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-primary,#3B66C4)] ${
              active
                ? 'text-[var(--color-primary,#3B66C4)]'
                : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'stroke-[2.5]' : ''}`} />
            <span
              className={`text-[10px] tracking-tight whitespace-nowrap ${
                active ? 'font-semibold' : 'font-medium'
              }`}
            >
              {item.label}
              {item.count !== undefined && (
                <span className="font-mono tabular-nums opacity-80 ml-0.5">
                  {item.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
