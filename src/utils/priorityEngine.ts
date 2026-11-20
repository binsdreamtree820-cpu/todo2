import {
  CharacterMood,
  CharacterStage,
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

/**
 * 4-Stage Dog Character mood mapping based on deadline_message_board_ui_81491f83.md
 * Stage 1 (여유): D-5 이상 (혀 메롱, 편안함, 초록 #4ADE80)
 * Stage 2 (주의): D-3 ~ D-4 (일자 입, 살짝 긴장, 노랑 #FACC15)
 * Stage 3 (경고): D-1 ~ D-2 (찌푸린 눈썹, 정색, 주황 #FB923C)
 * Stage 4 (긴급/D-Day): D-Day 이하 (험악한 불독/가시 표정, 빨강 #EF4444)
 */
export function getCharacterMood(
  daysRemaining: number,
  completed = false,
): CharacterMood {
  if (completed) {
    return {
      stage: 1,
      stageName: '완료',
      themeColor: '#10B981',
      badgeBg: 'bg-emerald-500',
      badgeText: 'text-emerald-700',
      defaultMessage: '완료된 업무예요! 정말 수고 많으셨습니다 🎉',
    };
  }

  if (daysRemaining <= 0) {
    const isOverdue = daysRemaining < 0;
    return {
      stage: 4,
      stageName: isOverdue ? `D+${Math.abs(daysRemaining)} 지연` : 'D-Day 긴급',
      themeColor: '#EF4444',
      badgeBg: 'bg-[#EF4444]',
      badgeText: 'text-[#EF4444]',
      defaultMessage: isOverdue
        ? `마감일이 ${Math.abs(daysRemaining)}일 지났습니다! 지금 당장 제출하세요! 💥`
        : '오늘 마감입니다!!! 지금 당장 제출하세요! 😡🔥',
    };
  }

  if (daysRemaining <= 2) {
    return {
      stage: 3,
      stageName: `D-${daysRemaining} 경고`,
      themeColor: '#FB923C',
      badgeBg: 'bg-[#FB923C]',
      badgeText: 'text-[#FB923C]',
      defaultMessage: `마감 임박! 초안 검토하고 서둘러 제출하세요! ⚠️`,
    };
  }

  if (daysRemaining <= 4) {
    return {
      stage: 2,
      stageName: `D-${daysRemaining} 주의`,
      themeColor: '#FACC15',
      badgeBg: 'bg-[#FACC15]',
      badgeText: 'text-[#ca8a04]',
      defaultMessage: `마감 ${daysRemaining}일 전입니다. 슬슬 서두르세요! 😐`,
    };
  }

  return {
    stage: 1,
    stageName: `D-${daysRemaining} 여유`,
    themeColor: '#4ADE80',
    badgeBg: 'bg-[#4ADE80]',
    badgeText: 'text-emerald-700',
    defaultMessage: `아직 마감까지 ${daysRemaining}일 남았어요~ 시간 넉넉해요! 🎵`,
  };
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
