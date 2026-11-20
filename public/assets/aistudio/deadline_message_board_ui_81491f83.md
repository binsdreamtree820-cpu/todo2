# 🐶 마감일자 맞춤형 표정 변화 메시지 보드 UI 디자인 & 개발 가이드

이 문서에서는 이미지 속 귀여운 강아지/동물 캐릭터들의 다양한 표정을 활용하여, 마감일(D-day)이 가까워질수록 표정이 점차 험악해지거나 심각해지는 메시지 보드 UI 컴포넌트를 정의합니다.

---

## 1. D-Day 단계별 표정 변화 및 색상 테마 정의

| 단계 | D-Day 범위 | 캐릭터 상태 및 표정 특징 | UI 주요 컬러 |
| :--- | :--- | :--- | :--- |
| **Stage 1 (여유)** | D-5 이상 | tongue-out (혀 메롱), 리본/꽃/사과 아이템, 편안하고 느긋한 눈빛 | `#4ADE80` (초록/안정) |
| **Stage 2 (주의)** | D-3 ~ D-4 | 평범한 눈빛, 살짝 긴장한 일자 입 모양 또는 살짝 찡그림 | `#FACC15` (노랑/주의) |
| **Stage 3 (경고)** | D-1 ~ D-2 | 눈썹이 찌푸러짐(`\ /` 모형), 굵은 눈썹, 정색한 표정 | `#FB923C` (주황/경고) |
| **Stage 4 (긴급/D-Day)** | D-Day 이하 | 험악하고 찌푸린 눈썹, 화난 불독/호랑이 가시 형태, 입꼬리 내림 | `#EF4444` (빨강/비상) |

---

## 2. 메시지 보드 UI 컴포넌트 구조 (Concept Layout)

```text
+-------------------------------------------------------------+
|  📌 팀 작업 마감 현황 메시지 보드                           |
+-------------------------------------------------------------+
|                                                             |
|  [ 🐶 Stage 1: 여유 ]   "아직 마감까지 7일 남았어요~ 🎵"     |
|   - 캐릭터: 혀 메롱 + 머리 위 사과/꽃                        |
|   - 배경/태그: 초록색 (D-7)                                  |
|                                                             |
|  [ 🐕 Stage 2: 주의 ]   "마감 3일 전입니다. 서두르세요!"     |
|   - 캐릭터: 평범함 + 약간의 긴장 (눈빛 고정)                 |
|   - 배경/태그: 노란색 (D-3)                                  |
|                                                             |
|  [ 😡 Stage 3: 험악/경고 ] "마감 임박! 오늘까지 제출하세요!"|
|   - 캐릭터: 찌푸린 눈썹 + 험악한 불독/가시 표정              |
|   - 배경/태그: 빨간색 (D-DAY)                                |
|                                                             |
+-------------------------------------------------------------+
```

---

## 3. 웹 구현 코드 예시 (HTML + CSS / SVG 변환 예시)

손그림 스타일의 라인 아트를 SVG 벡터 로직으로 제어하여, 마감일에 따라 파라미터를 변경해 표정을 유기적으로 험악하게 변화시킵니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>마감일 표정 변화 메시지 보드</title>
  <style>
    :root {
      --bg-color: #f7f7f8;
      --card-border: #1e1e1e;
    }

    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: var(--bg-color);
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .message-board {
      width: 450px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card {
      background: white;
      border: 3px solid var(--card-border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 4px 4px 0px var(--card-border);
      transition: all 0.3s ease;
    }

    /* 마감 단계별 캐릭터 카드 스타일 */
    .card.relaxed { border-color: #22c55e; }
    .card.warning { border-color: #f59e0b; }
    .card.urgent  { border-color: #ef4444; }

    .character-avatar {
      width: 80px;
      height: 80px;
      border: 2px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
    }

    .message-content {
      flex: 1;
    }

    .d-day-tag {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 12px;
      color: white;
      margin-bottom: 6px;
    }

    .relaxed .d-day-tag { background-color: #22c55e; }
    .warning .d-day-tag { background-color: #f59e0b; }
    .urgent .d-day-tag  { background-color: #ef4444; }

    .message-text {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    /* 손그림 캐릭터 SVG 애니메이션 스타일 */
    .eyebrow {
      transition: transform 0.3s ease;
    }
    .urgent .eyebrow-left {
      transform: rotate(25deg) translateY(2px);
    }
    .urgent .eyebrow-right {
      transform: rotate(-25deg) translateY(2px);
    }
  </style>
</head>
<body>

<div class="message-board">

  <!-- 1. 여유 상태 카드 (D-7) -->
  <div class="card relaxed">
    <div class="character-avatar">
      <!-- 귀여운 강아지 SVG (메롱 표정) -->
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round">
        <!-- 얼굴 윤곽 & 귀 -->
        <path d="M 20 40 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 40 C 90 70, 10 70, 20 40 Z" />
        <!-- 눈 -->
        <circle cx="38" cy="40" r="3" fill="#000" />
        <circle cx="62" cy="40" r="3" fill="#000" />
        <!-- 큰 코 -->
        <ellipse cx="50" cy="52" rx="12" ry="7" fill="#000" />
        <!-- 혀 (메롱) -->
        <path d="M 55 60 Q 60 72 52 75 Q 46 72 50 60" fill="#fff" stroke="#000" stroke-width="3"/>
      </svg>
    </div>
    <div class="message-content">
      <span class="d-day-tag">D-7 (여유)</span>
      <div class="message-text">기획서 작성 진행 중입니다. 아직 시간 넉넉해요~ 🐶</div>
    </div>
  </div>

  <!-- 2. 주의 상태 카드 (D-2) -->
  <div class="card warning">
    <div class="character-avatar">
      <!-- 살짝 진지해진 표정 -->
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#000" stroke-width="4" stroke-linecap="round">
        <path d="M 20 40 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 40 C 90 70, 10 70, 20 40 Z" />
        <!-- 약간 올라간 눈썹 -->
        <line x1="32" y1="32" x2="42" y2="34" stroke-width="3" />
        <line x1="68" y1="32" x2="58" y2="34" stroke-width="3" />
        <circle cx="38" cy="42" r="3" fill="#000" />
        <circle cx="62" cy="42" r="3" fill="#000" />
        <ellipse cx="50" cy="54" rx="12" ry="7" fill="#000" />
        <!-- 입 (일자) -->
        <line x1="42" y1="65" x2="58" y2="65" stroke-width="3" />
      </svg>
    </div>
    <div class="message-content">
      <span class="d-day-tag">D-2 (경고)</span>
      <div class="message-text">초안 검토 부탁드립니다! 마감이 얼마 안 남았어요. 😐</div>
    </div>
  </div>

  <!-- 3. 긴급/험악 상태 카드 (D-DAY) -->
  <div class="card urgent">
    <div class="character-avatar">
      <!-- 험악한 불독/화난 표정 -->
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round">
        <!-- 찌푸린 얼굴 라인 -->
        <path d="M 20 45 C 10 20, 40 10, 50 30 C 60 10, 90 20, 80 45 C 90 75, 10 75, 20 45 Z" />
        <!-- 험악한 V자 눈썹 -->
        <line class="eyebrow eyebrow-left" x1="30" y1="30" x2="44" y2="38" />
        <line class="eyebrow eyebrow-right" x1="70" y1="30" x2="56" y2="38" />
        <!-- 작고 강렬한 눈 -->
        <circle cx="39" cy="42" r="2.5" fill="#000" />
        <circle cx="61" cy="42" r="2.5" fill="#000" />
        <!-- 커진 코와 찡그린 입 -->
        <ellipse cx="50" cy="54" rx="14" ry="9" fill="#000" />
        <path d="M 40 68 Q 50 60 60 68" />
        <!-- 잔선 (화남 표시) -->
        <line x1="50" y1="28" x2="50" y2="35" stroke-width="2"/>
      </svg>
    </div>
    <div class="message-content">
      <span class="d-day-tag">D-DAY (험악)</span>
      <div class="message-text">오늘 마감입니다!!! 지금 당장 제출하세요! 😡🔥</div>
    </div>
  </div>

</div>

</body>
</html>
```

---

## 4. 핵심 특징 및 활용 방법

1. **이미지 원본 스타일 반영**: 
   - 검은색의 두꺼운 손그림 선(Line Art) 스타일 유지
   - 커다랗고 검게 채워진 귀여운 코(`ellipse`)
   - 혀를 낸 모습(여유)부터 찌푸린 눈썹과 잔선(험악/경고)까지 단계별 표정 연출
2. **동적 UI 연동**:
   - 메시지 데이터의 `deadlineDate`와 현재 날짜 차이($D = \text{TargetDate} - \text{Today}$)를 계산하여 카드의 CSS 클래스(`relaxed`, `warning`, `urgent`)를 자동으로 스위칭하도록 구성합니다.