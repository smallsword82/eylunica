export type StudyTerm = 'first' | 'second' | 'unknown' | 'all';
export const termLabels: Record<StudyTerm, string> = {
  first: '1. dönem', second: '2. dönem', unknown: 'Dönemi belirtilmeyen / ek çalışmalar', all: 'Tüm yıl',
};
export function matchesTerm(topic: { weeks?: number[] }, term: StudyTerm): boolean {
  if (term === 'all') return true;
  const weeks = topic.weeks || [];
  const verified = weeks.length > 0 && weeks.every(week => Number.isInteger(week) && week >= 1 && week <= 36);
  if (term === 'unknown') return !verified;
  return verified && weeks.some(week => term === 'first' ? week <= 18 : week >= 19);
}
