import {AnimatePresence} from 'motion/react';
import {CheckCircle2, ChevronRight, Plus, Search, X} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {DeadlineMessageBoard} from './components/DeadlineMessageBoard';
import {DogAvatar} from './components/DogAvatar';
import {FocusSidebar} from './components/FocusSidebar';
import {MobileBottomNav} from './components/MobileBottomNav';
import {QuickAddModal} from './components/QuickAddModal';
import {TaskRow} from './components/TaskRow';
import {TopBar} from './components/TopBar';
import {createInitialTasks} from './data/initialTasks';
import {
  DurationTieBreaker,
  NavTab,
  TaskFormValues,
  TaskItem,
  UrgencyFilter,
} from './types/todo';
import {
  formatDDay,
  formatDateKorean,
  getCharacterMood,
  getDaysRemaining,
  getLocalTodayString,
  getUrgencyLevel,
  isTodayFocusTask,
  sortTasksByPriority,
} from './utils/priorityEngine';

const STORAGE_KEY = 'focusdo_tasks_v1';
const TIE_BREAKER_KEY = 'focusdo_tie_breaker_v1';

function loadInitialTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TaskItem[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial grounded sample data if storage is unavailable
  }
  return createInitialTasks();
}

function loadTieBreaker(): DurationTieBreaker {
  try {
    const raw = localStorage.getItem(TIE_BREAKER_KEY);
    if (raw === 'shortest' || raw === 'longest') {
      return raw;
    }
  } catch {
    // Ignore storage read errors
  }
  return 'shortest';
}

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>(loadInitialTasks);
  const [durationTieBreaker, setDurationTieBreaker] =
    useState<DurationTieBreaker>(loadTieBreaker);
  const [activeTab, setActiveTab] = useState<NavTab>('today');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignore quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(TIE_BREAKER_KEY, durationTieBreaker);
    } catch {
      // Ignore storage errors
    }
  }, [durationTieBreaker]);

  const today = getLocalTodayString();

  // Always maintain live multi-criteria priority sort (< 1ms)
  const sortedTasks = useMemo(
    () => sortTasksByPriority(tasks, durationTieBreaker, today),
    [tasks, durationTieBreaker, today],
  );

  const activeTasks = useMemo(
    () => sortedTasks.filter((t) => !t.completed),
    [sortedTasks],
  );

  const todayFocusTasks = useMemo(
    () => activeTasks.filter((t) => isTodayFocusTask(t, today)),
    [activeTasks, today],
  );

  const completedTasks = useMemo(
    () => sortedTasks.filter((t) => t.completed),
    [sortedTasks],
  );

  // Rank map across all active tasks so priority order is crystal clear
  const activeRankMap = useMemo(() => {
    const map = new Map<string, number>();
    activeTasks.forEach((t, idx) => map.set(t.id, idx + 1));
    return map;
  }, [activeTasks]);

  const stats = useMemo(() => {
    let criticalCount = 0;
    let warningCount = 0;
    let totalProgress = 0;

    for (const task of activeTasks) {
      const level = getUrgencyLevel(getDaysRemaining(task.dueDate, today));
      if (level === 'critical') criticalCount += 1;
      else if (level === 'warning') warningCount += 1;
      totalProgress += task.progress;
    }

    const averageProgress =
      activeTasks.length > 0
        ? Math.round(totalProgress / activeTasks.length)
        : tasks.length > 0
          ? 100
          : 0;

    return {
      activeCount: activeTasks.length,
      criticalCount,
      warningCount,
      averageProgress,
    };
  }, [activeTasks, tasks.length, today]);

  const displayedTasks = useMemo(() => {
    const base =
      activeTab === 'today'
        ? todayFocusTasks
        : activeTab === 'all'
          ? activeTasks
          : completedTasks;

    const query = searchQuery.trim().toLowerCase();

    return base.filter((task) => {
      if (activeTab !== 'completed' && urgencyFilter !== 'all') {
        const level = getUrgencyLevel(getDaysRemaining(task.dueDate, today));
        if (level !== urgencyFilter) return false;
      }
      if (query && !task.title.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  }, [
    activeTab,
    todayFocusTasks,
    activeTasks,
    completedTasks,
    urgencyFilter,
    searchQuery,
    today,
  ]);

  const topTask = activeTasks[0] ?? null;
  const topTaskMood = topTask
    ? getCharacterMood(getDaysRemaining(topTask.dueDate, today))
    : null;

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (values: TaskFormValues, editTaskId?: string) => {
    if (editTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editTaskId
            ? {
                ...t,
                title: values.title,
                importance: values.importance,
                dueDate: values.dueDate,
                estimatedMinutes: values.estimatedMinutes,
                progress: values.progress,
              }
            : t,
        ),
      );
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: values.title,
      importance: values.importance,
      dueDate: values.dueDate,
      estimatedMinutes: values.estimatedMinutes,
      progress: values.progress,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);

    // If user adds a task while viewing completed tab, return to relevant active view
    if (activeTab === 'completed') {
      setActiveTab('today');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          progress: nextCompleted ? 100 : t.progress === 100 ? 75 : t.progress,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }),
    );
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? {...t, progress: clamped} : t)),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleResetSampleData = () => {
    setTasks(createInitialTasks());
    setUrgencyFilter('all');
    setSearchQuery('');
  };

  const tabTitle =
    activeTab === 'today'
      ? '오늘 집중할 업무'
      : activeTab === 'board'
        ? '마감 현황 메시지 보드'
        : activeTab === 'all'
          ? '전체 진행 업무'
          : '완료한 업무 기록';

  const tabDescription =
    activeTab === 'today'
      ? '중요도 · 마감일 D-Day · 예상 소요 시간 기준으로 자동 정렬됩니다.'
      : activeTab === 'board'
        ? '마감일 D-Day가 다가올수록 강아지 표정이 험악해지는 메시지 보드입니다.'
        : activeTab === 'all'
          ? '등록된 모든 미완료 업무를 우선순위 순으로 확인합니다.'
          : '처리 완료된 업무 내역입니다. 필요 시 다시 활성화할 수 있습니다.';

  return (
    <div className="min-h-screen bg-[var(--color-bg-page,#F5F7FA)] text-[var(--color-text-main,#22252A)] pb-20 md:pb-12 transition-colors">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAddModal={handleOpenCreate}
        counts={{
          today: todayFocusTasks.length,
          all: activeTasks.length,
          completed: completedTasks.length,
        }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 text-[var(--color-text-main,#22252A)]">
        {/* Render Dedicated Deadline Message Board View */}
        {activeTab === 'board' ? (
          <DeadlineMessageBoard
            tasks={sortedTasks}
            onToggleComplete={handleToggleComplete}
            onOpenTaskDetails={handleOpenEdit}
            onOpenAddModal={handleOpenCreate}
          />
        ) : (
          <>
            {/* Mobile Compact Summary Strip (< lg) */}
            <section
              aria-label="오늘 업무 요약"
              className="lg:hidden mb-5 bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-2xl p-4 grid grid-cols-3 divide-x divide-[var(--color-border,#E2E7F0)] shadow-xs"
            >
              <div className="pr-3">
                <div className="text-[11px] text-[var(--color-text-muted,#7A8291)]">남은 업무</div>
                <div className="mt-0.5 text-xl font-bold font-mono tabular-nums text-[var(--color-text-main,#22252A)]">
                  {stats.activeCount}
                </div>
              </div>
              <div className="px-3">
                <div className="text-[11px] text-[var(--color-accent-red,#E04836)]">긴급 · 임박</div>
                <div className="mt-0.5 text-xl font-bold font-mono tabular-nums text-[var(--color-accent-red,#E04836)]">
                  {stats.criticalCount + stats.warningCount}
                </div>
              </div>
              <div className="pl-3">
                <div className="text-[11px] text-[var(--color-text-muted,#7A8291)]">평균 진척</div>
                <div className="mt-0.5 text-xl font-bold font-mono tabular-nums text-[var(--color-text-main,#22252A)]">
                  {stats.averageProgress}%
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Primary Column: Today View & Priority Task List */}
              <section className="lg:col-span-8 space-y-5">
                {/* Page Heading */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-[var(--color-text-muted,#7A8291)] tabular-nums">
                      {formatDateKorean(today)}
                    </p>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-main,#22252A)] [text-wrap:balance]">
                      {tabTitle}
                    </h1>
                    <p className="mt-1.5 text-sm text-[var(--color-text-muted,#7A8291)]">
                      {tabDescription}
                    </p>
                  </div>

                  {activeTab === 'completed' && completedTasks.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCompleted}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[var(--color-border,#E2E7F0)] bg-[var(--color-bg-surface,#FFFFFF)] hover:bg-[var(--color-tint-blue,#EBF1FC)] text-xs font-medium text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-accent-red,#E04836)] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
                    >
                      완료 기록 비우기
                    </button>
                  )}
                </div>

                {/* Character Advice Banner on Today Tab */}
                {activeTab === 'today' && topTask && topTaskMood && (
                  <div
                    onClick={() => setActiveTab('board')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setActiveTab('board');
                    }}
                    className="cursor-pointer p-4 rounded-2xl bg-[var(--color-bg-surface,#FFFFFF)] border-2 border-[#1E1E1E] shadow-[3px_3px_0px_#1E1E1E] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1E1E1E] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <DogAvatar stage={topTaskMood.stage} size={48} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${topTaskMood.badgeBg}`}
                          >
                            {topTaskMood.stageName}
                          </span>
                          <span className="text-[11px] font-mono text-[var(--color-text-muted,#7A8291)]">
                            최우선 마감: {formatDDay(getDaysRemaining(topTask.dueDate, today))}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#1E1E1E] truncate mt-0.5">
                          &ldquo;{topTaskMood.defaultMessage}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary,#3B66C4)] shrink-0 group-hover:translate-x-1 transition-transform">
                      <span className="hidden sm:inline">표정 메시지 보드</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                )}

                {/* Filter & Search Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {activeTab !== 'completed' ? (
                    <div
                      role="tablist"
                      aria-label="마감 시급성 필터"
                      className="inline-flex items-center gap-1 p-1 bg-[var(--color-border,#E2E7F0)]/60 border border-[var(--color-border,#E2E7F0)] rounded-xl overflow-x-auto max-w-full"
                    >
                      {(
                        [
                          {id: 'all', label: '전체'},
                          {id: 'critical', label: '긴급 · 당일/지연'},
                          {id: 'warning', label: '임박 · 1~2일'},
                          {id: 'normal', label: '여유 · 3일+'},
                        ] as {id: UrgencyFilter; label: string}[]
                      ).map((filterItem) => {
                        const active = urgencyFilter === filterItem.id;
                        return (
                          <button
                            key={filterItem.id}
                            role="tab"
                            aria-selected={active}
                            type="button"
                            onClick={() => setUrgencyFilter(filterItem.id)}
                            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)] ${
                              active
                                ? 'bg-[var(--color-bg-surface,#FFFFFF)] text-[var(--color-primary,#3B66C4)] shadow-xs font-semibold'
                                : 'text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]'
                            }`}
                          >
                            {filterItem.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Search Input */}
                  <div className="relative sm:w-60">
                    <Search className="w-4 h-4 text-[var(--color-text-muted,#7A8291)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="할 일 검색"
                      aria-label="할 일 검색"
                      className="w-full min-h-[40px] pl-9 pr-8 py-2 text-sm text-[var(--color-text-main,#22252A)] placeholder:text-[var(--color-text-muted,#7A8291)] bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary,#3B66C4)] focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="검색어 지우기"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sorted Task List */}
                {displayedTasks.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {displayedTasks.map((task) => (
                        <TaskRow
                          key={task.id}
                          task={task}
                          rank={activeRankMap.get(task.id) ?? null}
                          onToggleComplete={handleToggleComplete}
                          onUpdateProgress={handleUpdateProgress}
                          onEdit={handleOpenEdit}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] rounded-2xl px-6 py-12 text-center shadow-xs">
                    <CheckCircle2 className="w-10 h-10 text-[var(--color-text-muted,#7A8291)]/60 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-[var(--color-text-main,#22252A)]">
                      {searchQuery || urgencyFilter !== 'all'
                        ? '조건에 맞는 할 일이 없습니다'
                        : activeTab === 'completed'
                          ? '아직 완료된 업무가 없습니다'
                          : '등록된 업무가 없습니다'}
                    </h3>
                    <p className="mt-1.5 text-sm text-[var(--color-text-muted,#7A8291)]">
                      {searchQuery || urgencyFilter !== 'all'
                        ? '필터를 초기화하거나 다른 검색어를 입력해 보세요.'
                        : '새 할 일을 추가하면 중요도와 마감일에 따라 자동으로 정렬됩니다.'}
                    </p>
                    <div className="mt-5 flex items-center justify-center gap-2.5">
                      {(searchQuery || urgencyFilter !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setUrgencyFilter('all');
                          }}
                          className="min-h-[42px] px-4 py-2 rounded-xl border border-[var(--color-border,#E2E7F0)] text-sm font-medium text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-text-main,#22252A)] hover:bg-[var(--color-bg-page,#F5F7FA)] transition-colors whitespace-nowrap"
                        >
                          필터 초기화
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleOpenCreate}
                        className="min-h-[42px] px-5 py-2 rounded-xl bg-[var(--color-primary,#3B66C4)] hover:bg-[var(--color-primary-dark,#254696)] text-white text-sm font-medium inline-flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary,#3B66C4)]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>할 일 추가</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Priority Tie-breaker & Sample Reset Footer (< lg) */}
                <div className="lg:hidden pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-text-muted,#7A8291)]">
                  <div className="flex items-center gap-2">
                    <span>3순위 시간 정렬:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDurationTieBreaker((prev) =>
                          prev === 'shortest' ? 'longest' : 'shortest',
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-[var(--color-bg-surface,#FFFFFF)] border border-[var(--color-border,#E2E7F0)] font-medium text-[var(--color-text-main,#22252A)] hover:border-[var(--color-primary,#3B66C4)] transition-colors"
                    >
                      {durationTieBreaker === 'shortest'
                        ? '짧은 업무 먼저'
                        : '긴 업무 먼저'}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetSampleData}
                    className="px-2.5 py-1.5 rounded-lg text-[var(--color-text-muted,#7A8291)] hover:text-[var(--color-primary,#3B66C4)] underline underline-offset-2 transition-colors"
                  >
                    예시 일정 복원
                  </button>
                </div>
              </section>

              {/* Secondary Column: Top Focus & Priority Engine Summary (Desktop lg:) */}
              <div className="hidden lg:block lg:col-span-4 sticky top-20">
                <FocusSidebar
                  topTask={topTask}
                  stats={stats}
                  durationTieBreaker={durationTieBreaker}
                  onChangeTieBreaker={setDurationTieBreaker}
                  onUpdateProgress={handleUpdateProgress}
                  onToggleComplete={handleToggleComplete}
                  onResetSampleData={handleResetSampleData}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          today: todayFocusTasks.length,
          all: activeTasks.length,
          completed: completedTasks.length,
        }}
      />

      <QuickAddModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
      />
    </div>
  );
}
