import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse skills from string or array format
 * @param skills - Skills as string (comma-separated) or array
 * @returns Array of trimmed skill strings
 */
export function parseSkills(skills: string | string[] | undefined): string[] {
  if (!skills) {
    return [];
  }
  if (Array.isArray(skills)) {
    return skills;
  }
  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  return [];
}

export function calculateTotalExperience(
  work: ReadonlyArray<{ readonly start: string; readonly end?: string | null }>,
): string {
  const periods: Array<{ start: Date; end: Date }> = [];

  // 각 work 항목의 기간을 Date 객체로 변환
  for (const item of work) {
    const [startYear, startMonth] = item.start.split('.').map(Number);
    const startDate = new Date(startYear, startMonth - 1);

    let endDate: Date;
    if (item.end && item.end !== 'Present') {
      const [endYear, endMonth] = item.end.split('.').map(Number);
      endDate = new Date(endYear, endMonth);
    } else {
      endDate = new Date(); // 현재 날짜
    }

    periods.push({ start: startDate, end: endDate });
  }

  // 기간을 시작일 기준으로 정렬
  periods.sort((a, b) => a.start.getTime() - b.start.getTime());

  // 중복 기간 병합
  const merged: Array<{ start: Date; end: Date }> = [];
  for (const period of periods) {
    if (merged.length === 0) {
      merged.push({ ...period });
    } else {
      const last = merged[merged.length - 1];
      if (period.start <= last.end) {
        // 겹치는 경우, 더 늦은 종료일로 업데이트
        last.end = period.end > last.end ? period.end : last.end;
      } else {
        // 겹치지 않는 경우, 새 기간 추가
        merged.push({ ...period });
      }
    }
  }

  // 전체 기간 계산
  let totalMonths = 0;
  for (const period of merged) {
    const months =
      (period.end.getFullYear() - period.start.getFullYear()) * 12 +
      (period.end.getMonth() - period.start.getMonth());
    totalMonths += months;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years === 0) {
    return `${months}개월`;
  } else if (months === 0) {
    return `${years}년`;
  } else {
    return `${years}년 ${months}개월`;
  }
}
