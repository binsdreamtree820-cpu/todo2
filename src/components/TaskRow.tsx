import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import {motion} from 'motion/react';
import {useState} from 'react';
import {TaskItem} from '../types/todo';
import {
  formatDateKorean,
  formatDuration,
  getDaysRemaining,
  getUrgencyMeta,
} from '../utils/priorityEngine';

interface TaskRowProps {
  task: TaskItem;
  rank: number | null;
  onToggleComplete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
}

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export function TaskRow({
  task,
  rank,
  onToggleComplete,
  onUpdateProgress,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const daysRemaining = getDaysRemaining(task.dueDate);
  const {level, dDayLabel, statusLabel} = getUrgencyMeta(daysRemaining);

  const urgencyTextClass = task.completed
    ? 'text-[var(--color-text-muted,#7A8291)]'
    : level === 'critical'
      ? 'text-[var(--color-accent-red,#E04836)] font-semibold'
      : level === 'warning'
        ? 'text-[var(--color-accent-orange,#F27D31)] font-semibold'
        : 'text-[var(--color-text-muted,#7A8291)] font-medium';

  const progressBarColor = task.completed
    ? 'bg-emerald-600'
    : level === 'critical'
      ? 'bg-[var(--color-accent-red,#E04836)]'
      : level === 'warning'
        ? 'bg-[var(--color-accent-orange,#F27D31)]'
        : 'bg-[var(--color-primary,#3B66C4)]';

  const sliderTrackHex = task.completed
    ? '#059669'
    : level === 'critical'
      ? '#E04836'
      : level === 'warning'
        ? '#F27D31'
        : '#3B66C4';

  const cardSurfaceClass = task.completed
    ? 'bg-[var(--color-bg-page,#F5F7FA)]/80 border-[var(--color-border,#E2E7F0)]'
    : level === 'critical'
      ? 'bg-[var(--color-bg-surface,#FFFFFF)] border-[var(--color-accent-red,#E04836)]/35 hover:border-[var(--color-accent-red,#E04836)]/70 shadow-xs'
      : level === 'warning'
        ? 'bg-[var(--color-bg-surface,#FFFFFF)] border-[var(--color-accent-orange,#F27D31)]/35 hover:border-[var(--color-accent-orange,#F27D31)]/70 shadow-xs'
        : 'bg-[var(--color-bg-surface,#FFFFFF)] border-[var(--color-border,#E2E7F0)] hover:border-[var(--color-primary-light,#5B82D6)]/70 shadow-xs';

  return (
    <motion.article
      layout
      initial={{opacity: 0, y: 6}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, scale: 0.98}}
      transition={{duration: 0.18, ease: [0.16, 1, 0.3, 1]}}
      className={`rounded-2xl border transition-all ${cardSurfaceClass}`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
        {/* 44x44px hit target check button */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={
            task.completed
              ? `${task.title} 미완료로 되돌리기`
              : `${task.title} 완료 처리`
          }
          className="min-h-[44px] min-w-[44px] -m-1.5 flex items-center justify-center rounded-xl hover:bg-[var(--color-tint-blue,#EBF1FC)]/60 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
        >
          <span
            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : level === 'critical'
                  ? 'border-[var(--color-accent-red,#E04836)] bg-red-50/50 hover:border-[var(--color-accent-red,#E04836)]'
                  : level === 'warning'
                    ? 'border-[var(--color-accent-orange,#F27D31)] bg-orange-50/40 hover:border-[var(--color-accent-orange,#F27D31)]'
                    : 'border-[var(--color-border,#E2E7F0)] bg-white hover:border-[var(--color-primary,#3B66C4)]'
            }`}
          >
            {task.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
          </span>
        </button>

        {/* Main task content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1.5">
            <div className="flex items-baseline gap-2.5 min-w-0 flex-1">
              {rank !== null && !task.completed && (
                <span className="font-mono text-xs font-semibold tabular-nums text-[var(--color-text-muted,#7A8291)] shrink-0">
                  {String(rank).padStart(2, '0')}
                </span>
              )}
              <h3
                className={`text-[15px] sm:text-base font-semibold leading-snug break-keep ${
                  task.completed
                    ? 'line-through text-[var(--color-text-muted,#7A8291)] font-medium'
                    : 'text-[var(--color-text-main,#22252A)]'
                }`}
              >
                {task.title}
              </h3>
            </div>

            {/* Semantic D-Day & Urgency label (not hue-only, zero pill) */}
            <div
              className={`inline-flex items-center gap-1.5 text-xs tabular-nums shrink-0 ${urgencyTextClass}`}
            >
              {!task.completed && level === 'critical' && (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              {!task.completed && level === 'warning' && (
                <Clock className="w-3.5 h-3.5 shrink-0" />
              )}
              {!task.completed && level === 'normal' && (
                <Calendar className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-muted,#7A8291)]" />
              )}
              <span className="font-mono">{dDayLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{task.completed ? '완료' : statusLabel}</span>
            </div>
          </div>

          {/* Unboxed clean metadata line */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-text-muted,#7A8291)] tabular-nums">
            <span>중요도 {task.importance}/5점</span>
            <span aria-hidden="true">·</span>
            <span>예상 {formatDuration(task.estimatedMinutes)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDateKorean(task.dueDate)} 마감</span>
          </div>

          {/* Progress Bar + Interactive Expand Trigger */}
          <div className="mt-3.5 flex items-center gap-3">
            <div
              className="flex-1 h-2 bg-[var(--color-border,#E2E7F0)]/60 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={task.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${task.title} 진척도`}
            >
              <div
                className={`h-full rounded-full transition-all duration-200 ${progressBarColor}`}
                style={{width: `${task.progress}%`}}
              />
            </div>

            <span className="font-mono text-xs font-semibold tabular-nums text-[var(--color-text-main,#22252A)] w-9 text-right shrink-0">
              {task.progress}%
            </span>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label="진척도 조절 및 작업 옵션 열기"
              className="min-h-[36px] px-2.5 py-1.5 -my-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-tint-blue,#EBF1FC)] inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
            >
              <span>조절</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Inline Progress Scrubber & Actions Drawer */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-[var(--color-border,#E2E7F0)] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-semibold text-[var(--color-text-main,#22252A)] shrink-0">
                  완성도 업데이트
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={task.progress}
                  aria-label={`${task.title} 진척도 슬라이더`}
                  onChange={(e) =>
                    onUpdateProgress(task.id, Number(e.target.value))
                  }
                  style={{
                    background: `linear-gradient(to right, ${sliderTrackHex} ${task.progress}%, var(--color-border,#E2E7F0) ${task.progress}%)`,
                  }}
                  className="flex-1 h-1.5 rounded-full focusdo-slider"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {PROGRESS_STEPS.map((step) => {
                    const active = task.progress === step;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => onUpdateProgress(task.id, step)}
                        className={`min-h-[38px] px-2.5 py-1.5 rounded-lg font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                          active
                            ? 'bg-[var(--color-primary,#3B66C4)] text-white font-semibold'
                            : 'bg-[var(--color-tint-blue,#EBF1FC)] text-[var(--color-primary-dark,#254696)] hover:bg-blue-100'
                        }`}
                      >
                        {step}%
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(task)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-tint-blue,#EBF1FC)] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>수정</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(task.id)}
                    className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-accent-red,#E04836)] hover:bg-red-50 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-red,#E04836)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
