# AGENT.md

AI 에이전트용 프로젝트 가이드라인

## Code Style & Conventions

### TypeScript
- Strict mode 사용
- 명시적 타입 선언 (any 사용 금지)
- Interface 우선 (type alias는 union/intersection에만)

### React
- 함수형 컴포넌트 + Hooks 패턴
- Props는 destructuring으로 받기
- 컴포넌트 파일명: PascalCase
- 훅 파일명: camelCase (use 접두사)

### Tailwind CSS
- 인라인 클래스 우선
- 복잡한 스타일은 globals.css에 정의
- 다크 모드: `dark:` prefix 사용

## Commit Message Format

```
<type>(<scope>): <subject>

<body>
```

### Types
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `style`: 스타일 변경 (기능 변화 없음)
- `docs`: 문서 변경
- `chore`: 설정, 빌드 관련

### Example
```
feat(canvas): add blur background effect

- Implement CSS filter blur for background
- Scale image to cover canvas area
- Apply 30px blur radius
```

## PR Guidelines

1. **제목**: `[Type] 간결한 설명`
2. **본문**: 변경 사항, 테스트 방법 포함
3. **리뷰어**: 코드 변경 시 최소 1명

## Directory Structure Rules

```
lib/           # 유틸리티 함수 (순수 함수)
hooks/         # React 커스텀 훅
components/    # React 컴포넌트
  ui/          # 재사용 가능한 기본 컴포넌트
  editor/      # 도메인 특화 컴포넌트
app/           # Next.js App Router 페이지
```

## Testing Checklist

- [ ] 비율 선택 (16:9, 9:16, 1:1) 전환 확인
- [ ] 이미지 업로드 및 블러 배경 렌더링
- [ ] 텍스트 입력/스타일/위치 변경
- [ ] PNG/JPEG 내보내기 동작
- [ ] 반응형 레이아웃 (모바일/데스크톱)
