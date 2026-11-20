import React, {useEffect, useRef, useState} from 'react';
import {X} from 'lucide-react';
import {ImportanceScore, TaskFormValues, TaskItem} from '../types/todo';
import {
  addDaysToDate,
  formatDDay,
  getDaysRemaining,
  getLocalTodayString,
} from '../utils/priorityEngine';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues, editTaskId?: string) => void;
  initialTask?: TaskItem | null;
}

const IMPORTANCE_OPTIONS: {score: ImportanceScore; label: string}[] = [
  {score: 5, label: '5 최우선'},
  {score: 4, label: '4 높음'},
  {score: 3, label: '3 보통'},
  {score: 2, label: '2 낮음'},
  {score: 1, label: '1 여유'},
];

const DURATION_OPTIONS: {minutes: number; label: string}[] = [
  {minutes: 15, label: '15분'},
  {minutes: 30, label: '30분'},
  {minutes: 45, label: '45분'},
  {minutes: 60, label: '1시간'},
  {minutes: 120, label: '2시간'},
];

export function QuickAddModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: QuickAddModalProps) {
  const today = getLocalTodayString();
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [importance, setImportance] = useState<ImportanceScore>(4);
  const [dueDate, setDueDate] = useState<string>(today);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialTask) {
      setTitle(initialTask.title);
      setImportance(initialTask.importance);
      setDueDate(initialTask.dueDate);
      setEstimatedMinutes(initialTask.estimatedMinutes);
      setProgress(initialTask.progress);
    } else {
      setTitle('');
      setImportance(4);
      setDueDate(today);
      setEstimatedMinutes(30);
      setProgress(0);
    }
    setErrorMsg('');

    const timer = window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(timer);
  }, [isOpen, initialTask, today]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickDates = [
    {label: '오늘 (D-Day)', value: today},
    {label: '내일 (D-1)', value: addDaysToDate(today, 1)},
    {label: '3일 후 (D-3)', value: addDaysToDate(today, 3)},
    {label: '다음 주 (D-7)', value: addDaysToDate(today, 7)},
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setErrorMsg('할 일 제목을 입력해 주세요.');
      titleInputRef.current?.focus();
      return;
    }

    onSubmit(
      {
        title: trimmed,
        importance,
        dueDate: dueDate || today,
        estimatedMinutes: Math.max(5, estimatedMinutes),
        progress,
      },
      initialTask?.id,
    );
    onClose();
  };

  const daysRemaining = getDaysRemaining(dueDate || today, today);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[var(--color-bg-surface,#FFFFFF)] rounded-t-3xl sm:rounded-2xl border border-[var(--color-border,#E2E7F0)] shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile sheet drag handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1.5 bg-[var(--color-border,#E2E7F0)] rounded-full" />
        </div>

        <div className="px-5 sm:px-6 pt-3 sm:pt-5 pb-4 border-b border-[var(--color-border,#E2E7F0)] flex items-center justify-between gap-4">
          <h2
            id="quick-add-modal-title"
            className="text-lg font-bold text-[var(--color-text-main,#22252A)] tracking-tight"
          >
            {initialTask ? '할 일 수정' : '새 할 일 등록'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-xl text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-tint-blue,#EBF1FC)]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 sm:px-6 py-5 space-y-5 overflow-y-auto"
        >
          {/* Step 1: Task Title */}
          <div>
            <label
              htmlFor="task-title-input"
              className="block text-sm font-semibold text-[var(--color-text-main,#22252A)] mb-2"
            >
              할 일 제목
            </label>
            <input
              ref={titleInputRef}
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="예: 주간 팀 미팅 발표 자료 최종 검수"
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm text-[var(--color-text-main,#22252A)] placeholder:text-[var(--color-text-muted,#7A8291)] bg-[var(--color-bg-page,#F5F7FA)] border border-[var(--color-border,#E2E7F0)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#3B66C4)] focus:border-transparent transition-all"
            />
            {errorMsg && (
              <p className="mt-1.5 text-xs font-medium text-[var(--color-accent-red,#E04836)]">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Step 2: 1순위 중요도 점수 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--color-text-main,#22252A)]">
                중요도 (정렬 1순위)
              </span>
              <span className="text-xs font-mono tabular-nums text-[var(--color-text-muted,#7A8291)]">
                {importance} / 5점
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-[var(--color-bg-page,#F5F7FA)] border border-[var(--color-border,#E2E7F0)] rounded-xl">
              {IMPORTANCE_OPTIONS.map((opt) => {
                const selected = importance === opt.score;
                return (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() => setImportance(opt.score)}
                    className={`min-h-[42px] px-1.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                      selected
                        ? 'bg-[var(--color-primary,#3B66C4)] text-white shadow-xs'
                        : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: 2순위 마감일 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--color-text-main,#22252A)]">
                마감일 (정렬 2순위)
              </span>
              <span className="text-xs font-mono tabular-nums font-semibold text-[var(--color-primary,#3B66C4)]">
                {formatDDay(daysRemaining)}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5">
              {quickDates.map((qd) => {
                const selected = dueDate === qd.value;
                return (
                  <button
                    key={qd.value}
                    type="button"
                    onClick={() => setDueDate(qd.value)}
                    className={`min-h-[42px] px-2.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                      selected
                        ? 'bg-[var(--color-tint-blue,#EBF1FC)] border-[var(--color-primary,#3B66C4)] text-[var(--color-primary-dark,#254696)] font-semibold'
                        : 'bg-white border-[var(--color-border,#E2E7F0)] text-[var(--color-text-main,#22252A)] hover:border-[var(--color-primary-light,#5B82D6)]'
                    }`}
                  >
                    {qd.label}
                  </button>
                );
              })}
            </div>
            <input
              type="date"
              aria-label="직접 날짜 선택"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums text-[var(--color-text-main,#22252A)] bg-[var(--color-bg-page,#F5F7FA)] border border-[var(--color-border,#E2E7F0)] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#3B66C4)]"
            />
          </div>

          {/* Step 4: 3순위 예상 소요 시간 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[var(--color-text-main,#22252A)]">
                예상 소요 시간 (정렬 3순위)
              </span>
              <span className="text-xs font-mono tabular-nums text-[var(--color-text-muted,#7A8291)]">
                {estimatedMinutes}분
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {DURATION_OPTIONS.map((opt) => {
                const selected = estimatedMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    type="button"
                    onClick={() => setEstimatedMinutes(opt.minutes)}
                    className={`min-h-[42px] px-2 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                      selected
                        ? 'bg-[var(--color-primary,#3B66C4)] border-[var(--color-primary,#3B66C4)] text-white font-semibold'
                        : 'bg-white border-[var(--color-border,#E2E7F0)] text-[var(--color-text-main,#22252A)] hover:border-[var(--color-primary-light,#5B82D6)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress editor when editing existing task */}
          {initialTask && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="modal-progress-range"
                  className="text-sm font-semibold text-[var(--color-text-main,#22252A)]"
                >
                  업무 완성도
                </label>
                <span className="text-xs font-mono tabular-nums font-semibold text-[var(--color-text-main,#22252A)]">
                  {progress}%
                </span>
              </div>
              <input
                id="modal-progress-range"
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, var(--color-primary,#3B66C4) ${progress}%, var(--color-border,#E2E7F0) ${progress}%)`,
                }}
                className="w-full h-1.5 rounded-full focusdo-slider"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[var(--color-border,#E2E7F0)]">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[var(--color-border,#E2E7F0)] text-sm font-medium text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-bg-page,#F5F7FA)] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
            >
              취소
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[var(--color-primary,#3B66C4)] hover:bg-[var(--color-primary-dark,#254696)] active:scale-[0.98] text-white text-sm font-semibold shadow-xs transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] focus-visible:ring-offset-2"
            >
              {initialTask ? '저장' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
