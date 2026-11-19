# 01: Todo 추가 및 목록 보기

**What to build:** 사용자가 한국어 반응형 화면에서 Todo를 추가하고, 저장된 Todo 목록을 최신 항목부터 볼 수 있습니다.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Todo 제목의 앞뒤 공백을 제거하고, 비어 있는 제목은 거부합니다.
- [ ] 중복 제목을 허용하고 각 Todo를 별도 항목으로 표시합니다.
- [ ] Todo를 하나의 개인 목록에 저장하고, 최신 생성 항목부터 표시합니다.
- [ ] Next.js 서버 코드에서 `@libsql/client`로 Turso에 연결하고 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`을 사용합니다.
- [ ] Turso 연결 인증 값이 브라우저에 전달되거나 애플리케이션 로그에 기록되지 않습니다.
- [ ] Todo가 새로고침 후에도 유지됩니다.
- [ ] 한국어 화면이 휴대폰과 데스크톱에서 반응형으로 동작합니다.
- [ ] 격리된 테스트 데이터베이스를 사용하는 브라우저 E2E 흐름으로 Todo 생성, 입력 검증, 정렬, 영속성을 확인합니다.
