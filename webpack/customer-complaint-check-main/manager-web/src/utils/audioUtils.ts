import type { DialogueSegment } from '@/api/audioProcessing.types';

export function formatTime(seconds: number | string): string {
  const sec = typeof seconds === 'string' ? parseFloat(seconds) : seconds;

  if (isNaN(sec)) return '00:00';

  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const secs = Math.floor(sec % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function findActiveSegment(
  currentTime: number,
  segments: DialogueSegment[]
): number {
  if (!segments || segments.length === 0) return -1;

  // 接口返回的时间是毫秒,需要转换为秒
  const currentTimeMs = currentTime * 1000;

  // 按照start时间切割区间进行匹配
  // 每个segment的有效区间是: 从自身start到下一个segment的start(如果是最后一个则到自身end)
  for (let i = 0; i < segments.length; i++) {
    const currentStart = parseFloat(segments[i].start);

    // 确定当前segment的结束时间
    let currentEnd: number;
    if (i < segments.length - 1) {
      // 不是最后一个,使用下一个segment的start作为结束时间
      currentEnd = parseFloat(segments[i + 1].start);
    } else {
      // 最后一个,使用自身的end
      currentEnd = parseFloat(segments[i].end);
    }

    // 检查当前时间是否在这个区间内
    if (currentTimeMs >= currentStart && currentTimeMs < currentEnd) {
      return i;
    }
  }

  // 如果超出所有区间,返回最后一个segment
  if (currentTimeMs >= parseFloat(segments[segments.length - 1].start)) {
    return segments.length - 1;
  }

  return -1;
}

export function validateAudioUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;

  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('file://');
  }
}

export function getRoleDisplayName(role: 'customer_service' | 'visitor'): string {
  return role === 'customer_service' ? '坐席' : '客户';
}
