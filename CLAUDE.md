# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Thumb-fit is a Next.js 16 application using the App Router architecture with React 19, TypeScript 5, and Tailwind CSS v4.

### Purpose
소규모 크리에이터를 위한 썸네일/이미지 도구:
- YouTube/블로그/인스타그램용 썸네일 보정/리사이즈/패딩 추가
- 16:9, 9:16, 1:1 비율 캔버스 제공
- 이미지 업로드 후 자동 리사이즈 및 블러 배경 채우기
- 텍스트 오버레이 기능

### Component Architecture
```
components/
├── ui/           # 재사용 가능한 기본 UI 컴포넌트
└── editor/       # 썸네일 에디터 관련 컴포넌트
    ├── ThumbnailEditor.tsx   # 메인 에디터 컨테이너
    ├── CanvasPreview.tsx     # Canvas 렌더링
    ├── RatioSelector.tsx     # 비율 선택
    ├── ImageUploader.tsx     # 이미지 업로드
    ├── TextControls.tsx      # 텍스트 설정
    └── ExportButton.tsx      # 내보내기
```

### State Management Pattern
- `useReducer` + Context API 사용
- 상태 파일: `hooks/useCanvasState.ts`
- 액션: SET_RATIO, SET_IMAGE, SET_TEXT, RESET

### Canvas API Usage
- Native Canvas API (의존성 최소화)
- 유틸리티: `lib/canvas/blur.ts`, `lib/canvas/draw.ts`, `lib/canvas/text.ts`
- 렌더링 훅: `hooks/useCanvasRenderer.ts`

## Commands

```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Run production server
pnpm lint         # Run ESLint
```

## Architecture

- **App Router**: Uses Next.js App Router (`app/` directory) - not the legacy Pages Router
- **Tailwind CSS v4**: CSS-first configuration via `@import "tailwindcss"` in globals.css, uses `@theme` directive for custom properties
- **Path Aliases**: `@/*` maps to project root (configured in tsconfig.json)
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, exposed as CSS variables `--font-geist-sans` and `--font-geist-mono`

## Key Files

- `app/layout.tsx` - Root layout with font configuration and metadata
- `app/page.tsx` - Home page component
- `app/globals.css` - Global styles with Tailwind and CSS custom properties for theming
- `next.config.ts` - Next.js configuration (TypeScript format)
- `eslint.config.mjs` - ESLint flat config with Next.js core-web-vitals and TypeScript rules
