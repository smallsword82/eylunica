export const minimumPublicationDate = '2025-01-01';
export const maximumPublicationDate = '2026-12-31';
type Publication = { publishedAt?: unknown; metadataStatus?: unknown; metadataSource?: unknown; fetchedAt?: unknown };
export function publicationRejection(video: Publication, today = new Date().toISOString().slice(0,10)): string | null {
  const date = video.publishedAt;
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) return 'publication-date-unverified';
  if (date < minimumPublicationDate) return 'published-before-2025';
  if (date > maximumPublicationDate) return 'publication-after-2026';
  if (date > today) return 'publication-date-in-future';
  if (video.metadataStatus !== 'api-provided' || video.metadataSource !== 'YouTube Data API v3' || typeof video.fetchedAt !== 'string' || !Number.isFinite(Date.parse(video.fetchedAt))) return 'publication-date-unverified';
  return null;
}

// Resolved through YouTube Data API channels.list(forHandle=tonguc5).
export const allowedVideoChannelId = 'UCb-0JQ4tI03T5rHdFe2GVoA';
export const allowedVideoChannelName = 'tonguç 5. SINIF';
export function videoRejection(video: Publication & { channelId?: unknown }): string | null {
  return publicationRejection(video) || (video.channelId !== allowedVideoChannelId ? 'channel-not-allowed-or-unverified' : null);
}
