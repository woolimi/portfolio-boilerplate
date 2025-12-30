/** @jsxImportSource @emotion/react */
'use client';

import { TEXT_CHARS } from '@/data/resume';
import { css, keyframes } from '@emotion/react';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

export default function InteractiveHero() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [scatteredIndex, setScatteredIndex] = useState<Set<number>>(new Set());
  const hoverTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const animationTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});

  // 각 글자마다 랜덤 방향 생성 (마운트 시 한 번만)
  const randomDirections = useMemo(() => {
    const generateRandomDirection = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 30; // 30-60px 범위
      return {
        gatherX: Math.cos(angle) * distance,
        gatherY: Math.sin(angle) * distance,
        scatterX: Math.cos(angle + Math.PI) * distance, // 반대 방향
        scatterY: Math.sin(angle + Math.PI) * distance,
      };
    };

    return Array.from({ length: TEXT_CHARS.length }, () => generateRandomDirection());
  }, []);

  // keyframes 캐싱을 위한 Map
  const gatherAnimationsCache = useRef<Map<string, ReturnType<typeof keyframes>>>(new Map());
  const scatterAnimationsCache = useRef<Map<string, ReturnType<typeof keyframes>>>(new Map());

  // keyframes 생성 함수 (캐싱 포함)
  const getGatherAnimation = useCallback((startX: number, startY: number) => {
    const key = `${startX.toFixed(2)}_${startY.toFixed(2)}`;
    if (!gatherAnimationsCache.current.has(key)) {
      gatherAnimationsCache.current.set(
        key,
        keyframes`
          0% {
            opacity: 0;
            transform: scale(0.2) translate(${startX}px, ${startY}px);
            filter: blur(25px);
          }
          30% {
            opacity: 0.4;
            transform: scale(0.6) translate(${startX * 0.5}px, ${startY * 0.5}px);
            filter: blur(15px);
          }
          60% {
            opacity: 0.7;
            transform: scale(0.85) translate(${startX * 0.2}px, ${startY * 0.2}px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
            filter: blur(0px);
          }
        `,
      );
    }
    return gatherAnimationsCache.current.get(key)!;
  }, []);

  const getScatterAnimation = useCallback((endX: number, endY: number) => {
    const key = `${endX.toFixed(2)}_${endY.toFixed(2)}`;
    if (!scatterAnimationsCache.current.has(key)) {
      scatterAnimationsCache.current.set(
        key,
        keyframes`
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
            filter: blur(0px);
          }
          30% {
            opacity: 0.7;
            transform: scale(0.85) translate(${endX * 0.2}px, ${endY * 0.2}px);
            filter: blur(8px);
          }
          60% {
            opacity: 0.4;
            transform: scale(0.6) translate(${endX * 0.5}px, ${endY * 0.5}px);
            filter: blur(15px);
          }
          100% {
            opacity: 0;
            transform: scale(0.2) translate(${endX}px, ${endY}px);
            filter: blur(25px);
          }
        `,
      );
    }
    return scatterAnimationsCache.current.get(key)!;
  }, []);

  useEffect(() => {
    setMounted(true);
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseEnter = useCallback(
    (index: number) => {
      // 애니메이션이 진행 중이면 무시
      if (animatingIndex === index) {
        return;
      }

      // 기존 timeout 취소
      if (hoverTimeoutRef.current[index]) {
        clearTimeout(hoverTimeoutRef.current[index]);
      }
      setHoveredIndex(index);
      setAnimatingIndex(index);

      // scatter 애니메이션 완료 후 상태 업데이트 (0.8초 후)
      if (animationTimeoutRef.current[index]) {
        clearTimeout(animationTimeoutRef.current[index]);
      }
      animationTimeoutRef.current[index] = setTimeout(() => {
        setAnimatingIndex(null);
        setScatteredIndex((prev) => {
          if (!prev.has(index)) {
            const next = new Set(prev);
            next.add(index);
            return next;
          }
          return prev;
        });
      }, 800);
    },
    [animatingIndex],
  );

  const handleMouseLeave = useCallback((index: number) => {
    // 약간의 지연을 두어 flickering 방지
    hoverTimeoutRef.current[index] = setTimeout(() => {
      setHoveredIndex(null);
      // scatter된 상태면 다시 나타나도록
      setScatteredIndex((prev) => {
        if (prev.has(index)) {
          const next = new Set(prev);
          next.delete(index);
          return next;
        }
        return prev;
      });
    }, 50);
  }, []);

  useEffect(() => {
    return () => {
      // cleanup
      Object.values(hoverTimeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      Object.values(animationTimeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const heroTitleStyle = useMemo(
    () => css`
      opacity: ${isVisible ? 1 : 0};
      font-family: var(--font-playfair), serif;
      position: relative;
      will-change: opacity;
      transition: opacity 0.3s ease-out;
      line-height: 1.2;
      padding-bottom: 0.1em;
    `,
    [isVisible],
  );

  // 각 글자별 스타일 메모이제이션
  const charStyles = useMemo(() => {
    return randomDirections.map((direction, index) => {
      const delay = index * 0.1;
      const gatherAnim = getGatherAnimation(direction.gatherX, direction.gatherY);
      const scatterAnim = getScatterAnimation(direction.scatterX, direction.scatterY);

      return {
        direction,
        delay,
        gatherAnim,
        scatterAnim,
      };
    });
  }, [randomDirections, getGatherAnimation, getScatterAnimation]);

  const heroCharStyle = useCallback(
    (index: number) => {
      const isHovered = hoveredIndex === index;
      const isAnimating = animatingIndex === index;
      const isScattered = scatteredIndex.has(index);
      const charStyle = charStyles[index];

      if (!charStyle) {
        return css`
          display: inline-block;
        `;
      }

      const { delay, gatherAnim, scatterAnim } = charStyle;

      return css`
        display: inline-block;
        position: relative;
        cursor: pointer;
        will-change: transform, opacity, filter;
        vertical-align: baseline;
        contain: style paint;

        ${!isScattered
          ? css`
              opacity: 0;
              animation: ${gatherAnim} 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
              animation-fill-mode: forwards;
            `
          : css`
              opacity: 0;
            `}

        ${isHovered && !isAnimating && !isScattered
          ? css`
              animation: ${scatterAnim} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
              animation-fill-mode: forwards;
            `
          : isScattered && !isHovered
            ? css`
                animation: ${gatherAnim} 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                animation-fill-mode: forwards;
              `
            : ''}
      `;
    },
    [hoveredIndex, animatingIndex, scatteredIndex, charStyles],
  );

  if (!mounted) {
    return (
      <div className="relative h-screen w-full overflow-hidden bg-white">
        {/* 메인 텍스트 */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="relative w-full px-4">
            <h1
              css={heroTitleStyle}
              className="w-full text-center text-7xl leading-tight font-bold tracking-normal text-black md:text-9xl"
            >
              {TEXT_CHARS.map((char, index) => (
                <span key={index} className="inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* 개선된 건축 도면 스타일 배경 */}
      <div className="absolute inset-0">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 더 명확한 그리드 패턴 */}
            <pattern
              id="architectural-grid"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* 주요 그리드 라인 */}
              <line x1="0" y1="0" x2="80" y2="0" stroke="black" strokeWidth="0.5" opacity="0.2" />
              <line x1="0" y1="0" x2="0" y2="80" stroke="black" strokeWidth="0.5" opacity="0.2" />

              {/* 보조 그리드 라인 */}
              <line
                x1="0"
                y1="20"
                x2="80"
                y2="20"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />
              <line
                x1="0"
                y1="40"
                x2="80"
                y2="40"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />
              <line
                x1="0"
                y1="60"
                x2="80"
                y2="60"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />
              <line
                x1="20"
                y1="0"
                x2="20"
                y2="80"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />
              <line
                x1="40"
                y1="0"
                x2="40"
                y2="80"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />
              <line
                x1="60"
                y1="0"
                x2="60"
                y2="80"
                stroke="black"
                strokeWidth="0.3"
                opacity="0.12"
              />

              {/* 교차점 마커 */}
              <circle cx="0" cy="0" r="1.2" fill="black" opacity="0.25" />
              <circle cx="40" cy="40" r="1" fill="black" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#architectural-grid)" />
        </svg>
      </div>

      {/* 도면 스타일 보조선 */}
      <div className="absolute inset-0 opacity-15">
        {/* 대각선 보조선 */}
        <div className="absolute top-0 left-0 h-full w-full">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="black"
              strokeWidth="0.5"
              opacity="0.1"
            />
            <line
              x1="100%"
              y1="0"
              x2="0"
              y2="100%"
              stroke="black"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </svg>
        </div>
      </div>

      {/* 메인 텍스트 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="relative w-full px-4">
          <h1
            css={heroTitleStyle}
            className="w-full text-center text-7xl leading-relaxed font-bold tracking-normal text-black md:text-9xl"
          >
            {TEXT_CHARS.map((char, index) => (
              <span
                key={index}
                css={heroCharStyle(index)}
                className="inline-block"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </div>
  );
}
