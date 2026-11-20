import {
  AlertCircle,
  ArrowDownUp,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {DurationTieBreaker, TaskItem} from '../types/todo';
import {
  formatDateKorean,
  formatDuration,
  getDaysRemaining,
  getUrgencyMeta,
} from '../utils/priorityEngine';

interface FocusSidebarProps {
  topTask: TaskItem | null;
  stats: {
    activeCount: number;
    criticalCount: number;
    warningCount: number;
    averageProgress: number;
  };
  durationTieBreaker: DurationTieBreaker;
  onChangeTieBreaker: (mode: DurationTieBreaker) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleComplete: (id: string) => void;
  onResetSampleData: () => void;
}

export function FocusSidebar({
  topTask,
  stats,
  durationTieBreaker,
  onChangeTieBreaker,
  onUpdateProgress,
  onToggleComplete,
  onResetSampleData,
}: FocusSidebarProps) {
  const topDays = topTask ? getDaysRemaining(topTask.dueDate) : 0;
  const topMeta = topTask ? getUrgencyMeta(topDays) : null;

  return (
    <aside className="space-y-6">
      {/* 1. Top Priority Spotlight */}
      <section className="bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[var(--color-text-main,#22252A)] tracking-tight">
            지금 가장 먼저 할 일
          </h2>
          {topTask && topMeta && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-mono font-semibold tabular-nums ${
                topMeta.level === 'critical'
                  ? 'text-[var(--color-accent-red,#E04836)]'
                  : topMeta.level === 'warning'
                    ? 'text-[var(--color-accent-orange,#F27D31)]'
                    : 'text-[var(--color-text-muted,#7A8291)]'
              }`}
            >
              {topMeta.level === 'critical' && (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              {topMeta.level === 'warning' && (
                <Clock className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>
                {topMeta.dDayLabel} · {topMeta.statusLabel}
              </span>
            </span>
          )}
        </div>

        {topTask ? (
          <div className="mt-4">
            <p className="text-base font-bold text-[var(--color-text-main,#22252A)] leading-snug break-keep">
              {topTask.title}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-muted,#7A8291)] tabular-nums">
              중요도 {topTask.importance}/5점 · 예상{' '}
              {formatDuration(topTask.estimatedMinutes)} ·{' '}
              {formatDateKorean(topTask.dueDate)} 마감
            </p>

            {/* Quick Progress Control */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border,#E2E7F0)]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[var(--color-text-muted,#7A8291)]">
                  진행률
                </span>
                <span className="font-mono font-semibold tabular-nums text-[var(--color-text-main,#22252A)]">
                  {topTask.progress}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={topTask.progress}
                aria-label="최우선 업무 진척도 조절"
                onChange={(e) =>
                  onUpdateProgress(topTask.id, Number(e.target.value))
                }
                style={{
                  background: `linear-gradient(to right, var(--color-primary,#3B66C4) ${topTask.progress}%, var(--color-border,#E2E7F0) ${topTask.progress}%)`,
                }}
                className="w-full h-1.5 rounded-full focusdo-slider"
              />

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateProgress(
                      topTask.id,
                      Math.min(100, topTask.progress + 25),
                    )
                  }
                  disabled={topTask.progress >= 100}
                  className="flex-1 min-h-[42px] px-3 py-2 rounded-xl border border-[var(--color-border,#E2E7F0)] text-xs font-semibold text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-tint-blue,#EBF1FC)] hover:text-[var(--color-primary-dark,#254696)] disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
                >
                  +25% 진행
                </button>
                <button
                  type="button"
                  onClick={() => onToggleComplete(topTask.id)}
                  className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-[var(--color-primary,#3B66C4)] hover:bg-[var(--color-primary-dark,#254696)] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
                >
                  업무 완료
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 py-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[var(--color-text-main,#22252A)]">
              남은 업무를 모두 마쳤습니다
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted,#7A8291)]">
              새 할 일을 등록하면 우선순위에 따라 자동 배치됩니다.
            </p>
          </div>
        )}
      </section>

      {/* 2. Summary Metrics */}
      <section className="bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-2xl p-5 sm:p-6 shadow-xs">
        <h2 className="text-sm font-bold text-[var(--color-text-main,#22252A)] tracking-tight mb-4">
          오늘의 업무 현황
        </h2>
        <div className="grid grid-cols-3 divide-x divide-[var(--color-border,#E2E7F0)]">
          <div className="pr-3">
            <div className="text-xs text-[var(--color-text-muted,#7A8291)]">남은 업무</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-[var(--color-text-main,#22252A)]">
              {stats.activeCount}
            </div>
          </div>
          <div className="px-3">
            <div className="text-xs text-[var(--color-text-muted,#7A8291)]">긴급 · 임박</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-[var(--color-accent-red,#E04836)]">
              {stats.criticalCount + stats.warningCount}
            </div>
          </div>
          <div className="pl-3">
            <div className="text-xs text-[var(--color-text-muted,#7A8291)]">평균 진척</div>
            <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-[var(--color-text-main,#22252A)]">
              {stats.averageProgress}%
            </div>
          </div>
        </div>
      </section>

      {/* 3. Priority Engine Rules & Tie-Breaker */}
      <section className="bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-bold text-[var(--color-text-main,#22252A)] tracking-tight">
            자동 우선순위 기준
          </h2>
          <ArrowDownUp className="w-4 h-4 text-[var(--color-text-muted,#7A8291)] shrink-0" />
        </div>

        <ol className="space-y-2.5 text-xs text-[var(--color-text-muted,#7A8291)]">
          <li className="flex items-baseline gap-2.5">
            <span className="font-mono font-semibold text-[var(--color-primary,#3B66C4)] shrink-0">
              1순위
            </span>
            <span className="text-[var(--color-text-main,#22252A)]">중요도 점수가 높은 업무 우선</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span className="font-mono font-semibold text-[var(--color-primary,#3B66C4)] shrink-0">
              2순위
            </span>
            <span className="text-[var(--color-text-main,#22252A)]">D-Day 기준 마감이 가까운 업무 우선</span>
          </li>
          <li className="flex items-baseline gap-2.5">
            <span className="font-mono font-semibold text-[var(--color-primary,#3B66C4)] shrink-0">
              3순위
            </span>
            <span className="text-[var(--color-text-main,#22252A)]">동일 조건 시 예상 소요 시간 기준 정렬</span>
          </li>
        </ol>

        <div className="mt-4 pt-4 border-t border-[var(--color-border,#E2E7F0)]">
          <div className="text-xs font-medium text-[var(--color-text-muted,#7A8291)] mb-2">
            3순위 소요 시간 정렬 방식
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--color-bg-page,#F5F7FA)] border border-[var(--color-border,#E2E7F0)] rounded-xl">
            <button
              type="button"
              onClick={() => onChangeTieBreaker('shortest')}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                durationTieBreaker === 'shortest'
                  ? 'bg-[var(--color-bg-surface,#FFFFFF)] text-[var(--color-primary,#3B66C4)] shadow-xs font-semibold'
                  : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]'
              }`}
            >
              짧은 업무 먼저
            </button>
            <button
              type="button"
              onClick={() => onChangeTieBreaker('longest')}
              className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                durationTieBreaker === 'longest'
                  ? 'bg-[var(--color-bg-surface,#FFFFFF)] text-[var(--color-primary,#3B66C4)] shadow-xs font-semibold'
                  : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]'
              }`}
            >
              긴 업무 먼저
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--color-border,#E2E7F0)] flex justify-end">
          <button
            type="button"
            onClick={onResetSampleData}
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-primary,#3B66C4)] hover:bg-[var(--color-tint-blue,#EBF1FC)]/50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>예시 일정 불러오기</span>
          </button>
        </div>
      </section>
    </aside>
  );
}
