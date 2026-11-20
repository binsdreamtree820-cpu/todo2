import {
  DurationTieBreaker,
  ImportanceScore,
  TaskItem,
  UrgencyLevel,
} from '../types/todo';

export function getLocalTodayString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(baseDateStr: string, days: number): string {
  const [y, m, d] = baseDateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return getLocalTodayString(dt);
}

export function getDaysRemaining(
  dueDateStr: string,
  referenceDateStr: string = getLocalTodayString(),
): number {
  const [dy, dm, dd] = dueDateStr.split('-').map(Number);
  const [ry, rm, rd] = referenceDateStr.split('-').map(Number);
  const dueUtc = Date.UTC(dy, dm - 1, dd);
  const refUtc = Date.UTC(ry, rm - 1, rd);
  return Math.round((dueUtc - refUtc) / (1000 * 60 * 60 * 24));
}

export function formatDDay(daysRemaining: number): string {
  if (daysRemaining === 0) return 'D-Day';
  if (daysRemaining > 0) return `D-${daysRemaining}`;
  return `D+${Math.abs(daysRemaining)}`;
}

export function getUrgencyLevel(daysRemaining: number): UrgencyLevel {
  if (daysRemaining <= 0) return 'critical';
  if (daysRemaining <= 2) return 'warning';
  return 'normal';
}

export function getUrgencyMeta(daysRemaining: number): {
  level: UrgencyLevel;
  dDayLabel: string;
  statusLabel: string;
} {
  const level = getUrgencyLevel(daysRemaining);
  const dDayLabel = formatDDay(daysRemaining);

  if (daysRemaining < 0) {
    return {level, dDayLabel, statusLabel: '마감 지연'};
  }
  if (daysRemaining === 0) {
    return {level, dDayLabel, statusLabel: '오늘 마감'};
  }
  if (daysRemaining <= 2) {
    return {level, dDayLabel, statusLabel: '마감 임박'};
  }
  return {level, dDayLabel, statusLabel: '여유'};
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem === 0 ? `${hours}시간` : `${hours}시간 ${rem}분`;
}

export function formatDateKorean(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${weekdays[dt.getDay()]})`;
}

export function getImportanceLabel(score: ImportanceScore): string {
  switch (score) {
    case 5:
      return '최우선 (5점)';
    case 4:
      return '높음 (4점)';
    case 3:
      return '보통 (3점)';
    case 2:
      return '낮음 (2점)';
    case 1:
      return '여유 (1점)';
  }
}

/**
 * FocusDo Multi-Criteria Automatic Priority Sorting Engine
 * 1순위: 중요도 점수 (높은 점수 우선)
 * 2순위: 마감일 시급성 (D-Day 기준 잔여 일수가 적은 순)
 * 3순위: 예상 소요 시간 (기본: 짧은 업무 우선, 설정에 따라 긴 업무 우선 가능)
 */
export function sortTasksByPriority(
  tasks: TaskItem[],
  durationTieBreaker: DurationTieBreaker = 'shortest',
  referenceDateStr: string = getLocalTodayString(),
): TaskItem[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (a.completed && b.completed) {
      const aTime = a.completedAt ?? a.createdAt;
      const bTime = b.completedAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    }

    // 1순위: 중요도 점수 내림차순
    if (b.importance !== a.importance) {
      return b.importance - a.importance;
    }

    // 2순위: 마감일 시급성 오름차순 (D+1, D-Day, D-1, D-3...)
    const aDays = getDaysRemaining(a.dueDate, referenceDateStr);
    const bDays = getDaysRemaining(b.dueDate, referenceDateStr);
    if (aDays !== bDays) {
      return aDays - bDays;
    }

    // 3순위: 예상 소요 시간
    if (a.estimatedMinutes !== b.estimatedMinutes) {
      return durationTieBreaker === 'shortest'
        ? a.estimatedMinutes - b.estimatedMinutes
        : b.estimatedMinutes - a.estimatedMinutes;
    }

    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function isTodayFocusTask(
  task: TaskItem,
  referenceDateStr: string = getLocalTodayString(),
): boolean {
  if (task.completed) return false;
  const days = getDaysRemaining(task.dueDate, referenceDateStr);
  // Show tasks due within 2 days, overdue, or high importance (>= 4)
  return days <= 2 || task.importance >= 4;
}
