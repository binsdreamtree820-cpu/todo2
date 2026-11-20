import {TaskItem} from '../types/todo';
import {addDaysToDate, getLocalTodayString} from '../utils/priorityEngine';

export function createInitialTasks(): TaskItem[] {
  const today = getLocalTodayString();

  return [
    {
      id: 'task-1',
      title: '4분기 서비스 개편 최종 기획안 임원 보고',
      importance: 5,
      dueDate: today, // D-Day (Critical)
      estimatedMinutes: 45,
      progress: 75,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
    {
      id: 'task-2',
      title: '결제 모듈 장애 원인 회고 문서 마감 제출',
      importance: 5,
      dueDate: addDaysToDate(today, -1), // D+1 (Critical / Overdue)
      estimatedMinutes: 60,
      progress: 50,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    },
    {
      id: 'task-3',
      title: '주간 스프린트 백로그 우선순위 확정 및 공유',
      importance: 4,
      dueDate: addDaysToDate(today, 1), // D-1 (Warning)
      estimatedMinutes: 30,
      progress: 40,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: 'task-4',
      title: '신규 입사자 온보딩 가이드 피드백 반영',
      importance: 4,
      dueDate: addDaysToDate(today, 2), // D-2 (Warning)
      estimatedMinutes: 25,
      progress: 20,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'task-5',
      title: '외부 디자인 에이전시 견적서 비교 검토',
      importance: 3,
      dueDate: today, // D-Day (Critical)
      estimatedMinutes: 20,
      progress: 0,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'task-6',
      title: '월간 법인카드 영수증 정산 및 경비 청구',
      importance: 3,
      dueDate: addDaysToDate(today, 4), // D-4 (Normal)
      estimatedMinutes: 15,
      progress: 0,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: 'task-7',
      title: '연말 사내 워크숍 장소 후보 리스트업',
      importance: 2,
      dueDate: addDaysToDate(today, 6), // D-6 (Normal)
      estimatedMinutes: 40,
      progress: 10,
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'task-8',
      title: '오전 데일리 스탠드업 회의록 정리 및 배포',
      importance: 4,
      dueDate: today,
      estimatedMinutes: 15,
      progress: 100,
      completed: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];
}
