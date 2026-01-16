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

  for (let i = 0; i < segments.length; i++) {
    const start = parseFloat(segments[i].start);
    const end = parseFloat(segments[i].end);

    if (currentTime >= start && currentTime <= end) {
      return i;
    }
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
