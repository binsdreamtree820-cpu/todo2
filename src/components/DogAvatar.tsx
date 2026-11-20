import React from 'react';
import {CharacterStage} from '../types/todo';

interface DogAvatarProps {
  stage: CharacterStage;
  completed?: boolean;
  size?: number; // width & height in px, default 56
  className?: string;
}

export const DogAvatar: React.FC<DogAvatarProps> = ({
  stage,
  completed = false,
  size = 56,
  className = '',
}) => {
  // Border color based on PRD:
  // Stage 1 (D-5+): #4ADE80
  // Stage 2 (D-3~4): #FACC15
  // Stage 3 (D-1~2): #FB923C
  // Stage 4 (D-Day): #EF4444
  // Completed: #10B981
  const borderColor = completed
    ? '#10B981'
    : stage === 4
      ? '#EF4444'
      : stage === 3
        ? '#FB923C'
        : stage === 2
          ? '#FACC15'
          : '#4ADE80';

  const bgColor = completed
    ? '#ECFDF5'
    : stage === 4
      ? '#FEF2F2'
      : stage === 3
        ? '#FFF7ED'
        : stage === 2
          ? '#FEFCE8'
          : '#F0FDF4';

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor,
        backgroundColor: bgColor,
      }}
      className={`rounded-full border-[2.5px] shrink-0 flex items-center justify-center p-0.5 shadow-2xs transition-all overflow-hidden select-none ${className}`}
      title={
        completed
          ? '완료됨! 수고하셨습니다 🐶'
          : stage === 4
            ? 'Stage 4: D-Day 긴급/험악 표정'
            : stage === 3
              ? 'Stage 3: D-1~2 경고/찌푸린 표정'
              : stage === 2
                ? 'Stage 2: D-3~4 주의/긴장 표정'
                : 'Stage 1: D-5+ 여유/메롱 표정'
      }
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        stroke="#1E1E1E"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Completed State: Happy smiling pup with celebration sparkles */}
        {completed && (
          <g>
            {/* Sparkles */}
            <path
              d="M 50 6 L 52 12 L 58 14 L 52 16 L 50 22 L 48 16 L 42 14 L 48 12 Z"
              fill="#F59E0B"
              stroke="#1E1E1E"
              strokeWidth="1.5"
            />
            <path
              d="M 20 40 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 40 C 90 70, 10 70, 20 40 Z"
              fill="#FFFFFF"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            {/* Cheerful ^ ^ eyes */}
            <path
              d="M 33 42 Q 38 35 43 42"
              stroke="#1E1E1E"
              strokeWidth="3.5"
              fill="none"
            />
            <path
              d="M 57 42 Q 62 35 67 42"
              stroke="#1E1E1E"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Big cute nose */}
            <ellipse cx="50" cy="50" rx="11" ry="6.5" fill="#1E1E1E" />
            {/* Big happy open mouth */}
            <path
              d="M 42 58 Q 50 71 58 58"
              fill="#FDA4AF"
              stroke="#1E1E1E"
              strokeWidth="2.8"
            />
            {/* Pink cheeks */}
            <ellipse cx="28" cy="48" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.8" />
            <ellipse cx="72" cy="48" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.8" />
          </g>
        )}

        {/* Stage 1: D-5 이상 (여유, 혀 메롱 + 머리 위 사과) */}
        {!completed && stage === 1 && (
          <g>
            {/* Apple item on head */}
            <circle
              cx="50"
              cy="16"
              r="7.5"
              fill="#EF4444"
              stroke="#1E1E1E"
              strokeWidth="2.5"
            />
            <path
              d="M 50 9 Q 49 5 52 4"
              stroke="#1E1E1E"
              strokeWidth="2"
              fill="none"
            />
            <ellipse
              cx="55"
              cy="7"
              rx="3"
              ry="1.8"
              fill="#4ADE80"
              stroke="#1E1E1E"
              strokeWidth="1.2"
            />

            {/* Dog Head Contour & Ears */}
            <path
              d="M 20 40 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 40 C 90 70, 10 70, 20 40 Z"
              fill="#FFFFFF"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            {/* Calm, sparkling eyes */}
            <circle cx="38" cy="40" r="3.2" fill="#1E1E1E" />
            <circle cx="62" cy="40" r="3.2" fill="#1E1E1E" />
            <circle cx="39.5" cy="38.5" r="1.1" fill="#FFFFFF" />
            <circle cx="63.5" cy="38.5" r="1.1" fill="#FFFFFF" />
            {/* Big nose */}
            <ellipse cx="50" cy="51" rx="12" ry="7" fill="#1E1E1E" />
            {/* Tongue out (메롱) */}
            <path
              d="M 54 58 Q 59 73 52 75 Q 46 72 49 58"
              fill="#FDA4AF"
              stroke="#1E1E1E"
              strokeWidth="2.8"
            />
            {/* Pink cheeks */}
            <ellipse cx="28" cy="48" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.65" />
            <ellipse cx="72" cy="48" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.65" />
          </g>
        )}

        {/* Stage 2: D-3 ~ D-4 (주의, 약간 긴장한 일자 입 모양) */}
        {!completed && stage === 2 && (
          <g>
            {/* Dog Head Contour */}
            <path
              d="M 20 40 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 40 C 90 70, 10 70, 20 40 Z"
              fill="#FFFFFF"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            {/* Cold sweat drop on temple */}
            <path
              d="M 74 24 C 74 20, 77 17, 77 17 C 77 17, 80 20, 80 24 C 80 26, 74 27, 74 24 Z"
              fill="#93C5FD"
              stroke="#1E1E1E"
              strokeWidth="1.8"
            />
            {/* Slightly elevated / straight eyebrows */}
            <line
              x1="32"
              y1="32"
              x2="43"
              y2="34"
              stroke="#1E1E1E"
              strokeWidth="3.2"
            />
            <line
              x1="68"
              y1="32"
              x2="57"
              y2="34"
              stroke="#1E1E1E"
              strokeWidth="3.2"
            />
            {/* Alert eyes */}
            <circle cx="38" cy="42" r="3.2" fill="#1E1E1E" />
            <circle cx="62" cy="42" r="3.2" fill="#1E1E1E" />
            <circle cx="39.5" cy="40.5" r="1" fill="#FFFFFF" />
            <circle cx="63.5" cy="40.5" r="1" fill="#FFFFFF" />
            {/* Big nose */}
            <ellipse cx="50" cy="53" rx="12" ry="7" fill="#1E1E1E" />
            {/* Nervous straight mouth (일자 입) */}
            <line
              x1="42"
              y1="64"
              x2="58"
              y2="64"
              stroke="#1E1E1E"
              strokeWidth="3.2"
            />
          </g>
        )}

        {/* Stage 3: D-1 ~ D-2 (경고, 찌푸린 \ / 눈썹 + 정색한 표정) */}
        {!completed && stage === 3 && (
          <g>
            {/* Dog Head Contour */}
            <path
              d="M 20 42 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 42 C 90 72, 10 72, 20 42 Z"
              fill="#FFFFFF"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            {/* Forehead furrow wrinkle */}
            <line
              x1="50"
              y1="28"
              x2="50"
              y2="34"
              stroke="#1E1E1E"
              strokeWidth="2.5"
            />
            {/* Fierce angled eyebrows (\ /) */}
            <line
              x1="29"
              y1="31"
              x2="44"
              y2="38"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            <line
              x1="71"
              y1="31"
              x2="56"
              y2="38"
              stroke="#1E1E1E"
              strokeWidth="4"
            />
            {/* Serious squinting eyes */}
            <circle cx="38" cy="43" r="2.8" fill="#1E1E1E" />
            <circle cx="62" cy="43" r="2.8" fill="#1E1E1E" />
            {/* Big nose */}
            <ellipse cx="50" cy="53" rx="13" ry="7.5" fill="#1E1E1E" />
            {/* Frowning mouth */}
            <path
              d="M 40 66 Q 50 61 60 66"
              stroke="#1E1E1E"
              strokeWidth="3.5"
              fill="none"
            />
          </g>
        )}

        {/* Stage 4: D-Day 이하 (긴급/험악, 험악한 V자 눈썹 + 불독/가시 표정) */}
        {!completed && stage === 4 && (
          <g>
            {/* Angry steam / fire mark */}
            <path
              d="M 76 17 Q 82 12 79 7 Q 85 10 82 18"
              fill="#EF4444"
              stroke="#1E1E1E"
              strokeWidth="1.2"
            />
            {/* Tense bulldog head contour */}
            <path
              d="M 20 45 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 45 C 90 75, 10 75, 20 45 Z"
              fill="#FFFFFF"
              stroke="#1E1E1E"
              strokeWidth="4.5"
            />
            {/* Heavy forehead fury lines */}
            <line
              x1="46"
              y1="26"
              x2="46"
              y2="34"
              stroke="#EF4444"
              strokeWidth="2.5"
            />
            <line
              x1="54"
              y1="26"
              x2="54"
              y2="34"
              stroke="#EF4444"
              strokeWidth="2.5"
            />
            {/* Menacing thick V eyebrows */}
            <line
              x1="27"
              y1="29"
              x2="45"
              y2="39"
              stroke="#1E1E1E"
              strokeWidth="5.2"
            />
            <line
              x1="73"
              y1="29"
              x2="55"
              y2="39"
              stroke="#1E1E1E"
              strokeWidth="5.2"
            />
            {/* Small intense piercing eyes */}
            <circle cx="39" cy="43" r="2.5" fill="#1E1E1E" />
            <circle cx="61" cy="43" r="2.5" fill="#1E1E1E" />
            {/* Broad flared nose */}
            <ellipse cx="50" cy="54" rx="14" ry="9" fill="#1E1E1E" />
            {/* Grimacing angry bulldog mouth with teeth */}
            <path
              d="M 37 69 Q 50 58 63 69"
              stroke="#1E1E1E"
              strokeWidth="4.2"
              fill="none"
            />
            {/* Tiny teeth lines */}
            <line
              x1="43"
              y1="67"
              x2="43"
              y2="71"
              stroke="#1E1E1E"
              strokeWidth="2.2"
            />
            <line
              x1="57"
              y1="67"
              x2="57"
              y2="71"
              stroke="#1E1E1E"
              strokeWidth="2.2"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
