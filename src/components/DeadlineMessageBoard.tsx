import React, {useState} from 'react';
import {Check, ChevronRight, Sliders, Sparkles} from 'lucide-react';
import {CharacterStage, TaskItem} from '../types/todo';
import {
  formatDDay,
  formatDuration,
  getCharacterMood,
  getDaysRemaining,
} from '../utils/priorityEngine';
import {DogAvatar} from './DogAvatar';

interface DeadlineMessageBoardProps {
  tasks: TaskItem[];
  onToggleComplete: (id: string) => void;
  onOpenTaskDetails?: (task: TaskItem) => void;
  onOpenAddModal: () => void;
}

export const DeadlineMessageBoard: React.FC<DeadlineMessageBoardProps> = ({
  tasks,
  onToggleComplete,
  onOpenTaskDetails,
  onOpenAddModal,
}) => {
  // Interactive D-Day scrubber state for users to test expressions in real time
  const [simulatedDDay, setSimulatedDDay] = useState<number>(0);
  const [showSimModal, setShowSimModal] = useState<boolean>(false);

  // Filter tasks into the 4 PRD stages
  const activeTasks = tasks.filter((t) => !t.completed);

  const stage4Tasks = activeTasks.filter(
    (t) => getDaysRemaining(t.dueDate) <= 0,
  );
  const stage3Tasks = activeTasks.filter((t) => {
    const days = getDaysRemaining(t.dueDate);
    return days >= 1 && days <= 2;
  });
  const stage2Tasks = activeTasks.filter((t) => {
    const days = getDaysRemaining(t.dueDate);
    return days >= 3 && days <= 4;
  });
  const stage1Tasks = activeTasks.filter(
    (t) => getDaysRemaining(t.dueDate) >= 5,
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  const simMood = getCharacterMood(simulatedDDay);

  const boardCards: {
    stage: CharacterStage;
    title: string;
    dDayTag: string;
    tagBg: string;
    borderColor: string;
    quote: string;
    description: string;
    stageTasks: TaskItem[];
  }[] = [
    {
      stage: 4,
      title: '긴급 & 당일 마감',
      dDayTag: 'D-DAY / 지연 (긴급)',
      tagBg: 'bg-[#EF4444]',
      borderColor: 'border-[#EF4444]',
      quote: '오늘 마감입니다!!! 지금 당장 제출하세요! 😡🔥',
      description: '험악하고 찌푸린 눈썹, 화난 불독/호랑이 가시 형태',
      stageTasks: stage4Tasks,
    },
    {
      stage: 3,
      title: '마감 임박 경고',
      dDayTag: 'D-1 ~ D-2 (경고)',
      tagBg: 'bg-[#FB923C]',
      borderColor: 'border-[#FB923C]',
      quote: '마감 임박! 초안 검토하고 오늘 중으로 마무리하세요! ⚠️',
      description: '눈썹이 찌푸러짐(\\ / 모형), 굵은 눈썹, 정색한 표정',
      stageTasks: stage3Tasks,
    },
    {
      stage: 2,
      title: '사전 점검 주의',
      dDayTag: 'D-3 ~ D-4 (주의)',
      tagBg: 'bg-[#FACC15]',
      borderColor: 'border-[#FACC15]',
      quote: '마감 3~4일 전입니다. 슬슬 서두르세요! 😐',
      description: '평범한 눈빛, 살짝 긴장한 일자 입 모양과 땀방울',
      stageTasks: stage2Tasks,
    },
    {
      stage: 1,
      title: '안정 & 여유 상태',
      dDayTag: 'D-5 이상 (여유)',
      tagBg: 'bg-[#4ADE80]',
      borderColor: 'border-[#4ADE80]',
      quote: '아직 마감까지 시간 넉넉해요~ 차분하게 준비해요 🐶🎵',
      description: 'tongue-out(혀 메롱), 머리 위 사과/꽃, 편안하고 느긋한 눈빛',
      stageTasks: stage1Tasks,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Board Header Banner */}
      <div className="bg-[var(--color-bg-surface,#FFFFFF)] border-2 border-[#1E1E1E] rounded-3xl p-6 sm:p-7 shadow-[4px_4px_0px_#1E1E1E] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-primary,#3B66C4)] uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>D-Day Reactive Expression System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] tracking-tight">
              📌 마감 맞춤형 표정 변화 메시지 보드
            </h1>
            <p className="mt-1.5 text-sm text-[var(--color-text-muted,#7A8291)]">
              마감일(D-Day)이 가까워질수록 강아지 캐릭터의 표정이 점차 긴장되고 험악해집니다.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowSimModal((prev) => !prev)}
              className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-white border-2 border-[#1E1E1E] shadow-[2px_2px_0px_#1E1E1E] hover:translate-y-0.5 hover:shadow-none text-xs font-bold text-[#1E1E1E] transition-all whitespace-nowrap"
            >
              <Sliders className="w-4 h-4" />
              <span>{showSimModal ? '시뮬레이터 닫기' : '표정 체험 슬라이더'}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 min-h-[42px] px-4 py-2 rounded-xl bg-[#1E1E1E] text-white text-xs font-bold shadow-[2px_2px_0px_#7A8291] hover:bg-black transition-all whitespace-nowrap"
            >
              <span>새 할 일 등록</span>
            </button>
          </div>
        </div>

        {/* Interactive Expression Simulator (Collapsible) */}
        {showSimModal && (
          <div className="mt-6 pt-5 border-t-2 border-dashed border-[#1E1E1E]/20 bg-[var(--color-bg-page,#F5F7FA)] rounded-2xl p-5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <DogAvatar stage={simMood.stage} size={84} />
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-2xs ${simMood.badgeBg}`}
                  >
                    {formatDDay(simulatedDDay)} ({simMood.stageName})
                  </span>
                  <div className="mt-1.5 text-sm font-bold text-[#1E1E1E]">
                    &ldquo;{simMood.defaultMessage}&rdquo;
                  </div>
                  <div className="text-xs text-[var(--color-text-muted,#7A8291)] mt-0.5">
                    마감일 슬라이더를 움직여 실시간으로 표정 변화를 확인하세요.
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md ml-auto">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#1E1E1E] mb-2">
                  <span>D+3 (지연)</span>
                  <span className="text-[var(--color-primary,#3B66C4)]">
                    선택: {formatDDay(simulatedDDay)}
                  </span>
                  <span>D-10 (여유)</span>
                </div>
                <input
                  type="range"
                  min={-3}
                  max={10}
                  step={1}
                  value={simulatedDDay}
                  onChange={(e) => setSimulatedDDay(Number(e.target.value))}
                  aria-label="시뮬레이션 D-Day 조절"
                  className="w-full h-2 rounded-full focusdo-slider bg-[#E2E7F0]"
                />
                <div className="flex justify-between text-[11px] text-[var(--color-text-muted,#7A8291)] mt-1.5">
                  <span className="text-red-600 font-bold">Stage 4 험악</span>
                  <span className="text-orange-500 font-bold">Stage 3 경고</span>
                  <span className="text-amber-500 font-bold">Stage 2 주의</span>
                  <span className="text-emerald-600 font-bold">Stage 1 여유</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Cards Grid - One for Each D-Day Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {boardCards.map((card) => {
          const hasTasks = card.stageTasks.length > 0;

          return (
            <div
              key={card.stage}
              className={`bg-[var(--color-bg-surface,#FFFFFF)] border-[3px] ${card.borderColor} rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_#1E1E1E] flex flex-col justify-between transition-all hover:-translate-y-0.5`}
            >
              <div>
                {/* Header Row: Avatar + Tag + Title */}
                <div className="flex items-start gap-4">
                  <DogAvatar stage={card.stage} size={68} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-extrabold text-white shadow-2xs ${card.tagBg}`}
                      >
                        {card.dDayTag}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted,#7A8291)] font-medium">
                        {card.stageTasks.length}개 업무
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-[#1E1E1E] leading-snug">
                      &ldquo;{card.quote}&rdquo;
                    </div>
                    <p className="text-xs text-[var(--color-text-muted,#7A8291)] mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Task List under this stage */}
                <div className="mt-5 pt-4 border-t border-[var(--color-border,#E2E7F0)] space-y-2.5">
                  <div className="text-xs font-bold text-[#1E1E1E] flex items-center justify-between">
                    <span>해당 단계 업무 목록</span>
                    <span className="text-[11px] font-mono text-[var(--color-text-muted,#7A8291)]">
                      {hasTasks ? `${card.stageTasks.length}건 진행 중` : '해당 없음'}
                    </span>
                  </div>

                  {hasTasks ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {card.stageTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-2.5 rounded-xl bg-[var(--color-bg-page,#F5F7FA)] border border-[var(--color-border,#E2E7F0)] flex items-center justify-between gap-3 group hover:border-[#1E1E1E] transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => onToggleComplete(task.id)}
                            aria-label={`${task.title} 완료 처리`}
                            className="w-5 h-5 rounded-md border border-[var(--color-border,#E2E7F0)] bg-white hover:border-[var(--color-primary,#3B66C4)] flex items-center justify-center shrink-0 transition-colors"
                          >
                            {task.completed && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1E1E1E] truncate">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted,#7A8291)] mt-0.5 font-mono">
                              <span>중요도 {task.importance}점</span>
                              <span>·</span>
                              <span>{formatDuration(task.estimatedMinutes)}</span>
                              <span>·</span>
                              <span className="font-bold text-[#1E1E1E]">
                                {task.progress}% 완료
                              </span>
                            </div>
                          </div>

                          {onOpenTaskDetails && (
                            <button
                              type="button"
                              onClick={() => onOpenTaskDetails(task)}
                              aria-label="업무 상세 보기"
                              className="p-1 rounded-lg text-[var(--color-text-muted,#7A8291)] hover:text-[#1E1E1E] hover:bg-white"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-[var(--color-text-muted,#7A8291)] bg-[var(--color-bg-page,#F5F7FA)] rounded-xl border border-dashed border-[var(--color-border,#E2E7F0)]">
                      현재 이 단계의 대기 업무가 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Badge */}
              <div className="mt-4 pt-3 border-t border-[var(--color-border,#E2E7F0)]/60 flex items-center justify-between text-xs font-medium text-[var(--color-text-muted,#7A8291)]">
                <span>{card.title}</span>
                <span className="font-mono text-[11px] font-semibold text-[#1E1E1E]">
                  {hasTasks ? `${card.stageTasks.length}개 집중 필요` : '안정 상태'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner for Completed Tasks */}
      {completedCount > 0 && (
        <div className="bg-[var(--color-bg-surface,#FFFFFF)] border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_#1E1E1E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DogAvatar stage={1} completed={true} size={52} />
            <div>
              <div className="text-sm font-bold text-[#1E1E1E]">
                완료된 업무 {completedCount}건 🎉
              </div>
              <div className="text-xs text-[var(--color-text-muted,#7A8291)]">
                강아지가 활짝 웃고 있어요! 남은 업무들도 하나씩 해결해 볼까요?
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
