# 퀵페이지 — 기획 포트폴리오

> **단기 마케팅·운영용 랜딩 빌더** 기획·검증 프로젝트  
> Product Planner Portfolio · Working Prototype Included

---

## 이 폴더 구성

| 문서 | 용도 |
|------|------|
| [PRD.md](./PRD.md) | 제품 요구사항 정의서 — 문제, 타겟, 범위, 요금제, 의사결정 |
| [ROADMAP.md](./ROADMAP.md) | 구현 현황 — Implemented / Designed / Future |
| [DEMO.md](./DEMO.md) | 3분 데모 시나리오 (면접·발표용) |
| [METRICS.md](./METRICS.md) | 성공 지표·가설 검증 프레임워크 |
| [COMPETITIVE.md](./COMPETITIVE.md) | 경쟁·대안 비교 |
| [RETROSPECTIVE.md](./RETROSPECTIVE.md) | 회고 — 배운 점, 다음 단계 |
| [presentation.html](./presentation.html) | PPT형 HTML 포트폴리오 슬라이드 (16장) |

---

## 포트폴리오에서 강조할 메시지

1. **문제**: 이벤트·모집 페이지는 자주·빨리 만들어야 하지만 기존 툴은 무겁다.
2. **솔루션**: 템플릿 + 폼 편집만으로 10분 내 배포 가능한 초경량 랜딩 빌더.
3. **검증**: 동작하는 프로토타입으로 Golden Path(만들기→배포→공유→트래킹) 완성.
4. **범위 관리**: 수익화·B2B 기능은 상세 설계만 하고 MVP 코드 범위에서 제외.

---

## 라이브 데모 경로 (Golden Path)

```
/ → /templates → /create → 배포하기 → /p/{id} → 대시보드 방문 로그
```

**데모 전제**: Supabase 연동 + 로그인 완료 상태 권장

---

## 기술 참고 (포트폴리오용 한 줄)

Next.js · Supabase · Vercel — 상세는 루트 [README.md](../../README.md)
