# Supabase 설정 (5분)

## 1. 환경변수

`.env.local` 파일:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...  (Publishable key)
```

## 2. 테이블 생성 (필수)

Supabase 대시보드 → **SQL Editor** → **New query**

프로젝트 루트의 `supabase/schema.sql` 파일 내용을 **전체 복사**하여 붙여넣고 **Run** 클릭.

## 3. 확인

```bash
yarn dev:clean
```

브라우저에서 http://localhost:3000/api/setup 접속

```json
{ "mode": "supabase", "ready": true }
```

`ready: true` 이면 배포 가능.

## 4. 배포 테스트

1. http://localhost:3000/create
2. 내용 입력 → **배포하기**
3. `/p/{uuid}` 로 이동 확인
4. `/dashboard` 에서 목록 확인
