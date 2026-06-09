# 퀵페이지 (QuickPage)

> **QuickPage** — publish event and recruitment landing pages in 10 minutes, no code required.

단기 마케팅·운영용 초간편 랜딩 빌더 — 10분 안에 배포하는 이벤트 페이지

## 기획 포트폴리오

PM 포트폴리오용 문서(PRD, 로드맵, 데모 스크립트, 지표, 경쟁 분석, 회고)는 **[docs/portfolio/README.md](./docs/portfolio/README.md)** 에서 확인할 수 있습니다.

## 시작하기

```bash
npm install
npm run dev:clean   # 캐시 오류 시 권장
```

[http://localhost:3000](http://localhost:3000)

## 로드맵 진행 상황

| 단계 | 상태 | 내용 |
|------|------|------|
| 1단계 프로토타입 | ✅ | 템플릿, 에디터, JSON 렌더링 |
| 2단계 가설 검증 | ✅ | 페이지 저장·배포, 대시보드, Supabase Auth |
| 3단계 서비스화 | 🔜 | 유료화, 커스텀 도메인, 팀 계정 |

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 마케팅 랜딩 |
| `/templates` | 템플릿 갤러리 |
| `/create` | 페이지 편집 + **배포** |
| `/create?edit={id}` | 기존 페이지 수정 |
| `/dashboard` | 내 페이지 관리 |
| `/p/[id]` | 배포된 페이지 (UUID, 중복 없음) |
| `/login` `/signup` | 로그인·회원가입 (Supabase) |
| `/terms` | 서비스 이용 약관 |
| `/privacy` | 개인정보처리방침 |
| `/guidelines` | 운영 정책 및 가이드라인 |

## 페이지 저장 & 배포

1. `/create`에서 페이지 편집
2. **배포하기** 클릭 (Supabase 연동 시 로그인 필요)
3. `/p/{uuid}` 로 즉시 공개
4. `/dashboard`에서 보기·수정·삭제

### Supabase 연동 (선택)

```bash
cp .env.example .env.local
# Supabase URL, Anon Key 입력
```

`supabase/schema.sql`을 Supabase SQL Editor에서 실행한 뒤 서버 재시작.

## 기술 스택

- **Frontend**: Next.js 15 + Tailwind CSS 4
- **Storage**: 로컬 JSON (데모) / Supabase PostgreSQL (프로덕션)
- **Auth**: Supabase Auth
- **Hosting**: Vercel

## 배포

```bash
npm run build
```

Vercel 배포 시 환경변수에 Supabase 키를 설정하세요. 로컬 JSON 저장소는 Vercel에서 동작하지 않으므로 프로덕션에서는 Supabase가 필요합니다.

## License

MIT — see [LICENSE](./LICENSE)
