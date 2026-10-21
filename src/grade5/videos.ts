import { videoRejection } from './video-policy';
import catalog from './video-catalog.json';
export type Video = { id: string; url: string; title: string | null; channel: string | null; channelId: string; publishedAt: string | null; duration: string | null; topicId: string; role: 'primary' | 'alternative'; status: 'approved'; curriculumVerified: true; childSafetyVerified: true; reviewedAt: string; reviewer: string; metadataStatus: 'api-provided'; metadataSource: 'YouTube Data API v3'; fetchedAt: string };
export function approvedOnly(value: unknown): Video[] {
  if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 || !('videos' in value) || !Array.isArray(value.videos)) return [];
  return value.videos.filter((v): v is Video => !!v && !videoRejection(v) && /^[\w-]{11}$/.test(v.id) && v.url === `https://www.youtube.com/watch?v=${v.id}` && typeof v.topicId === 'string' && ['primary', 'alternative'].includes(v.role) && v.status === 'approved' && v.curriculumVerified === true && v.childSafetyVerified === true && typeof v.reviewer === 'string' && !!v.reviewer.trim() && typeof v.reviewedAt === 'string' && Number.isFinite(Date.parse(v.reviewedAt)) && [v.title,v.channel,v.publishedAt,v.duration].every(x => x === null || typeof x === 'string'));
}
// Bundled JSON only: no search, metadata request, API key or admin connection.
export const approvedVideos = approvedOnly(catalog);
export function videoUrl(id: string): string { return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`; }
